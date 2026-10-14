from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.resume_management.models.resume_content_model import ResumeContent


class ResumeContentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        resume_content: ResumeContent,
    ) -> ResumeContent:
        self.session.add(resume_content)
        await self.session.flush()

        return resume_content

    async def get_by_resume_profile_id(
        self,
        resume_profile_id: int,
    ) -> ResumeContent | None:
        result = await self.session.execute(
            select(ResumeContent).where(
                ResumeContent.resume_profile_id == resume_profile_id,
            )
        )

        return result.scalar_one_or_none()