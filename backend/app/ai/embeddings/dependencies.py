from app.ai.embeddings.client import EmbeddingClient


def get_embedding_client() -> EmbeddingClient:
    return EmbeddingClient()