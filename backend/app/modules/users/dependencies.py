from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_auth_db_session
from app.modules.users.repositories.user_repository import UserRepository
from app.modules.users.services.user_service import UserService


def get_user_repository(
    session: AsyncSession = Depends(get_auth_db_session),
) -> UserRepository:
    return UserRepository(session)


def get_user_service(
    repository: UserRepository = Depends(get_user_repository),
) -> UserService:
    return UserService(repository)