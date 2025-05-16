# DiaBeatThis - Diabetes Management Platform

[![GDG On Campus PUP](https://img.shields.io/badge/GDG-On%20Campus%20PUP-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gdg.community.dev/gdg-on-campus-polytechnic-university-of-the-philippines-manila-philippines/)
[![APAC Solutions Challenge](https://img.shields.io/badge/APAC-Solutions%20Challenge-FBBC04?style=for-the-badge&logo=google&logoColor=white)](https://vision.hack2skill.com/event/apacsolutionchallenge/?utm_source=hack2skill&utm_medium=homepage)


## 🌟 The Problem

Diabetes affects over 537 million adults globally, with numbers projected to rise to 783 million by 2045. In the Philippines alone, approximately 4 million adults live with diabetes, and an estimated 1.8 million remain undiagnosed. Managing diabetes requires constant attention to multiple factors:

- Blood glucose monitoring
- Medication adherence
- Dietary management
- Physical activity tracking
- Healthcare appointments

The fragmented nature of diabetes care tools forces patients to juggle multiple apps and systems, leading to poor adherence, missed interventions, and deteriorating health outcomes.

### What if we could lessen the impact of diabetes in the Philippines by giving everyone personalized support **to manage it better**?

## 💡 Our Solution

DiaBeatThis is a comprehensive diabetes management platform powered by AI agents that provides personalized, integrated support for diabetes care. The platform consolidates all aspects of diabetes management into a single, intelligent system that adapts to each user's unique health profile and lifestyle.

> **⚠️ Development Status:** The frontend application and integration with the Debie Agent system are currently under active development. Some features may be incomplete or subject to change.

## Key Features

### Debie - AI Diabetes Assistant

At the core of DiaBeatThis is **Debie**, our intelligent multi-agent system built with Google's Agent Development Kit (ADK):

- **Personalized Health Insights**: Analyzes glucose trends, medication efficacy, and lifestyle impacts
- **Evidence-Based Guidance**: Provides medically sound recommendations tailored to individual needs
- **Contextual Understanding**: Maintains conversation history and user health context for relevant support

### Comprehensive Health Tracking

- **Glucose Monitoring**: Manual entry and smart device integration (Fitbit, glucose monitors)
- **Medication Management**: Scheduling, reminders, and adherence tracking
- **Nutrition Tracking**: Food logging with diabetes-specific nutritional insights
- **Exercise Planning**: Activity tracking with glucose impact analysis

### Smart Integrations

- **Google Calendar**: Seamlessly schedules medication reminders, doctor appointments, and exercise sessions
- **Fitbit & Health Devices**: Syncs with wearables for automated health data collection
- **Healthcare Provider Portal**: Enables secure data sharing with medical professionals

### Specialized Agent Modules

- **Fitness Coach**: Creates safe, personalized exercise plans considering glucose levels
- **Nutritionist**: Offers meal planning and dietary guidance optimized for glycemic control
- **Health Analyst**: Identifies patterns and provides actionable insights from health data
- **Medical Information**: Delivers evidence-based diabetes information and medication guidance

## Unique Value Proposition

DiaBeatThis stands apart from other diabetes management solutions through:

1. **Intelligent Integration**: A unified platform that connects all aspects of diabetes care
2. **Personalized Agency**: AI agents that adapt to individual health profiles and preferences
3. **Holistic Approach**: Addressing medical, nutritional, physical, and psychological aspects of diabetes management
4. **Accessibility Focus**: Designed to be usable by people of all ages and technical abilities
5. **Evidence-Based Foundation**: Built on established medical guidelines and best practices

## Our Team - Sparky Trio

| Name | Role |
|------|------|
| **John Paul M. Curada** | Team Lead & Developer |
| **Kyne Domerei N. Laggui** | Developer |
| **Caryl Joy A. Atienza** | Designer |

## Project Structure

```
diabeathis/
├── frontend/           # React + TypeScript frontend application
├── backend/            # FastAPI backend server
│   ├── app/            # Core API application
│   └── debie_agent/    # AI agent system for diabetes management
└── pitch-deck.pdf      # Project presentation
```

## Technologies

### Frontend
- React
- TypeScript
- Tailwind CSS
- ShadcnUI

### Backend
- FastAPI
- SQLAlchemy
- Google Agent Development Kit (ADK)
- Supabase

## Getting Started

### Prerequisites
- Node.js (LTS version)
- Python 3.12+
- Git
- Google ADK CLI (for testing the agent)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
# Create a virtual environment
python -m venv venv
# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
# Install dependencies
pip install -e .
# Run the server
uvicorn app.main:app --reload
```

### Try the Debie Agent
You can interact with the Debie agent directly using the ADK web interface:

```bash
cd backend/debie_agent
adk web
```

This will launch a local web interface where you can chat with the Debie agent and test its diabetes management capabilities.


## Contributing

Please read the README files in each directory for specific contribution guidelines:
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Backend API Documentation](./backend/app/README.md)
- [Debie Agent Documentation](./backend/debie_agent/README.md)

