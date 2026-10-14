from typing import Annotated

from fastapi import Cookie, Depends

from app.common.exceptions.app_exceptions import UnauthorizedException
from app.common.security.jwt import decode_access_token
from app.config.settings import get_settings
from app.modules.auth.services.auth_service import AuthService
from app.modules.users.dependencies import get_user_service
from app.modules.users.models.user_model import User
from app.modules.users.services.user_service import UserService


settings = get_settings()


def get_auth_service(
    user_service: UserService = Depends(get_user_service),
) -> AuthService:
    return AuthService(user_service)


async def get_current_user(
    access_token: Annotated[
        str | None,
        Cookie(alias=settings.jwt_cookie_name),
    ] = None,
    user_service: UserService = Depends(get_user_service),
) -> User:
    if not access_token:
        raise UnauthorizedException(
            message="Authentication required.",
            error_code="AUTHENTICATION_REQUIRED",
        )

    user_id = decode_access_token(access_token)

    return await user_service.get_by_id(user_id)