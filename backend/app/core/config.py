from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import os
from pathlib import Path

# Get the base directory (project root)
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):

    # Database settings
    DB_HOST: str = Field(default="localhost", env="DB_HOST")
    DB_PORT: int = Field(default=6543, env="DB_PORT")
    DB_DATABASE: str = Field(default="postgres", env="DB_DATABASE")
    DB_USER: str = Field(default="postgres", env="DB_USER")
    DB_PASSWORD: str = Field(default="", env="DB_PASSWORD")
    DATABASE_URL: str = Field(default="", env="DATABASE_URL")

    # SQLAlchemy connection pool settings 
    POOL_SIZE: int = 10
    MAX_OVERFLOW: int = 20
    POOL_RECYCLE: int = 300
    POOL_TIMEOUT: int = 30

    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        case_sensitive=True,
        extra='ignore'
    )

