# DiaBeatThis API Application

This directory contains the core FastAPI application for the DiaBeatThis platform. It implements the REST API endpoints, database models, and business logic for the diabetes management platform.

## Directory Structure

```
app/
├── core/           # Core configurations and setup
│   ├── config.py   # Application configuration
│   ├── db.py       # Database connection and session management
│   └── dependencies.py # FastAPI dependency injection
├── models/         # SQLAlchemy ORM models
├── repositories/   # Data access layer
├── router/         # API route definitions
├── schemas/        # Pydantic models for request/response validation
├── services/       # Business logic implementation
├── utils/          # Utility functions and helpers
├── main.py         # Application entry point and setup
└── __init__.py     # Package initialization
```

## API Endpoints

The API is organized into the following modules:

- **Health Check**: Basic API status and database connection verification
- **Users**: User management and authentication
- **Health Data**: Glucose readings, A1C, and other health metrics
- **Medication**: Medication tracking and reminders
- **Nutrition**: Meal plans and food tracking
- **Exercise**: Workout plans and activity tracking

## Development Guidelines

### Adding New Endpoints

1. Create a new router file in the `router/` directory
2. Define your route operations using FastAPI decorators
3. Register your router in `main.py`

Example:

```python
# In router/your_feature.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.schemas.your_feature import YourFeatureSchema

router = APIRouter(prefix="/your-feature", tags=["Your Feature"])

@router.get("/")
async def get_your_features(db: AsyncSession = Depends(get_db)):
    # Implementation
    pass

# In main.py
from app.router import your_feature

app.include_router(your_feature.router)
```

### Database Models

When creating new database models:

1. Define your SQLAlchemy model in `models/`
2. Create corresponding Pydantic schemas in `schemas/`
3. Implement repository methods in `repositories/`

Example:

```python
# In models/your_model.py
from sqlalchemy import Column, Integer, String
from app.core.db import Base

class YourModel(Base):
    __tablename__ = "your_models"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
```

### Business Logic

Place business logic in the `services/` directory to maintain separation of concerns:

```python
# In services/your_service.py
from app.repositories.your_repository import YourRepository

class YourService:
    def __init__(self, repository: YourRepository):
        self.repository = repository
        
    async def process_something(self, data):
        # Business logic here
        return await self.repository.save(data)
```

## Integration with Debie Agent

The API application integrates with the Debie agent system to provide AI-powered diabetes management features. The integration points include:

- Agent initialization and configuration in `services/agent_service.py`
- API endpoints for agent interactions in `router/agent.py`
- Data exchange between the API and agent system

## Testing

Write tests for your API endpoints, services, and repositories:

```bash
# Run tests
pytest tests/

# Run tests with coverage
pytest --cov=app tests/
```
