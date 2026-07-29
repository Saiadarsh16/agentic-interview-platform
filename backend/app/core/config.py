from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_name: str = "Agentic Interview Platform API"
    app_env: Literal["development", "test", "staging", "production"] = "development"
    app_debug: bool = False
    api_v1_prefix: str = "/api/v1"
    backend_cors_origins: list[AnyHttpUrl] = [AnyHttpUrl("http://localhost:5173")]
    database_url: str = (
        "postgresql+asyncpg://interview:interview@localhost:5432/interview_platform"
    )
    redis_url: str = "redis://localhost:6379/0"
    document_max_bytes: int = 5 * 1024 * 1024
    document_chunk_size: int = 2000
    document_chunk_overlap: int = 200

    openai_api_key: SecretStr | None = None
    openai_embedding_model: str = "text-embedding-3-small"
    embedding_dimension: int = 1536
    embedding_batch_size: int = 100
    pinecone_api_key: SecretStr | None = None
    pinecone_index_name: str = "agentic-interview-platform"
    pinecone_namespace: str = "interview-documents"
    pinecone_cloud: str = "aws"
    pinecone_region: str = "us-east-1"
    pinecone_upsert_batch_size: int = 100

    @property
    def docs_enabled(self) -> bool:
        return self.app_env != "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
