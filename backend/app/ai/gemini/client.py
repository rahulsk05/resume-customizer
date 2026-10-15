from datetime import date
from typing import Any

from google import genai
from google.genai import types

from app.ai.gemini.prompts import (
    ANALYZE_JOB_APPLICATION_SYSTEM_INSTRUCTION,
    RESUME_STRUCTURING_SYSTEM_INSTRUCTION,
)
from app.ai.gemini.schema_utils import build_gemini_schema
from app.common.exceptions.app_exceptions import BadGatewayException
from app.common.logging.logger import get_logger
from app.config.settings import get_settings
from app.modules.analysis.schemas.analysis_schema import (
    AnalysisResult as AnalysisResultSchema,
)
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


settings = get_settings()
logger = get_logger(__name__)


def _build_analysis_prompt(
    job_description: str,
    resume: ResumeStructuredContent,
    retrieved_evidence: list[str],
) -> str:
    evidence = "\n\n".join(
        f"- {item}"
        for item in retrieved_evidence
    )

    return f"""
Analyze the following job description against the candidate's resume.

JOB DESCRIPTION:
{job_description}

CANONICAL RESUME:
{resume.model_dump_json(indent=2)}

RETRIEVED RESUME EVIDENCE:
{evidence}

Produce the required analysis result.

The match score must represent the alignment between the existing
resume and the job description on a scale from 0 to 100.

The tailored resume must remain faithful to the canonical resume.
"""


def _build_analysis_system_instruction() -> str:
    """
    Build the Gemini analysis system instruction with the current date.

    The current date is injected at runtime so Gemini does not rely on
    its knowledge cutoff when interpreting resume experience dates.
    """
    current_date = date.today().isoformat()

    return (
        f"{ANALYZE_JOB_APPLICATION_SYSTEM_INSTRUCTION}\n\n"
        f"CURRENT DATE: {current_date}"
    )


class GeminiClient:
    def __init__(self) -> None:
        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )

    async def structure_resume(
        self,
        raw_text: str,
    ) -> ResumeStructuredContent:
        """
        Structure raw resume text using Gemini and validate the
        generated response against ResumeStructuredContent.
        """

        try:
            response = await self.client.aio.models.generate_content(
                model=settings.gemini_model,
                contents=raw_text,
                config=types.GenerateContentConfig(
                    system_instruction=RESUME_STRUCTURING_SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_json_schema=build_gemini_schema(
                        ResumeStructuredContent,
                    ),
                    temperature=0,
                ),
            )

        except Exception as exc:
            logger.exception(
                "Gemini resume structuring request failed",
                extra={
                    "model": settings.gemini_model,
                },
            )

            raise BadGatewayException(
                message="Resume structuring service is currently unavailable.",
                error_code="RESUME_STRUCTURING_UNAVAILABLE",
            ) from exc

        if not response.text:
            logger.error(
                "Gemini resume structuring returned an empty response",
                extra={
                    "model": settings.gemini_model,
                },
            )

            raise BadGatewayException(
                message="Resume structuring service returned an empty response.",
                error_code="EMPTY_RESUME_STRUCTURING_RESPONSE",
            )

        try:
            return ResumeStructuredContent.model_validate_json(
                response.text,
            )

        except Exception as exc:
            logger.exception(
                "Gemini returned invalid resume structure",
                extra={
                    "model": settings.gemini_model,
                },
            )

            raise BadGatewayException(
                message="Resume structuring service returned invalid data.",
                error_code="INVALID_RESUME_STRUCTURING_RESPONSE",
            ) from exc

    async def analyze_job_application(
        self,
        job_description: str,
        resume: ResumeStructuredContent,
        retrieved_evidence: list[str],
    ) -> AnalysisResultSchema:
        """
        Analyze a job description against the canonical resume and
        retrieved resume evidence using Gemini.
        """

        prompt = _build_analysis_prompt(
            job_description=job_description,
            resume=resume,
            retrieved_evidence=retrieved_evidence,
        )

        try:
            response = await self.client.aio.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=_build_analysis_system_instruction(),
                    response_mime_type="application/json",
                    response_json_schema=build_gemini_schema(
                        AnalysisResultSchema,
                    ),
                    temperature=0,
                ),
            )

        except Exception as exc:
            logger.exception(
                "Gemini job application analysis request failed",
                extra={
                    "model": settings.gemini_model,
                },
            )

            raise BadGatewayException(
                message="Job application analysis service is currently unavailable.",
                error_code="JOB_ANALYSIS_UNAVAILABLE",
            ) from exc

        if not response.text:
            logger.error(
                "Gemini job application analysis returned an empty response",
                extra={
                    "model": settings.gemini_model,
                },
            )

            raise BadGatewayException(
                message="Job application analysis service returned an empty response.",
                error_code="EMPTY_JOB_ANALYSIS_RESPONSE",
            )

        try:
            return AnalysisResultSchema.model_validate_json(
                response.text,
            )

        except Exception as exc:
            logger.exception(
                "Gemini returned invalid job application analysis",
                extra={
                    "model": settings.gemini_model,
                },
            )

            raise BadGatewayException(
                message="Job application analysis service returned invalid data.",
                error_code="INVALID_JOB_ANALYSIS_RESPONSE",
            ) from exc