from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.analysis.models.analysis_result_model import AnalysisResult


class AnalysisResultRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        analysis_result: AnalysisResult,
    ) -> AnalysisResult:
        self.session.add(analysis_result)
        await self.session.flush()
        await self.session.refresh(analysis_result)

        return analysis_result

    async def get_by_job_application_id(
        self,
        created_by: int,
        job_application_id: int,
    ) -> AnalysisResult | None:
        result = await self.session.execute(
            select(AnalysisResult).where(
                AnalysisResult.created_by == created_by,
                AnalysisResult.job_application_id == job_application_id,
            )
        )

        return result.scalar_one_or_none()