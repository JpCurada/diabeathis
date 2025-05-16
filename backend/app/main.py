from fastapi import Depends, FastAPI, HTTPException, status
from typing_extensions import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.dependencies import get_settings
from app.core.config import Settings
from app.core.db import get_db


app = FastAPI(
    title="DiaBeatThis API"
)

@app.get("/status", tags=["Health Check"])
async def get_api_status(
    settings: Annotated[Settings, Depends(get_settings)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Checks the API status, overall health, and database connection.
    """
    try:
        # Attempt a simple database query to confirm the connection is active
        await db.execute(text("SELECT 1"))

        # If the query succeeds, the database connection is working
        return {
            "status": "ok",
            "api_health": "healthy",
            "database_connection": "successful",
        }
    except Exception as e:
        # If any exception occurred, the database connection failed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {e} ({settings.DATABASE_URL})",
        )