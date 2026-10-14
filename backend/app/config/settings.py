from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Resume Customizer API"
    app_env: str = "development"

    database_url: str

    jwt_secret: str = Field(min_length=32)
    jwt_expires_in_minutes: int = Field(default=60, gt=0)

    jwt_cookie_name: str = "access_token"
    jwt_cookie_secure: bool = False
    jwt_cookie_http_only: bool = True
    jwt_cookie_same_site: Literal["lax", "strict", "none"] = "lax"
    jwt_algorithm: str = "HS256"

    gemini_api_key: str = Field(min_length=1)
    gemini_model: str = Field(min_length=1)
    gemini_embedding_model: str = Field(min_length=1)
    gemini_embedding_dimension: int = Field(gt=0)

    frontend_url: str = Field(min_length=1)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()