from fastapi import APIRouter, Depends, Query, status

from app.common.responses.response import ApiResponse
from app.modules.auth.dependencies import get_current_user
from app.modules.job_applications.dependencies import (
    get_job_application_service,
)
from app.modules.job_applications.schemas.job_application_schema import (
    CreateJobApplicationRequest,
    JobApplicationResponse,
    PaginatedJobApplicationResponse,
    JobApplicationStatusResponse,
)
from app.modules.job_applications.services.job_application_service import (
    JobApplicationService,
)
from app.modules.users.models.user_model import User


router = APIRouter(
    prefix="/api/v1/job-applications",
    tags=["Job Applications"],
)


@router.post(
    "",
    response_model=ApiResponse[JobApplicationResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_job_application(
    request: CreateJobApplicationRequest,
    current_user: User = Depends(get_current_user),
    service: JobApplicationService = Depends(
        get_job_application_service,
    ),
) -> ApiResponse[JobApplicationResponse]:
    job_application = await service.create(
        created_by=current_user.id,
        resume_profile_id=request.resume_profile_id,
        company_name=request.company_name,
        job_description=request.job_description,
    )

    return ApiResponse(
        success=True,
        message="Job application created successfully.",
        data=JobApplicationResponse.model_validate(job_application),
    )


@router.get(
    "/resume-profile/{resume_profile_id}",
    response_model=ApiResponse[PaginatedJobApplicationResponse],
)
async def get_job_applications(
    resume_profile_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=6, ge=1, le=6),
    current_user: User = Depends(get_current_user),
    service: JobApplicationService = Depends(
        get_job_application_service,
    ),
) -> ApiResponse[PaginatedJobApplicationResponse]:
    job_applications, total, total_pages = await service.get_all(
        created_by=current_user.id,
        resume_profile_id=resume_profile_id,
        page=page,
        page_size=page_size,
    )

    return ApiResponse(
        success=True,
        message="Job applications retrieved successfully.",
        data=PaginatedJobApplicationResponse(
            items=[
                JobApplicationResponse(
                    id=application.id,
                    created_by=application.created_by,
                    resume_profile_id=application.resume_profile_id,
                    company_name=application.company_name,
                    job_role=application.job_role,
                    job_description=application.job_description,
                    status=application.status,
                    error_message=application.error_message,
                    match_score=match_score,
                    created_at=application.created_at,
                    updated_at=application.updated_at,
                )
                for application, match_score in job_applications
            ],
            page=page,
            page_size=page_size,
            total=total,
            total_pages=total_pages,
        ),
    )


@router.get(
    "/{job_application_id}/status",
    response_model=ApiResponse[JobApplicationStatusResponse],
)
async def get_job_application_status(
    job_application_id: int,
    current_user: User = Depends(get_current_user),
    service: JobApplicationService = Depends(get_job_application_service),
) -> ApiResponse[JobApplicationStatusResponse]:
    application_id, status_value = await service.get_status(
        created_by=current_user.id,
        job_application_id=job_application_id,
    )

    return ApiResponse(
        success=True,
        message="Job application status retrieved successfully.",
        data=JobApplicationStatusResponse(
            id=application_id,
            status=status_value,
        ),
    )


@router.get(
    "/{job_application_id}",
    response_model=ApiResponse[JobApplicationResponse],
)
async def get_job_application(
    job_application_id: int,
    current_user: User = Depends(get_current_user),
    service: JobApplicationService = Depends(
        get_job_application_service,
    ),
) -> ApiResponse[JobApplicationResponse]:
    job_application = await service.get_by_id(
        created_by=current_user.id,
        job_application_id=job_application_id,
    )

    return ApiResponse(
        success=True,
        message="Job application retrieved successfully.",
        data=JobApplicationResponse.model_validate(job_application),
    )


@router.delete(
    "/{job_application_id}",
    response_model=ApiResponse[None],
)
async def delete_job_application(
    job_application_id: int,
    current_user: User = Depends(get_current_user),
    service: JobApplicationService = Depends(
        get_job_application_service,
    ),
) -> ApiResponse[None]:
    await service.delete_job_application(
        created_by=current_user.id,
        job_application_id=job_application_id,
    )

    return ApiResponse(
        success=True,
        message="Job application deleted successfully.",
        data=None,
    )