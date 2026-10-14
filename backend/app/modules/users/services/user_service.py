from app.common.exceptions.app_exceptions import (
    ConflictException,
    NotFoundException,
)
from app.common.logging.logger import get_logger
from app.common.security.password import hash_password
from app.modules.users.models.user_model import User
from app.modules.users.repositories.user_repository import UserRepository


logger = get_logger(__name__)


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def get_by_email(self, email: str) -> User | None:
        normalized_email = email.strip().lower()

        return await self.repository.get_by_email(
            normalized_email
        )

    async def get_by_id(self, user_id: int) -> User:
        user = await self.repository.get_by_id(user_id)

        if user is None:
            raise NotFoundException(
                message="User not found.",
                error_code="USER_NOT_FOUND",
            )

        return user

    async def create_user(
        self,
        first_name: str,
        last_name: str,
        email: str,
        password: str,
    ) -> User:
        normalized_first_name = first_name.strip()
        normalized_last_name = last_name.strip()
        normalized_email = email.strip().lower()

        existing_user = await self.repository.get_by_email(
            normalized_email
        )

        if existing_user is not None:
            raise ConflictException(
                message="A user with this email already exists.",
                error_code="USER_ALREADY_EXISTS",
            )

        try:
            password_hash = hash_password(password)

            user = User(
                first_name=normalized_first_name,
                last_name=normalized_last_name,
                email=normalized_email,
                password_hash=password_hash,
            )

            created_user = await self.repository.create(user)

            logger.info(
                "User created successfully | user_id=%s",
                created_user.id,
            )

            return created_user

        except ConflictException:
            raise

        except Exception:
            logger.exception(
                "Unexpected error while creating user"
            )
            raise