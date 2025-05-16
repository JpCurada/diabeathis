# Debie - Diabetes Management Platform Agent

Debie is a comprehensive diabetes management platform that uses a multi-agent architecture to provide personalized support for diabetes care. This codebase implements the agent system that powers the platform.

## Project Structure

The project follows a clean multi-agent architecture:

```
debie_agent/
├── __init__.py              # Re-exports the root agent
├── agent.py                 # Main agent definition and manager logic
├── tools/                   # Shared tools used by multiple agents
│   ├── __init__.py          # Tool exports
│   ├── tools.py             # General utility tools
│   ├── calendar_integration.py   # Google Calendar integration tools
│   └── utils.py             # Utility functions
└── subagents/               # Specialized agent modules
    ├── __init__.py          # Subagent exports
    ├── fitness_coach/       # Exercise planning and scheduling
    │   ├── __init__.py
    │   ├── fitness_coach_agent.py
    │   ├── README.md
    │   └── examples.py
    ├── health_analyst/      # Health data analysis
    │   ├── __init__.py
    │   └── health_analyst_agent.py
    ├── medical_info/        # Medical information and medication management
    │   ├── __init__.py
    │   └── medical_info_agent.py
    └── nutritionist/        # Meal planning and nutrition guidance
        ├── __init__.py
        └── nutritionist_agent.py
```

## Agent System Overview

### Root Agent

The `DebiePlatformAgent` (exposed as `debie_agent`) serves as the main entry point and manager for the system. It:

1. Handles user context loading and enrichment
2. Routes queries to the appropriate specialized subagent
3. Manages the conversation flow and agent delegation

### Subagents

1. **Fitness Coach Agent**
   - Creates personalized exercise plans
   - Schedules workouts in Google Calendar
   - Provides exercise instructions and safety guidance
   - Analyzes exercise impact on glucose levels

2. **Health Analyst Agent**
   - Analyzes glucose trends and patterns
   - Provides insights based on health metrics
   - Generates health reports and statistics
   - Identifies potential health concerns

3. **Medical Information Agent**
   - Provides evidence-based diabetes information
   - Explains medications and potential side effects
   - Assesses symptom severity with diabetes considerations
   - Sets up medication reminders

4. **Nutritionist Agent**
   - Creates personalized meal plans
   - Provides nutrition guidance for diabetes management
   - Analyzes food impact on glucose levels
   - Offers diabetes-friendly recipes

### Shared Tools

All agents have access to common tools in the `tools` directory:

1. **User Data Tools**
   - User profile and context retrieval
   - Data enrichment and preprocessing

2. **Calendar Integration**
   - Google Calendar event creation
   - Reminder scheduling for medications, exercises, glucose checks
   - Follow-up logging reminder creation

3. **Analysis Tools**
   - Glucose trend analysis
   - A1C estimation
   - Health insight generation

## Development Guide

### Setting Up the Development Environment

1. Ensure you have Python 3.12+ installed
2. Install the Google ADK package:
   ```bash
   pip install google-adk
   ```
3. Install additional dependencies:
   ```bash
   pip install -e .
   ```

### Creating a New Subagent

To create a new specialized subagent:

1. Create a new directory under `subagents/`
2. Create the agent definition file (e.g., `your_agent.py`)
3. Define your agent class extending the base agent
4. Register your agent in `subagents/__init__.py`
5. Add routing logic in the root agent

Example:

```python
# In subagents/your_agent/your_agent.py
from google.adk import Agent

class YourAgent(Agent):
    def __init__(self):
        super().__init__()
        # Initialize your agent
    
    async def process_query(self, query, user_context):
        # Process the query
        return response

# In subagents/__init__.py
from .your_agent.your_agent import YourAgent

# In agent.py (root agent)
from .subagents import YourAgent

# Add to the agent routing logic
```

### Adding New Tools

To add new tools for agents:

1. Create a new file in the `tools/` directory
2. Define your tool functions
3. Export them in `tools/__init__.py`
4. Import and use in your agents

Example:

```python
# In tools/your_tool.py
async def your_tool_function(params):
    # Implement your tool
    return result

# In tools/__init__.py
from .your_tool import your_tool_function

# In your agent
from ..tools import your_tool_function
```

## Testing

We use pytest for testing the agent system:

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_agent.py

# Run with coverage
pytest --cov=debie_agent
```

## Integration with API

The Debie agent system integrates with the FastAPI backend through:

1. Agent initialization in the API startup
2. Webhook endpoints for agent interactions
3. Shared data models between the API and agent system

See the integration code in `backend/app/services/agent_service.py` for details.

## Usage

The Debie agent system is designed to be used within the Google Agent Development Kit (ADK) framework. The root agent can be imported and used as follows:

```python
from debie_agent import debie_agent

# Initialize the agent with ADK
# Follow ADK documentation for deployment
```