from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.exceptions.app_exceptions import (
    AppException,
    ConflictException,
)
from app.common.logging.logger import get_logger
from app.modules.users.models.user_model import User


logger = get_logger(__name__)


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, user_id: int) -> User | None:
        try:
            result = await self.session.execute(
                select(User).where(User.id == user_id)
            )

            return result.scalar_one_or_none()

        except SQLAlchemyError:
            logger.exception(
                "Failed to retrieve user | user_id=%s",
                user_id,
            )

            raise AppException(
                message="Unable to retrieve user.",
                status_code=500,
                error_code="USER_RETRIEVAL_FAILED",
            )

    async def get_by_email(self, email: str) -> User | None:
        try:
            result = await self.session.execute(
                select(User).where(User.email == email)
            )

            return result.scalar_one_or_none()

        except SQLAlchemyError:
            logger.exception("Failed to retrieve user by email")

            raise AppException(
                message="Unable to retrieve user.",
                status_code=500,
                error_code="USER_RETRIEVAL_FAILED",
            )

    async def create(self, user: User) -> User:
        try:
            self.session.add(user)

            await self.session.flush()
            await self.session.refresh(user)

            return user

        except IntegrityError:
            await self.session.rollback()

            logger.warning(
                "User creation failed due to database constraint"
            )

            raise ConflictException(
                message="A user with this email already exists.",
                error_code="USER_ALREADY_EXISTS",
            )

        except SQLAlchemyError:
            await self.session.rollback()

            logger.exception("Failed to create user")

            raise AppException(
                message="Unable to create user.",
                status_code=500,
                error_code="USER_CREATION_FAILED",
            )