from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_cors_origins: str = "http://localhost:3000,http://localhost:3001"

    database_url: str = "sqlite:///./didcot.db"

    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 24

    seed_admin_username: str = "admin"
    seed_admin_password: str = "admin"

    booking_notify_webhook: str | None = None

    ga_api_secret: str | None = None
    ga_measurement_id: str | None = None
    meta_capi_token: str | None = None
    meta_pixel_id: str | None = None

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.api_cors_origins.split(",") if o.strip()]


settings = Settings()
