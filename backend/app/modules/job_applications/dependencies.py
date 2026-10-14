from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.modules.job_applications.repositories.job_application_repository import (
    JobApplicationRepository,
)
from app.modules.job_applications.services.job_application_service import (
    JobApplicationService,
)


def get_job_application_repository(
    session: AsyncSession = Depends(get_db_session),
) -> JobApplicationRepository:
    return JobApplicationRepository(session)


def get_job_application_service(
    repository: JobApplicationRepository = Depends(
        get_job_application_repository
    ),
) -> JobApplicationService:
    return JobApplicationService(
        repository=repository,
    )