import math

from app.common.exceptions.app_exceptions import NotFoundException
from app.common.logging.logger import get_logger
from app.modules.job_applications.models.job_application_model import (
    JobApplication,
    JobApplicationStatus,
)
from app.modules.job_applications.repositories.job_application_repository import (
    JobApplicationRepository,
)

logger = get_logger(__name__)

class JobApplicationService:
    def __init__(
        self,
        repository: JobApplicationRepository,
    ) -> None:
        self.repository = repository

    async def create(
        self,
        created_by: int,
        resume_profile_id: int,
        company_name: str,
        job_description: str,
    ) -> JobApplication:
        job_application = JobApplication(
            created_by=created_by,
            resume_profile_id=resume_profile_id,
            company_name=company_name.strip(),
            job_role="TEMPORARY",
            job_description=job_description.strip(),
        )

        created_application = await self.repository.create(
            job_application
        )

        logger.info(
            "Job application created successfully. "
            f"job_application_id={created_application.id}, "
            f"created_by={created_by}, "
            f"resume_profile_id={resume_profile_id}"
        )

        return created_application

    async def get_by_id(
        self,
        created_by: int,
        job_application_id: int,
    ) -> JobApplication:
        job_application = await self.repository.get_by_id(
            created_by=created_by,
            job_application_id=job_application_id,
        )

        if job_application is None:
            raise NotFoundException(
                message="Job application not found.",
                error_code="JOB_APPLICATION_NOT_FOUND",
            )

        return job_application

    async def get_all(
        self,
        created_by: int,
        resume_profile_id: int,
        page: int,
        page_size: int,
    ) -> tuple[list[tuple[JobApplication, int | None]], int, int]:
        job_applications, total = (
            await self.repository.get_all_by_resume_profile_id(
                created_by=created_by,
                resume_profile_id=resume_profile_id,
                page=page,
                page_size=page_size,
            )
        )

        total_pages = math.ceil(total / page_size) if total else 0

        return job_applications, total, total_pages

    async def update_status(
        self,
        job_application: JobApplication,
    ) -> JobApplication:
        return await self.repository.update_job_application_status(
            job_application
        )

    async def get_status(
        self,
        created_by: int,
        job_application_id: int,
    ) -> tuple[int, JobApplicationStatus]:
        result = await self.repository.get_status(
            created_by=created_by,
            job_application_id=job_application_id,
        )

        if result is None:
            raise NotFoundException(
                message="Job application not found.",
                error_code="JOB_APPLICATION_NOT_FOUND",
            )

        return result

    async def delete_job_application(
        self,
        created_by: int,
        job_application_id: int,
    ) -> None:
        deleted = await self.repository.delete(
            created_by=created_by,
            job_application_id=job_application_id,
        )

        if not deleted:
            raise NotFoundException(
                message="Job application not found.",
                error_code="JOB_APPLICATION_NOT_FOUND",
            )