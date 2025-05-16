# DiaBeatThis - Diabetes Management Platform

[![GDG On Campus PUP](https://img.shields.io/badge/GDG-On%20Campus%20PUP-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gdg.community.dev/gdg-on-campus-polytechnic-university-of-the-philippines-manila-philippines/)
[![APAC Solutions Challenge](https://img.shields.io/badge/APAC-Solutions%20Challenge-FBBC04?style=for-the-badge&logo=google&logoColor=white)](https://vision.hack2skill.com/event/apacsolutionchallenge/?utm_source=hack2skill&utm_medium=homepage)
[![GenAI Philippines](https://img.shields.io/badge/GenAI-Agentic%20AI%20Hackathon-34A853?style=for-the-badge&logo=openai&logoColor=white)](https://www.facebook.com/share/p/1ELw8kANGN/)

## Our Team - Sparky Trio

| Name | Role |
|------|------|
| **John Paul M. Curada** | Team Lead & Developer |
| **Kyne Domerei N. Laggui** | Developer |
| **Caryl Joy A. Atienza** | Designer |

## About DiaBeatThis

DiaBeatThis is a comprehensive diabetes management platform that leverages AI agents to provide personalized support for diabetes care. The platform helps users track glucose levels, manage medications, plan meals, schedule exercises, and receive evidence-based health insights.

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

## License

[License information coming soon]

---

## Contributing

Please read the README files in each directory for specific contribution guidelines:
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Backend API Documentation](./backend/app/README.md)
- [Debie Agent Documentation](./backend/debie_agent/README.md)

