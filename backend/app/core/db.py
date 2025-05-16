from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.dependencies import get_settings # Import the cached settings getter

# Get application settings
settings = get_settings()

# Create the asynchronous database engine
engine = create_async_engine(
    settings.DATABASE_URL,
)

# Create a configured "SessionLocal" class factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# FastAPI dependency function to get an async database session
async def get_db() -> AsyncSession:
    """Provides an asynchronous database session."""
    async with AsyncSessionLocal() as session:
        yield session