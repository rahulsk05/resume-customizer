from sqlalchemy.ext.asyncio import AsyncSession

from app.common.exceptions.app_exceptions import NotFoundException
from app.modules.resume_management.models.resume_profile_model import ResumeProfile
from app.modules.resume_management.repositories.resume_profile_repository import (
    ResumeProfileRepository,
)
from app.modules.resume_management.services.resume_content_service import (
    ResumeContentService,
)
from app.modules.resume_management.services.resume_embedding_service import (
    ResumeEmbeddingService,
)


class ResumeProfileService:
    def __init__(
        self,
        session: AsyncSession,
        resume_profile_repository: ResumeProfileRepository,
        resume_content_service: ResumeContentService,
        resume_embedding_service: ResumeEmbeddingService,
    ) -> None:
        self.session = session
        self.resume_profile_repository = resume_profile_repository
        self.resume_content_service = resume_content_service
        self.resume_embedding_service = resume_embedding_service

    async def create_resume_profile(
        self,
        user_id: int,
        profile_name: str,
        file_name: str,
        file_content: bytes,
    ) -> ResumeProfile:
        content = await self.resume_content_service.prepare_content(
            file_name=file_name,
            file_content=file_content,
        )

        prepared_embeddings = (
            await self.resume_embedding_service.prepare_embeddings(
                resume=content.structured_content,
            )
        )

        resume_profile = ResumeProfile(
            user_id=user_id,
            name=profile_name,
            original_file_name=file_name,
            file_size=len(file_content),
            file_type=_get_file_type(file_name),
        )

        await self.resume_profile_repository.create(resume_profile)

        await self.resume_content_service.create_content(
            resume_profile_id=resume_profile.id,
            raw_text=content.raw_text,
            structured_content=content.structured_content,
        )

        await self.resume_embedding_service.create_embeddings(
            created_by=user_id,
            resume_profile_id=resume_profile.id,
            prepared_embeddings=prepared_embeddings,
        )

        await self.session.commit()

        return resume_profile

    async def get_resume_profiles(
        self,
        user_id: int,
    ) -> list[ResumeProfile]:
        return await self.resume_profile_repository.get_all_by_user_id(
            user_id=user_id,
        )

    async def get_by_id(
        self,
        user_id: int,
        resume_profile_id: int,
    ) -> ResumeProfile:
        resume_profile = await self.resume_profile_repository.get_by_id(
            user_id=user_id,
            resume_profile_id=resume_profile_id,
        )

        if resume_profile is None:
            raise NotFoundException(
                message="Resume profile not found.",
                error_code="RESUME_PROFILE_NOT_FOUND",
            )

        return resume_profile

    async def delete_resume_profile(
        self,
        user_id: int,
        resume_profile_id: int,
    ) -> None:
        deleted = await self.resume_profile_repository.delete(
            user_id=user_id,
            resume_profile_id=resume_profile_id,
        )

        if not deleted:
            raise NotFoundException(
                message="Resume profile not found.",
                error_code="RESUME_PROFILE_NOT_FOUND",
            )


def _get_file_type(file_name: str) -> str:
    return file_name.rsplit(".", 1)[-1].lower()