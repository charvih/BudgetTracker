# Architecture Decision Records (ADR)

## Smart Budget Tracker

**Date:** 2026-06-26  
**Status:** Draft

---

## Index

| ID      | Title                                        | Status   |
| ------- | -------------------------------------------- | -------- |
| ADR-001 | Use React with TypeScript for the frontend   | Accepted |
| ADR-002 | Use Node.js + Express for the backend API    | Accepted |
| ADR-003 | Use PostgreSQL as the primary database       | Accepted |
| ADR-004 | Use Prisma as the ORM                        | Accepted |
| ADR-005 | Use JWT for authentication                   | Accepted |
| ADR-006 | Use OpenAI API for AI capabilities           | Accepted |
| ADR-007 | Inject user data into AI prompts server-side | Accepted |
| ADR-008 | Single monthly budget total in v1.0          | Accepted |

---

## ADR-001: Use React with TypeScript for the Frontend

**Date:** 2026-06-26  
**Status:** Accepted

### Context

The app requires a responsive, component-based UI with multiple interactive views (dashboard, expense form, chat, goals). We need a frontend framework that supports rapid iteration, has a mature ecosystem, and allows mobile-first layout.

### Decision

Use **React** with **TypeScript** as the frontend framework, styled with **Tailwind CSS**.

### Alternatives Considered

| Alternative          | Reason Not Chosen                                                             |
| -------------------- | ----------------------------------------------------------------------------- |
| Vue 3                | Smaller ecosystem; fewer developers familiar with it in most teams            |
| Svelte / SvelteKit   | Less mature tooling for complex state management at scale                     |
| Plain HTML/CSS/JS    | Insufficient for the component complexity of dashboard + chat UI              |
| Next.js (full-stack) | Adds complexity for v1.0; a separate API gives clearer separation of concerns |

### Consequences

- **Positive:** Large component ecosystem, strong TypeScript support, excellent testing tooling (React Testing Library, Playwright)
- **Positive:** Tailwind enables rapid responsive design without a custom design system
- **Negative:** More boilerplate than lighter frameworks; requires explicit state management decisions as complexity grows
- **Risk:** If the app becomes heavily server-rendered (SEO, performance), migrating to Next.js later is straightforward

---

## ADR-002: Use Node.js + Express for the Backend API

**Date:** 2026-06-26  
**Status:** Accepted

### Context

We need a backend API to handle auth, CRUD operations, and AI orchestration. The team shares TypeScript expertise across frontend and backend, favoring a shared language.

### Decision

Use **Node.js** with **Express** and **TypeScript** for the REST API server.

### Alternatives Considered

| Alternative                 | Reason Not Chosen                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| Python + FastAPI            | Strong AI tooling, but splits language between frontend and backend                           |
| Fastify (Node.js)           | Better performance than Express, but adds learning curve; Express is sufficient for v1.0 load |
| Hono (Node.js)              | Promising but less mature ecosystem; Express is safer for maintainability                     |
| BFF with Next.js API routes | Considered, but a standalone API is more flexible for future mobile clients                   |

### Consequences

- **Positive:** Shared TypeScript codebase reduces context switching; shared type definitions can be reused
- **Positive:** Express is well-understood, widely documented, with a vast middleware ecosystem
- **Negative:** Express requires explicit structure; discipline needed to keep routes organized as the API grows
- **Risk:** At very high scale, Node.js single-thread I/O may require horizontal scaling; acceptable for v1.0

---

## ADR-003: Use PostgreSQL as the Primary Database

**Date:** 2026-06-26  
**Status:** Accepted

### Context

Expense, budget, and goal data is inherently relational (users → expenses → categories; users → goals). We need ACID compliance, strong query capabilities, and a database with a mature hosted offering.

### Decision

Use **PostgreSQL** as the primary relational database.

### Alternatives Considered

| Alternative          | Reason Not Chosen                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| MySQL                | PostgreSQL has better JSON support and more expressive query features                                    |
| SQLite               | Suitable for local dev only; not appropriate for a multi-user hosted app                                 |
| MongoDB              | Document model is a poor fit for relational expense/budget data; adds complexity for aggregation queries |
| Firebase / Firestore | Vendor lock-in; limited query expressiveness for financial aggregations                                  |

### Consequences

- **Positive:** Relational model maps naturally to entities (User, Expense, Budget, Goal)
- **Positive:** Aggregation queries (sum by category, monthly totals) are native SQL
- **Positive:** Widely supported by hosting platforms (Railway, Supabase, Neon, AWS RDS)
- **Negative:** Requires schema migrations when the data model evolves; Prisma mitigates this risk

---

## ADR-004: Use Prisma as the ORM

**Date:** 2026-06-26  
**Status:** Accepted

### Context

We need a database access layer that is type-safe, works well with TypeScript, and supports schema migrations.

### Decision

Use **Prisma** as the ORM for all database access.

### Alternatives Considered

| Alternative         | Reason Not Chosen                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------- |
| TypeORM             | Decorator-based; more verbose; less ergonomic TypeScript types                               |
| Drizzle ORM         | Emerging, lightweight, good type safety; valid alternative but smaller community than Prisma |
| Raw SQL (pg driver) | Maximum control, but requires writing boilerplate queries and managing types manually        |
| Sequelize           | Older API; TypeScript support is less first-class than Prisma                                |

### Consequences

- **Positive:** Schema-first approach enforces a single source of truth for data models
- **Positive:** Auto-generated TypeScript types eliminate a class of runtime type errors
- **Positive:** `prisma migrate` provides repeatable, version-controlled migrations
- **Negative:** Prisma generates a client at build time; adds a step to the CI/CD pipeline
- **Negative:** Complex queries (e.g., custom aggregations) may require raw SQL escape hatches via `prisma.$queryRaw`

