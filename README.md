# Budget Tracking App

A lightweight budgeting app with AI-driven saving tips, spending insights, and conversational responses for users.

## Documentation

- `docs/user-stories.md` — Personas and user stories.
- `docs/requirements.md` — Business, functional, and non-functional requirements.
- `docs/ai-agent.md` — AI agent capabilities, behavior, and sample responses.
- `docs/flowchart.md` — Initial app flow and interaction steps.
- `security_development_and_test.md` - Security Design

## Purpose

These documents are intended to support business analysis, product planning, and design discussions for the budgeting app.

## Developer Plan Summary

This document also captures the developer plan for building a cute, secure budget tracker app that matches the shared requirements.

## Project Overview

Build a full-stack budget tracking app with a friendly visual style and strong security. The app should support:

- Manual expense entry with amount, category, description, and date
- Income tracking and editing
- Budget category creation, editing, deletion, and duplicate prevention
- Savings goals with progress tracking and completion celebration
- Monthly reporting, analytics, and export options
- Responsive UI with a cute, approachable design
- Secure authentication, validation, and safe data handling

## Recommended Stack

- Frontend: React (or Vue)
- Backend: Node.js + Express
- Database: PostgreSQL for production, SQLite for quick prototype
- Auth: JWT authentication + bcrypt password hashing
- Styling: CSS modules, Tailwind, or styled components

## App Architecture

The app should use a standard full-stack structure with clear separation of concerns:

- `/frontend` for the UI, routing, animations, and client-side logic
- `/backend` for API routes, authentication, business logic, and database access
- `/backend/models` for data models and schema definitions
- `/backend/routes` for endpoint definitions
- `/backend/controllers` for request handling and service logic
- `/frontend/components` for reusable UI components
- `/frontend/pages` for page-level views
- `/frontend/services` for API clients and auth helpers
- `/shared` (optional) for shared types, constants, or utilities if needed
- Root files: `.gitignore`, `README.md`, `package.json`, `docker-compose.yml`, `LICENSE`

## Core Features

### Authentication

- Register, login, logout flows
- Protected API routes
- Password hashing and JWT session handling

### Transaction Management

- Add/edit/delete income entries
- Add/edit/delete expense entries
- Validate amounts, categories, dates, and required fields

### Savings Goals

- Create savings goals with target amount and deadline
- Track progress with percentage or progress bar
- Mark goals complete with friendly celebration messaging

### Reporting and Analytics

- Monthly report generation
- Expense breakdown charts by category
- Export reports as CSV/PDF

## UI / UX Goals

Create an interface that is:

- Cute and visually appealing
- Mobile-first and responsive
- Friendly with soft colors, rounded cards, icons, and animations
- Clear with inline validation and helpful messages

## Security Requirements

- Store secrets in `.env` and never commit them
- Use HTTPS in production
- Protect all sensitive API routes with auth
- Sanitize and validate all input
- Use secure headers via Helmet on the backend

## Development Plan

1. Set up repository structure and tooling
2. Build backend models and secure API routes
3. Build frontend screens and cute design system
4. Add validation, auth protection, and secure storage
5. Implement reporting, export, and analytics
6. Test flows using the existing test cases

## Verification Checklist

- Register/login works securely
- Categories and transactions can be added, edited, deleted
- Budget and goal progress update correctly
- UI is responsive and visually cute
- Invalid input is blocked gracefully
- Sensitive config is not stored in Git

## Additional Notes

- Use `budget_tracking_test_cases.md` as the acceptance criteria for functionality and validation.
- Keep the first version focused on the core budget tracking experience, then add polish features like charting and export.

---

This README is ready for review and can be pushed to `main` once the repo content is in place.
>>>>>>> 08510df (Add developer plan README)
