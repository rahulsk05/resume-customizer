from app.common.exceptions.app_exceptions import NotFoundException
from app.common.docx.resume_docx_renderer import ResumeDocxRenderer
from app.modules.analysis.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


class ResumeDocxService:
    """Generates a tailored resume DOCX from a completed analysis result."""

    def __init__(
        self,
        analysis_result_repository: AnalysisResultRepository,
        resume_docx_renderer: ResumeDocxRenderer,
    ) -> None:
        self.analysis_result_repository = analysis_result_repository
        self.resume_docx_renderer = resume_docx_renderer

    async def generate_tailored_resume_docx(
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

        return self.resume_docx_renderer.render(tailored_resume)