---

## ADR-005: Use JWT for Authentication

**Date:** 2026-06-26  
**Status:** Accepted

### Context

The app requires user accounts to keep expense and budget data private. We need an auth mechanism that is stateless, simple to implement, and does not require a third-party service for v1.0.

### Decision

Use **JWT (JSON Web Tokens)** issued on login, verified by middleware on all protected routes. Passwords hashed with **bcrypt** (cost factor ≥ 12).

### Alternatives Considered

| Alternative                               | Reason Not Chosen                                                                                  |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Session-based auth (server-side sessions) | Requires session store (Redis); adds infrastructure complexity for v1.0                            |
| Auth0 / Clerk / Supabase Auth             | Reduces implementation time but adds a third-party dependency and cost; deferred to v1.1 if needed |
| Passkeys / WebAuthn                       | More secure and modern, but increases implementation complexity for v1.0                           |
| OAuth only (Google/Apple)                 | Removes password auth but adds OAuth flow complexity; may exclude users without social accounts    |

### Consequences

- **Positive:** Stateless; scales horizontally without a session store
- **Positive:** No external service dependency for v1.0
- **Negative:** Token revocation requires a blocklist (if needed) — for v1.0, short expiry (24h) is the mitigation
- **Security note:** Tokens stored in `httpOnly` cookies (not `localStorage`) to prevent XSS access
- **Risk:** If advanced auth needs arise (MFA, social login), integrating an auth provider in v1.1 is straightforward

---

## ADR-006: Use OpenAI API for AI Capabilities

**Date:** 2026-06-26  
**Status:** Accepted

### Context

The core differentiator of the app is AI-generated, personalized saving tips, spending insights, and conversational responses. We need an LLM that handles nuanced financial language, follows structured output formats, and has reliable latency.

### Decision

Use the **OpenAI API** (GPT-4o model) for all AI features: insight generation, report narratives, and chat responses.

### Alternatives Considered

| Alternative                                  | Reason Not Chosen                                                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Anthropic Claude API                         | Strong reasoning, comparable quality; valid alternative — can be swapped behind the AI service interface |
| Gemini API (Google)                          | Competitive, but less established structured output support at decision time                             |
| Open-source LLM (self-hosted, e.g., Llama 3) | Eliminates API cost but requires GPU infrastructure; not viable for v1.0 ops budget                      |
| Rule-based tips engine                       | Fast and free, but cannot produce contextual, conversational responses                                   |

### Consequences

- **Positive:** GPT-4o supports structured outputs (JSON mode / function calling), enabling data-driven UI rendering from AI responses
- **Positive:** Mature SDK, reliable uptime SLA, well-documented rate limits
- **Negative:** Per-token cost — prompt engineering must minimize context size while preserving quality
- **Negative:** External API dependency; outages affect the AI features (graceful degradation needed)
- **Risk:** If costs grow significantly with scale, migrating to a cheaper model or a self-hosted solution will be evaluated
- **Mitigation:** The AI service layer is abstracted behind a backend interface (`/api/ai/*`), so the underlying model can be swapped without frontend changes

---

## ADR-007: Inject User Data into AI Prompts Server-Side

**Date:** 2026-06-26  
**Status:** Accepted

### Context

AI insights and chat responses must reference the user's real spending data. There are two approaches: have the client send data to the AI endpoint, or have the backend fetch and inject the data before calling the LLM.

### Decision

**Server-side context injection.** The backend API fetches the user's expense, budget, and goal data, constructs the prompt context object, and calls the OpenAI API — the client only sends the user's chat message (if any).

### Alternatives Considered

| Alternative                      | Reason Not Chosen                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Client sends data to AI endpoint | Exposes user financial data in the request body; creates a risk of client-side manipulation of context |
| Client calls OpenAI directly     | Exposes the OpenAI API key in the client; completely unacceptable security risk                        |

### Consequences

- **Positive:** The API key is never exposed to the client
- **Positive:** Server controls and validates all data injected into prompts, preventing prompt injection via user-supplied expense notes
- **Positive:** User data never leaves the server perimeter unnecessarily
- **Negative:** Every AI request requires a database fetch; add caching for dashboard insight calls if latency is a concern
- **Security note:** User-supplied free-text fields (expense notes, chat messages) are sanitized and injected into prompts as data values, never as instruction-level text

---

## ADR-008: Single Monthly Budget Total in v1.0

**Date:** 2026-06-26  
**Status:** Accepted

### Context

The requirements mention budget tracking, but do not specify whether budgets are set as a single monthly total or broken down per category. Both approaches have different data model and UI implications.

### Decision

**v1.0 uses a single monthly budget total.** The app will display per-category spend breakdowns against that total, but users do not set per-category budget limits in v1.0.

### Alternatives Considered

| Alternative                   | Reason Not Chosen                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Per-category budgets          | More powerful, but adds significant UI complexity (budget setting form, category-level alerts) and scope risk for v1.0 |
| No budget setting (view-only) | Reduces scope too much; setting a monthly total is a core feature per requirements                                     |

### Consequences

- **Positive:** Simpler data model (`Budget` has one `totalAmount` per month); faster to build and test
- **Positive:** AI insights can still reference per-category overspending relative to the total
- **Negative:** Power users (like Daniel, the goal-oriented saver) may want per-category limits — captured as a v1.1 backlog item
- **Migration path:** The `Budget` schema can be extended with a `CategoryBudget` relation in v1.1 without breaking existing records
