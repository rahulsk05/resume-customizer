from dataclasses import dataclass

from app.ai.gemini.client import GeminiClient
from app.common.exceptions.app_exceptions import NotFoundException
from app.common.resume.parser import extract_resume_text
from app.modules.resume_management.models.resume_content_model import ResumeContent
from app.modules.resume_management.repositories.resume_content_repository import (
    ResumeContentRepository,
)
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


@dataclass(frozen=True)
class PreparedResumeContent:
    raw_text: str
    structured_content: ResumeStructuredContent


class ResumeContentService:
    def __init__(
        self,
        resume_content_repository: ResumeContentRepository,
        gemini_client: GeminiClient,
    ) -> None:
        self.resume_content_repository = resume_content_repository
        self.gemini_client = gemini_client

    async def prepare_content(
        self,
        file_name: str,
        file_content: bytes,
    ) -> PreparedResumeContent:
        raw_text = extract_resume_text(
            file_name=file_name,
            file_content=file_content,
        )

        structured_content = await self.gemini_client.structure_resume(
            raw_text=raw_text,
        )

        return PreparedResumeContent(
            raw_text=raw_text,
            structured_content=structured_content,
        )

    async def create_content(
        self,
        resume_profile_id: int,
        raw_text: str,
        structured_content: ResumeStructuredContent,
    ) -> ResumeContent:
        resume_content = ResumeContent(
            resume_profile_id=resume_profile_id,
            raw_text=raw_text,
            structured_content=structured_content.model_dump(),
        )

        return await self.resume_content_repository.create(
            resume_content
        )

    async def get_by_resume_profile_id(
        self,
        resume_profile_id: int,
    ) -> ResumeContent:
        resume_content = (
            await self.resume_content_repository.get_by_resume_profile_id(
                resume_profile_id=resume_profile_id,
            )
        )

        if resume_content is None:
            raise NotFoundException(
                message="Resume content not found.",
                error_code="RESUME_CONTENT_NOT_FOUND",
            )

        return resume_content