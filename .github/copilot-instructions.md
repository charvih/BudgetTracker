# Copilot Instructions — Smart Budget Tracker

These instructions help GitHub Copilot understand how this repository works. Please follow
them when generating code, documentation, or suggestions. Use **Australian English** spelling
throughout (e.g. behaviour, categorise, organise, colour, summarise, optimise, prioritise).

## What this project is

A lightweight, AI-powered budget tracking web app. It helps budget-conscious users log
expenses, set a monthly budget, track saving goals, and receive personalised saving tips,
spending insights, and conversational answers grounded in their own data.

This repository currently holds the **planning and design documentation** for v1.0. The
application code (frontend, backend, database) is yet to be scaffolded, so most contributions
involve either authoring code against the agreed design or keeping the documentation
consistent.

## Repository layout

```
README.md                          High-level overview + developer plan summary
requirements.md                    Business, functional, and non-functional requirements
user-stories.md                    Personas (Emma, Maya, Daniel) and user stories
ai-agent.md                        AI agent capabilities, use cases, and sample responses
flowchart.md                       Main user journey and AI interaction flow
budget_tracking_test_cases.md      Acceptance test cases (TC-001 … TC-035)
security_development_and_test.md   Security controls and security test cases (STC-001 … STC-010)
docs/PRD.md                        Product Requirements Document (source of truth for scope)
docs/ADR.md                        Architecture Decision Records (the "why" behind the stack)
docs/IMPLEMENTATION.md             Tech stack, data models, API endpoints, phases, testing
```

When a request touches scope or features, defer to `docs/PRD.md`. When it touches technical
choices, defer to `docs/ADR.md` and `docs/IMPLEMENTATION.md`.

## Architecture (agreed design)

Client–server architecture with an AI service layer:

- **Frontend**: React + TypeScript, styled with Tailwind CSS. Mobile-first and responsive
  (375px baseline). Friendly, "cute" visual style with soft colours, rounded cards, and icons.
- **Backend**: Node.js + Express + TypeScript. REST API with clear separation of concerns
  (routes, controllers, models/services).
- **Database**: PostgreSQL via the **Prisma** ORM (schema-first, migrations via `prisma migrate`).
  SQLite may be used for quick local prototyping only.
- **Auth**: JWT issued on login, verified by middleware on all protected routes. Passwords
  hashed with bcrypt (cost factor ≥ 12). Store tokens in `httpOnly` cookies, never `localStorage`.
- **AI**: OpenAI API (GPT-4o). All AI calls happen **server-side** behind `/api/ai/*`.

Suggested folder structure: `/frontend` (components, pages, services) and `/backend`
(models, routes, controllers), with an optional `/shared` for shared types and constants.

## Data model (v1.0)

Core entities, all scoped per user: `User`, `Expense`, `Budget`, `Goal`.

- Expense categories (fixed enum): **Food, Transport, Bills, Entertainment, Health, Savings, Other**.
- Budget is a **single monthly total** in v1.0 (per-category budgets are a v1.1 backlog item —
  see ADR-008). Spend is still broken down per category against that total.
- Budget periods are monthly and reset on the 1st of the calendar month.
- v1.0 is single-currency.

## API surface (see docs/IMPLEMENTATION.md for full tables)

- `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout`
- `GET|POST /api/expenses` · `PUT|DELETE /api/expenses/:id`
- `GET /api/budget/:month` · `POST /api/budget`
- `GET|POST /api/goals` · `PUT|DELETE /api/goals/:id`
- `GET /api/ai/insights` · `POST /api/ai/chat`

## AI agent behaviour

When working on AI features, follow `ai-agent.md` and ADR-006/ADR-007:

- The backend builds a structured context object from the user's real data (budget, top
  categories, goals, recent expenses) and injects it into the prompt **server-side**. The
  client only ever sends the chat message — never the financial data, and never the API key.
- Treat user-supplied free text (expense notes, chat messages) as **data values**, never as
  instruction-level prompt text. Sanitise it to guard against prompt injection.
- Prefer structured JSON output (function calling / structured outputs) so the UI can render
  data-driven components.
- Tone: friendly, supportive, non-judgmental, plain language. Always include at least one
  actionable recommendation and cite concrete numbers from the user's data.
- Never give investment advice or imply financial guarantees. If data is insufficient, ask
  for more detail rather than guessing.

## Security expectations

This is a financial app, so security is a first-class concern (see
`security_development_and_test.md` and the OWASP Top 10):

- Every route except auth requires a valid JWT; tokens expire after 24 hours.
- Always scope data queries by the `userId` taken from the JWT — never from the request body.
- Validate and sanitise all input server-side before database writes or AI prompt injection.
  Reject negative amounts, invalid dates, and malformed input. Prevent duplicate categories.
- Keep secrets in `.env` and never commit them. Enforce HTTPS and restrict CORS to known
  origins. Use Helmet for secure headers.
- Never collect or store bank/card credentials.
- Honour consent-based debit protection and unauthorised-login detection where those flows apply.

## Testing

Map any functional change back to the acceptance criteria in `budget_tracking_test_cases.md`
and security cases in `security_development_and_test.md`. Planned tooling
(see docs/IMPLEMENTATION.md §8):

- Unit: Jest / Vitest · Integration (API): Supertest + Jest · Components: React Testing Library
- E2E: Playwright · AI output: assert against known data fixtures

## Conventions for contributions

- Use TypeScript across frontend and backend; share type definitions where practical.
- Keep changes scoped to what's requested; don't expand v1.0 scope (no bank integrations,
  investment advice, multi-currency, shared budgets, push notifications, or CSV/PDF export —
  these are explicitly out of scope or deferred).
- Match existing documentation tone and structure; use Australian English.
- Do not introduce a tech choice that conflicts with an accepted ADR without raising a new ADR.
