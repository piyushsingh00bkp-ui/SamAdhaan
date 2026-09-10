import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = "SamAdhaan AI Engine"
    APP_VERSION: str = "1.0.0"

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    GEMINI_MODEL: str = os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash"
    )

    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:5173"
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()