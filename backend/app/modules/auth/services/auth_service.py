from app.common.exceptions.app_exceptions import UnauthorizedException
from app.common.security.jwt import create_access_token
from app.common.security.password import verify_password
from app.modules.auth.schemas.auth_schema import SignupRequest
from app.modules.users.models.user_model import User
from app.modules.users.services.user_service import UserService


class AuthService:
    def __init__(
        self,
        user_service: UserService,
    ) -> None:
        self.user_service = user_service

    async def signup(
        self,
        request: SignupRequest,
    ) -> tuple[User, str]:
        user = await self.user_service.create_user(
            first_name=request.first_name,
            last_name=request.last_name,
            email=str(request.email),
            password=request.password,
        )

        token = create_access_token(user.id)

        return user, token

    async def login(
        self,
        email: str,
        password: str,
    ) -> tuple[User, str]:
        user = await self.user_service.get_by_email(email)

        if user is None or not verify_password(
            password,
            user.password_hash,
        ):
            raise UnauthorizedException(
                message="Invalid email or password.",
                error_code="INVALID_CREDENTIALS",
            )

        token = create_access_token(user.id)

        return user, token