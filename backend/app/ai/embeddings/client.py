from google import genai

from app.common.exceptions.app_exceptions import BadGatewayException
from app.common.logging.logger import get_logger
from app.config.settings import get_settings


settings = get_settings()
logger = get_logger(__name__)


class EmbeddingClient:
    def __init__(self) -> None:
        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )

    async def generate_embedding(
        self,
        text: str,
    ) -> list[float]:
        try:
            response = await self.client.aio.models.embed_content(
                model=settings.gemini_embedding_model,
                contents=text,
                config={
                    "output_dimensionality": settings.gemini_embedding_dimension,
                },
            )

        except Exception as exc:
            logger.exception(
                "Gemini embedding request failed",
                extra={
                    "model": settings.gemini_embedding_model,
                },
            )

            raise BadGatewayException(
                message="Embedding service is currently unavailable.",
                error_code="EMBEDDING_SERVICE_UNAVAILABLE",
            ) from exc

        if not response.embeddings:
            logger.error(
                "Gemini embedding service returned an empty response",
                extra={
                    "model": settings.gemini_embedding_model,
                },
            )

            raise BadGatewayException(
                message="Embedding service returned an empty response.",
                error_code="EMPTY_EMBEDDING_RESPONSE",
            )

        embedding = response.embeddings[0].values

        if not embedding:
            logger.error(
                "Gemini embedding service returned empty vector values",
                extra={
                    "model": settings.gemini_embedding_model,
                },
            )

            raise BadGatewayException(
                message="Embedding service returned invalid data.",
                error_code="INVALID_EMBEDDING_RESPONSE",
            )

        return embedding