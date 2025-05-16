# DiaBeatThis Frontend

This is the frontend application for the **DiaBeatThis** diabetes management platform.

---

## 📌 Table of Contents

- [DiaBeatThis Frontend](#diabeathis-frontend)
  - [📌 Table of Contents](#-table-of-contents)
  - [🛠 Tech Stack](#-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup Instructions](#setup-instructions)
  - [💁 Project Structure](#-project-structure)
  - [📱 Key Features](#-key-features)
  - [🧩 Component Library](#-component-library)
  - [🔄 State Management](#-state-management)
  - [📡 API Integration](#-api-integration)
  - [🧪 Testing](#-testing)
  - [📦 Build and Deployment](#-build-and-deployment)

---

## 🛠 Tech Stack

![React](https://img.shields.io/badge/-React-555555?style=for-the-badge&logo=react)&nbsp;
![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-555555?style=for-the-badge&logo=TailwindCSS)&nbsp;
![ShadcnUI](https://img.shields.io/badge/-ShadcnUI-555555?style=for-the-badge&logo=shadcnUI)&nbsp;
![TypeScript](https://img.shields.io/badge/-TypeScript-555555?style=for-the-badge&logo=typescript)&nbsp;

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

### Setup Instructions

1. Create a new folder where you want to store the project files — referred to as the **Project Folder**.

2. Open your terminal or command prompt and navigate to the **Project Folder**:

   ```bash
   cd <PATH TO PROJECT FOLDER>
   ```

3. Clone the repository into the current directory (note the `.` at the end):

   ```bash
   git clone https://github.com/GenAIPHBuilders-org/team-Sparky-Trio-2025.git .
   ```

4. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

5. Install the project dependencies:

   ```bash
   npm install
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

---

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

---

## 💁 Project Structure

```
📦 frontend
├── 📂 node_modules             # Project dependencies
├── 📂 public                   # Static assets (favicon, index.html, main logo, etc.)
├── 📂 src                      # Source code
│   ├── 📂 assets               # Images, icons, and other static assets
│   ├── 📂 components           # Reusable UI components
│   │   ├── 📂 ui               # Generic UI components from shadcnUI or similar
│   │   ├── 📂 dashboard        # Dashboard-specific components
│   │   ├── 📂 auth             # Authentication-related components
│   │   ├── 📂 health           # Health tracking components
│   │   └── 📂 layout           # Layout components (header, footer, etc.)
│   ├── 📂 lib                  # Utility functions and libraries
│   ├── 📂 hooks                # Custom React hooks (e.g., for data fetching)
│   ├── 📂 pages                # Page components for each route
│   ├── 📂 services             # API service functions
│   ├── 📂 store                # State management
│   ├── 📂 types                # TypeScript type definitions
│   ├── App.tsx                 # Main application component
│   └── index.tsx               # React app entry point
├── 📂 tests                    # Test files
├── index.html                  # HTML entry point
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies and scripts
```

## 📱 Key Features

The frontend application provides the following key features:

- **User Authentication**: Secure login, registration, and profile management
- **Dashboard**: Overview of health metrics and recent activities
- **Glucose Tracking**: Log and visualize glucose readings
- **Medication Management**: Track medications and set reminders
- **Meal Planning**: Create and manage meal plans with nutritional information
- **Exercise Tracking**: Log workouts and physical activities
- **Reports**: Generate health reports and insights
- **Agent Chat Interface**: Interact with the Debie AI agent for personalized guidance

## 🧩 Component Library

We use ShadcnUI components as the foundation for our UI. These components are located in the `src/components/ui` directory. When creating new components:

1. Follow the established naming conventions
2. Ensure components are properly typed with TypeScript
3. Create reusable components that can be composed together
4. Document component props and usage

## 🔄 State Management

The application uses a combination of React Context and local component state for state management:

- **Authentication State**: Managed through AuthContext
- **User Preferences**: Stored in UserPreferencesContext
- **Health Data**: Managed through dedicated contexts or hooks
- **UI State**: Handled with local component state

## 📡 API Integration

API integration is handled through service functions in the `src/services` directory:

- **API Client**: Base configuration for API requests
- **Authentication Service**: Login, registration, and token management
- **Health Data Service**: CRUD operations for health metrics
- **Agent Service**: Communication with the Debie AI agent

## 🧪 Testing

Run tests with:

```bash
npm test
```

We use the following testing tools:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for end-to-end tests

## 📦 Build and Deployment

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```
