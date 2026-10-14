from app.common.exceptions.app_exceptions import NotFoundException
from app.common.pdf.resume_pdf_renderer import ResumePdfRenderer
from app.modules.analysis.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


class ResumePdfService:
    def __init__(
        self,
        analysis_result_repository: AnalysisResultRepository,
        resume_pdf_renderer: ResumePdfRenderer,
    ) -> None:
        self.analysis_result_repository = analysis_result_repository
        self.resume_pdf_renderer = resume_pdf_renderer

    async def generate_tailored_resume_pdf(
        self,
        created_by: int,
        job_application_id: int,
    ) -> bytes:
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

        tailored_resume = ResumeStructuredContent.model_validate(
            analysis_result.tailored_resume
        )

        return self.resume_pdf_renderer.render(tailored_resume)