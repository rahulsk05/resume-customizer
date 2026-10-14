from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.resume_management.models.resume_profile_model import ResumeProfile


class ResumeProfileRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        resume_profile: ResumeProfile,
    ) -> ResumeProfile:
        self.session.add(resume_profile)
        await self.session.flush()

        return resume_profile

    async def get_by_id(
        self,
        resume_profile_id: int,
        user_id: int,
    ) -> ResumeProfile | None:
        result = await self.session.execute(
            select(ResumeProfile).where(
                ResumeProfile.id == resume_profile_id,
                ResumeProfile.user_id == user_id,
            )
        )

        return result.scalar_one_or_none()

    async def get_all_by_user_id(
        self,
        user_id: int,
    ) -> list[ResumeProfile]:
        result = await self.session.execute(
            select(ResumeProfile)
            .where(ResumeProfile.user_id == user_id)
            .order_by(ResumeProfile.created_at.desc())
        )

        return list(result.scalars().all())

    async def delete(
        self,
        user_id: int,
        resume_profile_id: int,
    ) -> bool:
        result = await self.session.execute(
            delete(ResumeProfile).where(
                ResumeProfile.id == resume_profile_id,
                ResumeProfile.user_id == user_id,
            )
        )

        if result.rowcount == 0:
            return False

        await self.session.commit()

        return True