from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.client import EmbeddingClient
from app.ai.gemini.client import GeminiClient
from app.common.docx.resume_docx_renderer import ResumeDocxRenderer
from app.common.pdf.resume_pdf_renderer import ResumePdfRenderer
from app.database.session import get_db_session
from app.modules.analysis.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.modules.analysis.services.analysis_service import AnalysisService
from app.modules.analysis.services.resume_docx_service import ResumeDocxService
from app.modules.analysis.services.resume_pdf_service import ResumePdfService
from app.modules.job_applications.dependencies import (
    get_job_application_service,
)
from app.modules.job_applications.services.job_application_service import (
    JobApplicationService,
)
from app.modules.resume_management.dependencies import (
    get_embedding_client,
    get_gemini_client,
)


def get_analysis_result_repository(
    session: AsyncSession = Depends(get_db_session),
) -> AnalysisResultRepository:
    return AnalysisResultRepository(session)


def get_analysis_service(
    session: AsyncSession = Depends(get_db_session),
    analysis_result_repository: AnalysisResultRepository = Depends(
        get_analysis_result_repository,
    ),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service,
    ),
    embedding_client: EmbeddingClient = Depends(
        get_embedding_client,
    ),
    gemini_client: GeminiClient = Depends(
        get_gemini_client,
    ),
) -> AnalysisService:
    return AnalysisService(
        session=session,
        analysis_result_repository=analysis_result_repository,
        job_application_service=job_application_service,
        embedding_client=embedding_client,
        gemini_client=gemini_client,
    )

def get_resume_pdf_renderer() -> ResumePdfRenderer:
    return ResumePdfRenderer()


def get_resume_pdf_service(
    analysis_result_repository: AnalysisResultRepository = Depends(
        get_analysis_result_repository
    ),
    resume_pdf_renderer: ResumePdfRenderer = Depends(
        get_resume_pdf_renderer
    ),
) -> ResumePdfService:
    return ResumePdfService(
        analysis_result_repository=analysis_result_repository,
        resume_pdf_renderer=resume_pdf_renderer,
    )

def get_resume_docx_renderer() -> ResumeDocxRenderer:
    return ResumeDocxRenderer()

def get_resume_docx_service(
    analysis_result_repository: AnalysisResultRepository = Depends(
        get_analysis_result_repository
    ),
    resume_docx_renderer: ResumeDocxRenderer = Depends(
        get_resume_docx_renderer
    ),
) -> ResumeDocxService:
    return ResumeDocxService(
        analysis_result_repository=analysis_result_repository,
        resume_docx_renderer=resume_docx_renderer,
    )