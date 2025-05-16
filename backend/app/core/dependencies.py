from functools import lru_cache
from app.core import config

@lru_cache
def get_settings():
    return config.Settings()