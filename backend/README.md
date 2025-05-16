# DiaBeatThis Backend

This directory contains the backend server for the DiaBeatThis platform, built with FastAPI and integrated with Google's Agent Development Kit (ADK).

## Directory Structure

```
backend/
├── app/                # Main FastAPI application
│   ├── core/           # Core configurations, database setup
│   ├── models/         # Database models
│   ├── repositories/   # Data access layer
│   ├── router/         # API endpoints
│   ├── schemas/        # Pydantic models for request/response
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── debie_agent/        # AI agent system for diabetes management
├── main.py             # Application entry point
├── pyproject.toml      # Project dependencies and metadata
└── uv.lock             # Dependency lock file
```

## Technologies

- **FastAPI**: Modern, high-performance web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Google ADK**: Agent Development Kit for building AI agents
- **Supabase**: Backend-as-a-Service for database management

## Setup Instructions

### Prerequisites

- Python 3.12 or higher
- Virtual environment tool (venv, conda, etc.)

### Installation

1. Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate
```

2. Install dependencies:

```bash
# Install project in development mode
pip install -e .
```

3. Run the application:

```bash
# Development server with auto-reload
uvicorn app.main:app --reload

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:

- Interactive API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

## Development Guidelines

1. **Code Structure**:
   - Keep business logic in service classes
   - Use repositories for database operations
   - Define data schemas with Pydantic

2. **Database Migrations**:
   - Use Alembic for database migrations
   - Run migrations before deploying changes

3. **Testing**:
   - Write unit tests for services and repositories
   - Use pytest for test execution

## Components

- **API Layer**: Defined in `app/router/`
- **Service Layer**: Business logic in `app/services/`
- **Data Access Layer**: Database operations in `app/repositories/`
- **AI Agent System**: Agent definitions in `debie_agent/`