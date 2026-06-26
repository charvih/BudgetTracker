# Implementation Plan

## Smart Budget Tracker

**Version:** 1.0  
**Date:** 2026-06-26  
**Status:** Draft

---

## 1. Architecture Overview

The app follows a **client-server architecture** with a lightweight backend API, a relational database for user and expense data, and an AI service layer for generating insights and conversational responses.

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Web App)                     │
│  Dashboard │ Expense Form │ Report View │ Chat Interface │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼──────────────────────────────────┐
│                    Backend API Server                    │
│  Auth │ Expense API │ Budget API │ Goal API │ AI API     │
└──────────────┬───────────────────────┬───────────────────┘
               │                       │
┌──────────────▼──────────┐  ┌────────▼────────────────────┐
│   Relational Database   │  │   AI / LLM Service Layer    │
│  Users, Expenses,       │  │  Prompt builder, context    │
│  Budgets, Goals         │  │  injection, response parser │
└─────────────────────────┘  └─────────────────────────────┘
```

---

## 2. Proposed Tech Stack

| Layer    | Technology                                          | Rationale                                                           |
| -------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| Frontend | React (with TypeScript)                             | Component-based UI, strong ecosystem, mobile-responsive via CSS     |
| Styling  | Tailwind CSS                                        | Utility-first, rapid responsive layout without custom CSS overhead  |
| Backend  | Node.js + Express (TypeScript)                      | Lightweight, fast to iterate, same language as frontend             |
| Database | PostgreSQL                                          | Relational structure fits expense/budget/goal data model well       |
| ORM      | Prisma                                              | Type-safe schema-first ORM, strong migration tooling                |
| Auth     | JWT + bcrypt (session-based)                        | Simple, stateless, no third-party dependency for v1.0               |
| AI Layer | OpenAI API (GPT-4o)                                 | Conversational capability, function calling for structured insights |
| Hosting  | To be decided (Vercel / Railway / Fly.io suggested) | Low-ops, suitable for early-stage product                           |

> All tech stack decisions are recorded and justified in [ADR.md](./ADR.md).

---

## 3. Data Models

### 3.1 User

```
User {
  id          UUID (PK)
  email       String (unique)
  passwordHash String
  currency    String (default: "USD")
  createdAt   DateTime
}
```

### 3.2 Expense

```
Expense {
  id          UUID (PK)
  userId      UUID (FK → User)
  amount      Decimal
  category    Enum (Food | Transport | Bills | Entertainment | Health | Savings | Other)
  date        Date
  note        String (optional)
  createdAt   DateTime
  updatedAt   DateTime
}
```

### 3.3 Budget

```
Budget {
  id          UUID (PK)
  userId      UUID (FK → User)
  month       Date (first day of month, e.g., 2026-06-01)
  totalAmount Decimal
  createdAt   DateTime
}
```

### 3.4 Goal

```
Goal {
  id           UUID (PK)
  userId       UUID (FK → User)
  name         String
  targetAmount Decimal
  currentAmount Decimal (derived or stored)
  deadline     Date
  createdAt    DateTime
  updatedAt    DateTime
}
```

---

## 4. API Endpoints

### Auth

| Method | Path                 | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Create new user account     |
| POST   | `/api/auth/login`    | Authenticate and return JWT |
| POST   | `/api/auth/logout`   | Invalidate session          |

### Expenses

| Method | Path                | Description                                   |
| ------ | ------------------- | --------------------------------------------- |
| GET    | `/api/expenses`     | List expenses (filterable by month, category) |
| POST   | `/api/expenses`     | Create a new expense                          |
| PUT    | `/api/expenses/:id` | Update an existing expense                    |
| DELETE | `/api/expenses/:id` | Delete an expense                             |

### Budget

| Method | Path                 | Description                  |
| ------ | -------------------- | ---------------------------- |
| GET    | `/api/budget/:month` | Get budget for a given month |
| POST   | `/api/budget`        | Set or update monthly budget |

### Goals

| Method | Path             | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/goals`     | List all user goals |
| POST   | `/api/goals`     | Create a new goal   |
| PUT    | `/api/goals/:id` | Update goal details |
| DELETE | `/api/goals/:id` | Delete a goal       |

### AI

| Method | Path               | Description                                       |
| ------ | ------------------ | ------------------------------------------------- |
| GET    | `/api/ai/insights` | Get current AI insight + saving tip for dashboard |
| POST   | `/api/ai/chat`     | Send a chat message, receive AI response          |

---

## 5. AI Layer Design

### 5.1 Context Injection

Before calling the LLM, the backend builds a structured context object from the user's data:

