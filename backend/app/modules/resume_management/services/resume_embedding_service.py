from dataclasses import dataclass

from app.ai.embeddings.client import EmbeddingClient
from app.ai.rag.entry_builder import build_resume_embedding_entries
from app.modules.resume_management.models.resume_embedding_model import (
    ResumeEmbedding,
)
from app.modules.resume_management.repositories.resume_embedding_repository import (
    ResumeEmbeddingRepository,
)
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


@dataclass(frozen=True)
class PreparedResumeEmbedding:
    section: str
    source: str
    content: str
    embedding: list[float]


class ResumeEmbeddingService:
    def __init__(
        self,
        resume_embedding_repository: ResumeEmbeddingRepository,
        embedding_client: EmbeddingClient,
    ) -> None:
        self.resume_embedding_repository = resume_embedding_repository
        self.embedding_client = embedding_client

    async def prepare_embeddings(
        self,
        resume: ResumeStructuredContent,
    ) -> list[PreparedResumeEmbedding]:
        entries = build_resume_embedding_entries(resume)

        prepared_embeddings: list[PreparedResumeEmbedding] = []

        for entry in entries:
            embedding = await self.embedding_client.generate_embedding(
                entry.content
            )

            prepared_embeddings.append(
                PreparedResumeEmbedding(
                    section=entry.section,
                    source=entry.source,
                    content=entry.content,
                    embedding=embedding,
                )
            )

        return prepared_embeddings

    async def create_embeddings(
        self,
        created_by: int,
        resume_profile_id: int,
        prepared_embeddings: list[PreparedResumeEmbedding],
    ) -> list[ResumeEmbedding]:
        embeddings: list[ResumeEmbedding] = []

        for prepared_embedding in prepared_embeddings:
            resume_embedding = ResumeEmbedding(
                created_by=created_by,
                resume_profile_id=resume_profile_id,
                section=prepared_embedding.section,
                source=prepared_embedding.source,
                content=prepared_embedding.content,
                embedding=prepared_embedding.embedding,
            )

            created_embedding = (
                await self.resume_embedding_repository.create(
                    resume_embedding
                )
            )

            embeddings.append(created_embedding)

        return embeddings

    async def get_relevant_embeddings(
        self,
        created_by: int,
        resume_profile_id: int,
        query_embedding: list[float],
        limit: int,
    ) -> list[ResumeEmbedding]:
        return await self.resume_embedding_repository.get_similar_embeddings(
            created_by=created_by,
            resume_profile_id=resume_profile_id,
            query_embedding=query_embedding,
            limit=limit,
        )