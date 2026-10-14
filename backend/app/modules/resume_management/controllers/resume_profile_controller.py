from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.common.responses.response import ApiResponse
from app.modules.auth.dependencies import get_current_user
from app.modules.resume_management.schemas.resume_profile_schema import (
    ResumeProfileResponse,
)
from app.modules.resume_management.services.resume_profile_service import (
    ResumeProfileService,
)
from app.modules.resume_management.dependencies import get_resume_profile_service
from app.modules.users.models.user_model import User


router = APIRouter(
    prefix="/api/v1/resume-profiles",
    tags=["Resume Profiles"],
)


@router.post(
    "",
    response_model=ApiResponse[ResumeProfileResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_resume_profile(
    name: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
    current_user: User = Depends(get_current_user),
    resume_profile_service: ResumeProfileService = Depends(
        get_resume_profile_service
    ),
) -> ApiResponse[ResumeProfileResponse]:
    file_content = await file.read()

    resume_profile = await resume_profile_service.create_resume_profile(
        user_id=current_user.id,
        profile_name=name,
        file_name=file.filename or "",
        file_content=file_content,
    )

    return ApiResponse(
        success=True,
        message="Resume profile created successfully.",
        data=ResumeProfileResponse.model_validate(resume_profile),
    )

@router.get(
    "",
    response_model=ApiResponse[list[ResumeProfileResponse]],
    status_code=status.HTTP_200_OK,
)
async def get_resume_profiles(
    current_user: User = Depends(get_current_user),
    resume_profile_service: ResumeProfileService = Depends(
        get_resume_profile_service
    ),
) -> ApiResponse[list[ResumeProfileResponse]]:
    resume_profiles = await resume_profile_service.get_resume_profiles(
        user_id=current_user.id,
    )

    return ApiResponse(
        success=True,
        message="Resume profiles fetched successfully.",
        data=[
            ResumeProfileResponse.model_validate(resume_profile)
            for resume_profile in resume_profiles
        ],
    )


@router.delete(
    "/{resume_profile_id}",
    response_model=ApiResponse[None],
)
async def delete_resume_profile(
    resume_profile_id: int,
    current_user: User = Depends(get_current_user),
    service: ResumeProfileService = Depends(
        get_resume_profile_service,
    ),
) -> ApiResponse[None]:
    await service.delete_resume_profile(
        user_id=current_user.id,
        resume_profile_id=resume_profile_id,
    )

    return ApiResponse(
        success=True,
        message="Resume profile deleted successfully.",
        data=None,
    )