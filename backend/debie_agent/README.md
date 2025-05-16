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

## Usage

The Debie agent system is designed to be used within the Google Agent Development Kit (ADK) framework. The root agent can be imported and used as follows:

```python
from debie_agent import debie_agent

# Initialize the agent with ADK
# Follow ADK documentation for deployment
``` 