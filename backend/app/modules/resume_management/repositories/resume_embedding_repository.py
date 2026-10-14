from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.resume_management.models.resume_embedding_model import (
    ResumeEmbedding,
)


class ResumeEmbeddingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        resume_embedding: ResumeEmbedding,
    ) -> ResumeEmbedding:
        self.session.add(resume_embedding)

        await self.session.flush()
        await self.session.refresh(resume_embedding)

        return resume_embedding

    async def get_similar_embeddings(
        self,
        created_by: int,
        resume_profile_id: int,
        query_embedding: list[float],
        limit: int,
    ) -> list[ResumeEmbedding]:
        similarity = ResumeEmbedding.embedding.cosine_distance(
            query_embedding,
        )

        result = await self.session.execute(
            select(ResumeEmbedding)
            .where(
                ResumeEmbedding.created_by == created_by,
                ResumeEmbedding.resume_profile_id == resume_profile_id,
            )
            .order_by(similarity)
            .limit(limit)
        )

        return list(result.scalars().all())