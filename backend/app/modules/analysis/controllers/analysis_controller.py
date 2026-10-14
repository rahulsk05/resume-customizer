from fastapi import APIRouter, BackgroundTasks, Depends, Response, status

from app.common.responses.response import ApiResponse
from app.modules.analysis.dependencies import get_analysis_service, get_resume_docx_service, get_resume_pdf_service
from app.modules.analysis.schemas.analysis_schema import (
    AnalysisResultResponse,
)
from app.modules.analysis.services.analysis_service import AnalysisService
from app.modules.analysis.services.resume_docx_service import ResumeDocxService
from app.modules.analysis.services.resume_pdf_service import ResumePdfService
from app.modules.auth.dependencies import get_current_user
from app.modules.job_applications.models.job_application_model import JobApplicationStatus
from app.modules.job_applications.schemas.job_application_schema import (
    JobApplicationResponse,
)
from app.modules.users.models.user_model import User


router = APIRouter(
    prefix="/api/v1/job-applications",
    tags=["Analysis"],
)


@router.post(
    "/{job_application_id}/analysis",
    response_model=ApiResponse[JobApplicationResponse],
    status_code=status.HTTP_202_ACCEPTED,
)
async def start_analysis(
    job_application_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    service: AnalysisService = Depends(get_analysis_service),
) -> ApiResponse[JobApplicationResponse]:
    job_application = await service.start_analysis(
        created_by=current_user.id,
        job_application_id=job_application_id,
    )

    if job_application.status.value == JobApplicationStatus.PROCESSING:
        background_tasks.add_task(
            service.process_analysis,
            created_by=current_user.id,
            job_application_id=job_application_id,
        )

    return ApiResponse(
        success=True,
        message="Resume analysis started successfully.",
        data=JobApplicationResponse.model_validate(job_application),
    )


@router.get(
    "/{job_application_id}/analysis",
    response_model=ApiResponse[AnalysisResultResponse],
)
async def get_analysis_result(
    job_application_id: int,
    current_user: User = Depends(get_current_user),
    service: AnalysisService = Depends(get_analysis_service),
) -> ApiResponse[AnalysisResultResponse]:
    analysis_result = await service.get_analysis_result(
        created_by=current_user.id,
        job_application_id=job_application_id,
    )

    return ApiResponse(
        success=True,
        message="Analysis result retrieved successfully.",
        data=AnalysisResultResponse.model_validate(analysis_result),
    )

@router.get(
    "/{job_application_id}/resume/pdf",
    response_class=Response,
)
async def download_tailored_resume_pdf(
    job_application_id: int,
    current_user: User = Depends(get_current_user),
    service: ResumePdfService = Depends(get_resume_pdf_service),
) -> Response:
    pdf_content = await service.generate_tailored_resume_pdf(
        created_by=current_user.id,
        job_application_id=job_application_id,
    )

    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                'attachment; filename="tailored_resume.pdf"'
            )
        },
    )

@router.get(
    "/{job_application_id}/resume/docx",
    response_class=Response,
)
async def download_tailored_resume_docx(
    job_application_id: int,
    current_user: User = Depends(get_current_user),
    service: ResumeDocxService = Depends(get_resume_docx_service),
) -> Response:
    docx_content = await service.generate_tailored_resume_docx(
        created_by=current_user.id,
        job_application_id=job_application_id,
    )

    return Response(
        content=docx_content,
        media_type=(
            "application/vnd.openxmlformats-officedocument"
            ".wordprocessingml.document"
        ),
        headers={
            "Content-Disposition": (
                'attachment; filename="tailored_resume.docx"'
            )
        },
    )