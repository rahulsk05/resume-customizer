from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.client import EmbeddingClient
from app.ai.gemini.client import GeminiClient
from app.database.session import get_db_session
from app.modules.resume_management.repositories.resume_content_repository import (
    ResumeContentRepository,
)
from app.modules.resume_management.repositories.resume_embedding_repository import (
    ResumeEmbeddingRepository,
)
from app.modules.resume_management.repositories.resume_profile_repository import (
    ResumeProfileRepository,
)
from app.modules.resume_management.services.resume_content_service import (
    ResumeContentService,
)
from app.modules.resume_management.services.resume_embedding_service import (
    ResumeEmbeddingService,
)
from app.modules.resume_management.services.resume_profile_service import (
    ResumeProfileService,
)


def get_resume_profile_repository(
    session: AsyncSession = Depends(get_db_session),
) -> ResumeProfileRepository:
    return ResumeProfileRepository(session)


def get_resume_content_repository(
    session: AsyncSession = Depends(get_db_session),
) -> ResumeContentRepository:
    return ResumeContentRepository(session)


def get_resume_embedding_repository(
    session: AsyncSession = Depends(get_db_session),
) -> ResumeEmbeddingRepository:
    return ResumeEmbeddingRepository(session)


def get_gemini_client() -> GeminiClient:
    return GeminiClient()


def get_embedding_client() -> EmbeddingClient:
    return EmbeddingClient()


def get_resume_content_service(
    resume_content_repository: ResumeContentRepository = Depends(
        get_resume_content_repository,
    ),
    gemini_client: GeminiClient = Depends(get_gemini_client),
) -> ResumeContentService:
    return ResumeContentService(
        resume_content_repository=resume_content_repository,
        gemini_client=gemini_client,
    )


def get_resume_embedding_service(
    resume_embedding_repository: ResumeEmbeddingRepository = Depends(
        get_resume_embedding_repository,
    ),
    embedding_client: EmbeddingClient = Depends(get_embedding_client),
) -> ResumeEmbeddingService:
    return ResumeEmbeddingService(
        resume_embedding_repository=resume_embedding_repository,
        embedding_client=embedding_client,
    )


def get_resume_profile_service(
    session: AsyncSession = Depends(get_db_session),
    resume_profile_repository: ResumeProfileRepository = Depends(
        get_resume_profile_repository,
    ),
    resume_content_service: ResumeContentService = Depends(
        get_resume_content_service,
    ),
    resume_embedding_service: ResumeEmbeddingService = Depends(
        get_resume_embedding_service,
    ),
) -> ResumeProfileService:
    return ResumeProfileService(
        session=session,
        resume_profile_repository=resume_profile_repository,
        resume_content_service=resume_content_service,
        resume_embedding_service=resume_embedding_service,
    )