from fastapi import APIRouter, Depends, Response, status

from app.common.responses.response import ApiResponse
from app.config.settings import get_settings
from app.modules.auth.dependencies import (
    get_auth_service,
    get_current_user,
)
from app.modules.auth.schemas.auth_schema import (
    LoginRequest,
    SignupRequest,
    UserResponse,
)
from app.modules.auth.services.auth_service import AuthService
from app.modules.users.models.user_model import User


settings = get_settings()

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


def set_auth_cookie(
    response: Response,
    access_token: str,
) -> None:
    response.set_cookie(
        key=settings.jwt_cookie_name,
        value=access_token,
        httponly=settings.jwt_cookie_http_only,
        secure=settings.jwt_cookie_secure,
        samesite=settings.jwt_cookie_same_site,
        max_age=settings.jwt_expires_in_minutes * 60,
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.jwt_cookie_name,
        httponly=settings.jwt_cookie_http_only,
        secure=settings.jwt_cookie_secure,
        samesite=settings.jwt_cookie_same_site,
    )


@router.post(
    "/signup",
    response_model=ApiResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    request: SignupRequest,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
):
    user, access_token = await auth_service.signup(request)

    set_auth_cookie(response, access_token)

    return ApiResponse(
        success=True,
        message="Account created successfully.",
        data=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=ApiResponse[UserResponse],
)
async def login(
    request: LoginRequest,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
):
    user, access_token = await auth_service.login(
        email=str(request.email),
        password=request.password,
    )

    set_auth_cookie(response, access_token)

    return ApiResponse(
        success=True,
        message="Login successful.",
        data=UserResponse.model_validate(user),
    )


@router.post(
    "/logout",
    response_model=ApiResponse[None],
)
async def logout(
    response: Response,
):
    response.delete_cookie(
        key=settings.jwt_cookie_name,
        path="/",
    )

    return ApiResponse(
        success=True,
        message="Logout successful.",
    )


@router.get(
    "/me",
    response_model=ApiResponse[UserResponse],
)
async def get_current_authenticated_user(
    current_user: User = Depends(get_current_user),
):
    return ApiResponse(
        success=True,
        message="Current user fetched successfully.",
        data=UserResponse.model_validate(current_user),
    )