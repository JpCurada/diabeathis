# Website Frontend Documentation

This is the **Dia Beat This Hackaton** website repository project for the tech community.

---

## 📌 Table of Contents

- [Website Frontend Documentation](#website-frontend-documentation)
  - [📌 Table of Contents](#-table-of-contents)
  - [🛠 Tech Stack](#-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
  - [💁 Project Structure](#-project-structure)
  <!-- - [Issue & Project Workflow](#issue--project-workflow)
    - [1. Find an Issue](#1-find-an-issue)
    - [2. Create a Branch](#2-create-a-branch)
    - [3. Submit a Pull Request (PR)](#3-submit-a-pull-request-pr)
    - [4. Code Review & Merge](#4-code-review--merge)
  - [Branching & Git Workflow](#branching--git-workflow)
    - [Branch Naming Convention](#branch-naming-convention)
      - [1. Switch to develop branch](#1-switch-to-develop-branch)
      - [2. Create a feature branch linked to an issue](#2-create-a-feature-branch-linked-to-an-issue)
      - [3. Make your changes in the code](#3-make-your-changes-in-the-code)
      - [4. Once you're done with your changes, commit](#4-once-youre-done-with-your-changes-commit)
      - [5. Push to remote branch](#5-push-to-remote-branch)
      - [6. Create a pull request (PR)](#6-create-a-pull-request-pr)
  - [Commit Message Guidelines](#commit-message-guidelines)
    - [Commit Message Format](#commit-message-format)
    - [Allowed Commit Types](#allowed-commit-types)
      - [Examples](#examples)
  - [📋 Pull Request Guidelines](#-pull-request-guidelines)
    - [PR Title Format:](#pr-title-format)
    - [PR Description Template](#pr-description-template) -->

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
📦 TEAM-SPARKY-TRIO-2025
├── 📂 backend                      # Backend server code (e.g., API routes, database config)
│
├── 📂 frontend                     # Frontend application built with React + TypeScript
│   ├── 📂 node\_modules             # Project dependencies
│   ├── 📂 public                   # Static assets (favicon, index.html, main logo, etc.)
│   ├── 📂 src                      # Source code
│   │   ├── 📂 assets               # Images, icons, and other static assets
│   │   ├── 📂 components           # Reusable UI components
│   │   │   ├── 📂 ui               # Generic UI components from shadcnUI or similar
│   │   ├── 📂 lib                  # Utility functions and libraries
│   │   ├── 📂 hooks                # Custom React hooks (e.g., for data fetching)
│   │   ├── App.tsx                # Main application component
│   │   └── index.tsx              # React app entry point
│   ├── index.css                  # Global CSS file for consistent styling
│   ├── package.json               # Frontend dependencies and scripts
│   ├── tsconfig.json              # TypeScript configuration
│   └── .gitignore                 # Files and folders to be ignored by Git
│
└── README.md                      # Project documentation and setup instructions
```

---

<!-- ## Issue & Project Workflow

We use **GitHub Projects** to manage tasks and issues. Follow these steps when working on issues:

#### 1. Find an Issue

- Go to the [GitHub Issues](https://github.com/GenAIPHBuilders-org/team-Sparky-Trio-2025/issues) page.
- Assign the issue to yourself.
- Move the issue to "In Progress" in the project board.

#### 2. Create a Branch

- Use the [branching convention](#branching--git-workflow).
- Start coding!

#### 3. Submit a Pull Request (PR)

- Reference the issue in the PR description (e.g., `Closes #123`).
- Move the issue to "Review" in the project board.

#### 4. Code Review & Merge

- Once approved, the PR gets merged into `develop`.
- The issue is moved to "Done."

---

## Branching & Git Workflow

### Branch Naming Convention

| Branch Type | Naming Convention               | Example                 |
| ----------- | ------------------------------- | ----------------------- |
| **Main**    | `main`                          | `main`                  |
| **Dev**     | `dev`                           | `dev`                   |
| **Feature** | `feature/ISSUE-ID-feature-name` | `feature/123-add-auth`  |
| **Bugfix**  | `bugfix/ISSUE-ID-issue-name`    | `bugfix/234-fix-footer` |

---

## 📋 Pull Request Guidelines

### PR Title Format:

```
<type>(<scope>): <short description>
```

Example:

```
feat(auth): add user login functionality
fix(navbar): resolve mobile responsiveness issue
```

### PR Description Template

```
✨ What’s New?
- [x] Briefly explain what was added

📷 Screenshots of website (IMPORTANT)
_Add relevant screenshots/gifs_

🔗 Related Issues
Closes #ISSUE_NUMBER

✅ Checklist (from issue)
- [ ] Code follows project conventions
- [ ] Linted & formatted
- [ ] Tested locally
``` -->
