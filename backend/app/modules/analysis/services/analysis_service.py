from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.client import EmbeddingClient
from app.ai.gemini.client import GeminiClient
from app.common.exceptions.app_exceptions import NotFoundException
from app.common.logging.logger import get_logger
from app.database.session import AsyncSessionLocal
from app.modules.analysis.models.analysis_result_model import AnalysisResult
from app.modules.analysis.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.modules.analysis.schemas.analysis_schema import (
    AnalysisResult as AnalysisResultSchema,
)
from app.modules.job_applications.models.job_application_model import (
    JobApplication,
    JobApplicationStatus,
)
from app.modules.job_applications.repositories.job_application_repository import (
    JobApplicationRepository,
)
from app.modules.job_applications.services.job_application_service import (
    JobApplicationService,
)
from app.modules.resume_management.repositories.resume_content_repository import (
    ResumeContentRepository,
)
from app.modules.resume_management.repositories.resume_embedding_repository import (
    ResumeEmbeddingRepository,
)
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)
from app.modules.resume_management.services.resume_content_service import (
    ResumeContentService,
)
from app.modules.resume_management.services.resume_embedding_service import (
    ResumeEmbeddingService,
)

logger = get_logger(__name__)


class AnalysisService:
    def __init__(
        self,
        session: AsyncSession,
        analysis_result_repository: AnalysisResultRepository,
        job_application_service: JobApplicationService,
        embedding_client: EmbeddingClient,
        gemini_client: GeminiClient,
    ) -> None:
        self.session = session
        self.analysis_result_repository = analysis_result_repository
        self.job_application_service = job_application_service
        self.embedding_client = embedding_client
        self.gemini_client = gemini_client

    async def start_analysis(
        self,
        created_by: int,
        job_application_id: int,
    ) -> JobApplication:
        job_application = await self.job_application_service.get_by_id(
            created_by=created_by,
            job_application_id=job_application_id,
        )

        existing_result = (
            await self.analysis_result_repository.get_by_job_application_id(
                created_by=created_by,
                job_application_id=job_application_id,
            )
        )

        if existing_result is not None:
            return job_application

        if job_application.status == JobApplicationStatus.PROCESSING:
            return job_application

        job_application.status = JobApplicationStatus.PROCESSING
        job_application.error_message = None

        await self.job_application_service.update_status(
            job_application=job_application,
        )

        await self.session.commit()

        return job_application

    async def process_analysis(
        self,
        created_by: int,
        job_application_id: int,
    ) -> None:
        async with AsyncSessionLocal() as session:
            job_application_repository = JobApplicationRepository(session)
            job_application_service = JobApplicationService(
                repository=job_application_repository,
            )

            analysis_result_repository = AnalysisResultRepository(session)

            resume_content_repository = ResumeContentRepository(session)
            resume_content_service = ResumeContentService(
                resume_content_repository=resume_content_repository,
                gemini_client=self.gemini_client,
            )

            resume_embedding_repository = ResumeEmbeddingRepository(session)
            resume_embedding_service = ResumeEmbeddingService(
                resume_embedding_repository=resume_embedding_repository,
                embedding_client=self.embedding_client,
            )

            try:
                job_application = await job_application_service.get_by_id(
                    created_by=created_by,
                    job_application_id=job_application_id,
                )

                if job_application.status != JobApplicationStatus.PROCESSING:
                    return

                existing_result = (
                    await analysis_result_repository.get_by_job_application_id(
                        created_by=created_by,
                        job_application_id=job_application_id,
                    )
                )

                if existing_result is not None:
                    return

                resume_content = await resume_content_service.get_by_resume_profile_id(
                    resume_profile_id=job_application.resume_profile_id,
                )

                resume = ResumeStructuredContent.model_validate(
                    resume_content.structured_content
                )

                job_description_embedding = (
                    await self.embedding_client.generate_embedding(
                        job_application.job_description
                    )
                )

                relevant_embeddings = (
                    await resume_embedding_service.get_relevant_embeddings(
                        created_by=created_by,
                        resume_profile_id=job_application.resume_profile_id,
                        query_embedding=job_description_embedding,
                        limit=10,
                    )
                )

                retrieved_evidence = [
                    embedding.content
                    for embedding in relevant_embeddings
                ]

                analysis = await self.gemini_client.analyze_job_application(
                    job_description=job_application.job_description,
                    resume=resume,
                    retrieved_evidence=retrieved_evidence,
                )

                self._validate_analysis_result(
                    original_resume=resume,
                    analysis=analysis,
                )

                if not analysis.job_role:
                    raise ValueError(
                        "Gemini analysis did not return a job role."
                    )

                job_application.job_role = analysis.job_role

                analysis_result = AnalysisResult(
                    created_by=created_by,
                    job_application_id=job_application.id,
                    match_score=analysis.match_score,
                    feedback=analysis.feedback.model_dump(),
                    suggestions=[
                        suggestion.model_dump()
                        for suggestion in analysis.suggestions
                    ],
                    tailored_resume=analysis.tailored_resume.model_dump(),
                    changes=[
                        change.model_dump()
                        for change in analysis.changes
                    ],
                )

                await analysis_result_repository.create(
                    analysis_result=analysis_result,
                )

                job_application.status = JobApplicationStatus.COMPLETED
                job_application.error_message = None

                await job_application_service.update_status(
                    job_application=job_application,
                )

                await session.commit()

                logger.info(
                    "Analysis completed successfully for job application %s.",
                    job_application_id,
                )

            except Exception:
                await session.rollback()

                logger.exception(
                    "Analysis failed for job application %s.",
                    job_application_id,
                )

                job_application = await job_application_service.get_by_id(
                    created_by=created_by,
                    job_application_id=job_application_id,
                )

                job_application.status = JobApplicationStatus.FAILED
                job_application.error_message = (
                    "Unable to complete resume analysis. Please try again."
                )

                await job_application_service.update_status(
                    job_application=job_application,
                )

                await session.commit()

    async def get_analysis_result(
        self,
        created_by: int,
        job_application_id: int,
    ) -> AnalysisResult:
        analysis_result = (
            await self.analysis_result_repository.get_by_job_application_id(
                created_by=created_by,
                job_application_id=job_application_id,
            )
        )

        if analysis_result is None:
            raise NotFoundException(
                message="Analysis result not found.",
                error_code="ANALYSIS_RESULT_NOT_FOUND",
            )

        return analysis_result

    @staticmethod
    def _validate_analysis_result(
        original_resume: ResumeStructuredContent,
        analysis: AnalysisResultSchema,
    ) -> None:
        if (
            analysis.tailored_resume.personal_information
            != original_resume.personal_information
        ):
            raise ValueError(
                "Personal information cannot be modified during tailoring."
            )

        if analysis.tailored_resume.education != original_resume.education:
            raise ValueError(
                "Education cannot be modified during tailoring."
            )

        if (
            analysis.tailored_resume.certifications
            != original_resume.certifications
        ):
            raise ValueError(
                "Certifications cannot be modified during tailoring."
            )