```
{
  currentMonth: "June 2026",
  budget: { total: 2000, spent: 1340, remaining: 660 },
  topCategories: [
    { name: "Food", spent: 520, budget: 400 },
    { name: "Transport", spent: 310, budget: 250 }
  ],
  goals: [
    { name: "Emergency Fund", target: 5000, current: 2100, deadline: "2026-12-01" }
  ],
  recentExpenses: [ /* last 10-20 expenses */ ]
}
```

### 5.2 Prompt Templates

Three prompt templates are maintained:

1. **Insight prompt** — Produces one saving tip + one spending insight. Used for dashboard load.
2. **Report prompt** — Produces a full spending breakdown narrative. Used in the report view.
3. **Chat prompt** — Conversational. Includes context + conversation history. Used in the chat interface.

### 5.3 Response Parsing

AI responses are returned as structured JSON where possible (using OpenAI function calling / structured outputs) to allow the frontend to render data-driven components rather than raw text blocks.

---

## 6. Frontend Component Map

```
App
├── AuthPages
│   ├── LoginPage
│   └── RegisterPage
├── MainLayout
│   ├── Navbar
│   └── BottomNav (mobile)
├── DashboardPage
│   ├── BudgetStatusCard
│   ├── GoalProgressCard
│   ├── AIInsightCard
│   └── QuickActionBar
├── ExpensesPage
│   ├── ExpenseList
│   ├── ExpenseListItem
│   └── ExpenseForm (modal/sheet)
├── ReportPage
│   ├── CategoryBreakdownChart
│   ├── SpendingTrendChart
│   └── AIReportSummary
├── GoalsPage
│   ├── GoalList
│   ├── GoalCard
│   └── GoalForm (modal/sheet)
└── ChatPage
    ├── MessageList
    ├── MessageBubble
    └── ChatInput
```

---

## 7. Development Phases

### Phase 1 — Foundation (Weeks 1–2)

- [ ] Project setup: monorepo structure, TypeScript config, linting, Prettier
- [ ] Database schema definition with Prisma and initial migrations
- [ ] Auth endpoints (register, login, JWT middleware)
- [ ] Basic expense CRUD endpoints
- [ ] Frontend scaffolding: routing, layout, auth pages

### Phase 2 — Core Features (Weeks 3–4)

- [ ] Budget endpoints and frontend budget setting UI
- [ ] Goal endpoints and frontend goal creation/progress UI
- [ ] Expense list and form UI with category selection
- [ ] Home dashboard with live data (budget status, goal summary)
- [ ] Report view with category breakdown

### Phase 3 — AI Integration (Weeks 5–6)

- [ ] AI context builder (aggregates user data for prompt injection)
- [ ] Insight endpoint and dashboard AI card
- [ ] Chat endpoint with conversation history
- [ ] Chat UI (message list, input, AI response rendering)
- [ ] Prompt tuning and response validation against sample data

### Phase 4 — Polish and QA (Weeks 7–8)

- [ ] Mobile responsiveness audit (375px baseline)
- [ ] Accessibility review (WCAG 2.1 AA)
- [ ] Error states and empty states for all screens
- [ ] End-to-end test coverage for critical paths
- [ ] Security review (input validation, auth edge cases, data isolation)
- [ ] Performance check: AI response latency under load

---

## 8. Testing Strategy

| Type              | Scope                                                      | Tooling                  |
| ----------------- | ---------------------------------------------------------- | ------------------------ |
| Unit tests        | Utility functions, data transformations, prompt builders   | Jest / Vitest            |
| Integration tests | API endpoints with test database                           | Supertest + Jest         |
| Component tests   | React components in isolation                              | React Testing Library    |
| E2E tests         | Critical user journeys (add expense, view dashboard, chat) | Playwright               |
| AI output tests   | Validate AI responses against known data fixtures          | Custom assertion helpers |

---

## 9. Security Considerations

- All API routes (except auth) require a valid JWT; tokens expire after 24 hours
- Passwords hashed with bcrypt (cost factor ≥ 12)
- User data queries are always scoped by `userId` extracted from the JWT — never from request body
- All user inputs validated and sanitized server-side before database writes or AI prompt injection
- AI prompt templates reviewed to prevent prompt injection from user-supplied content
- HTTPS enforced in all environments; CORS restricted to known frontend origins
- No financial account credentials are ever collected or stored

---

## 10. Open Questions

1. **Hosting platform** — Vercel (frontend) + Railway (backend + DB) is the leading candidate; confirm before Phase 1.
2. **AI model** — GPT-4o vs. a smaller/cheaper model for insight generation; benchmark cost per active user.
3. **Category budget split** — v1.0 spec uses a single monthly total; should per-category budgets be a v1.0 or v1.1 feature?
4. **Goal contribution tracking** — Should "Savings" category expenses automatically contribute to a goal, or is goal progress manually updated?
