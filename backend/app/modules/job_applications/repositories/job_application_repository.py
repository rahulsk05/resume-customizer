from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.analysis.models.analysis_result_model import (
    AnalysisResult,
)
from app.modules.job_applications.models.job_application_model import (
    JobApplication,
    JobApplicationStatus,
)


class JobApplicationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        job_application: JobApplication,
    ) -> JobApplication:
        self.session.add(job_application)
        await self.session.flush()
        await self.session.refresh(job_application)

        return job_application

    async def get_by_id(
        self,
        created_by: int,
        job_application_id: int,
    ) -> JobApplication | None:
        result = await self.session.execute(
            select(JobApplication).where(
                JobApplication.id == job_application_id,
                JobApplication.created_by == created_by,
            )
        )

        return result.scalar_one_or_none()

    async def get_all_by_resume_profile_id(
        self,
        created_by: int,
        resume_profile_id: int,
        page: int,
        page_size: int,
    ) -> tuple[list[tuple[JobApplication, int | None]], int]:
        count_result = await self.session.execute(
            select(func.count(JobApplication.id)).where(
                JobApplication.created_by == created_by,
                JobApplication.resume_profile_id == resume_profile_id,
            )
        )

        total = count_result.scalar_one()

        offset = (page - 1) * page_size

        result = await self.session.execute(
            select(JobApplication, AnalysisResult.match_score)
            .outerjoin(
                AnalysisResult,
                AnalysisResult.job_application_id == JobApplication.id,
            )
            .where(
                JobApplication.created_by == created_by,
                JobApplication.resume_profile_id == resume_profile_id,
            )
            .order_by(JobApplication.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )

        return list(result.all()), total

    async def update_job_application_status(
        self,
        job_application: JobApplication,
    ) -> JobApplication:
        await self.session.flush()
        await self.session.refresh(job_application)

        return job_application


    async def get_status(
        self,
        created_by: int,
        job_application_id: int,
    ) -> tuple[int, JobApplicationStatus] | None:
        result = await self.session.execute(
            select(
                JobApplication.id,
                JobApplication.status,
            ).where(
                JobApplication.id == job_application_id,
                JobApplication.created_by == created_by,
            )
        )

        row = result.one_or_none()

        if row is None:
            return None

        return row.id, row.status

    async def delete(
        self,
        created_by: int,
        job_application_id: int,
    ) -> bool:
        result = await self.session.execute(
            delete(JobApplication).where(
                JobApplication.id == job_application_id,
                JobApplication.created_by == created_by,
            )
        )

        if result.rowcount == 0:
            return False

        await self.session.commit()
        return True