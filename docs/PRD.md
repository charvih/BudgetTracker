# Product Requirements Document (PRD)

## Smart Budget Tracker

**Version:** 1.0  
**Date:** 2026-06-26  
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement

Many people struggle to understand their spending patterns and take actionable steps to improve their financial habits. Generic budgeting apps offer static dashboards but rarely help users understand _why_ they are overspending or _what_ to do next. Users need a lightweight, intelligent companion that contextualizes their spending and gives them a clear, friendly nudge toward better decisions.

### 1.2 Product Vision

A simple, AI-powered expense tracking app that helps budget-conscious individuals track spending, manage saving goals, and receive personalized financial guidance — all through a clean dashboard and a conversational AI assistant.

### 1.3 Goals

| Goal                                 | Metric                                                              |
| ------------------------------------ | ------------------------------------------------------------------- |
| Help users understand their spending | ≥70% of users view their monthly summary at least once per week     |
| Deliver useful AI insights           | ≥80% of AI tips rated as actionable (post-MVP user survey)          |
| Reduce overspending awareness gap    | Users identify their top overspending category within first session |
| Encourage goal setting               | ≥50% of active users create at least one saving goal                |

---

## 2. Target Users

### 2.1 Personas

**Emma — Budget-Conscious Professional (Primary)**

- Age 28, early career, managing personal expenses and savings goals
- Wants: quick expense logging, clear budget health at a glance, AI-driven tips
- Pain point: Knows she overspends but doesn't know exactly where or how to cut back

**Maya — Busy Parent (Secondary)**

- Age 38, juggling family expenses across multiple categories
- Wants: fast pattern recognition, easy-to-implement saving tips, friendly conversational feedback
- Pain point: Too busy to dig through transaction data manually

**Daniel — Goal-Oriented Saver (Tertiary)**

- Age 45, mid-career, focused on reaching specific financial milestones
- Wants: progress tracking against targets, AI insight on overspending categories, motivation
- Pain point: Lacks a tool that ties daily spending behavior to long-term goals

---

## 3. Scope

### 3.1 In Scope (v1.0)

- Expense entry with amount, category, date, and note
- Monthly budget setting and spend tracking
- Saving goals with deadline and progress tracking
- AI-generated saving tips and spending insights based on user data
- Conversational AI chat interface for budget questions
- Home dashboard summarizing budget status, spending, and goal progress
- Categorized expense reports with overspending highlights

### 3.2 Out of Scope (v1.0)

- Bank or card integrations / automatic transaction import
- Investment advice or portfolio tracking
- Multi-currency support
- Shared/family budgets with multiple accounts
- Push notification infrastructure (deferred to v1.1)
- Export to CSV/PDF (deferred to v1.1)

---

## 4. Features

### 4.1 Home Dashboard

The landing screen after launch. Displays:

- Current monthly budget status (spent vs. remaining)
- Total spending figure
- Goal progress summary (top active goal)
- AI insight summary (one tip or observation)
- Quick action buttons: Add Expense, View Report, Set Goal, Ask AI

### 4.2 Expense Management

- Add expenses with: amount (required), category (required), date (defaults to today), note (optional)
- Edit or delete any existing expense
- View expense list grouped by category or by date
- Minimum categories: Food, Transport, Bills, Entertainment, Health, Savings, Other
- Dashboard and insight data refresh automatically after any expense change

### 4.3 Budget Tracking

- User sets a monthly budget (single total or per-category)
- App computes remaining budget in real time
- Visual cues (color coding) highlight overspending categories
- Budget period resets monthly by default

### 4.4 Saving Goals

- Create goals with: goal name, target amount, and deadline date
- Progress bar and percentage displayed on dashboard and goal detail view
- Users can create multiple goals and view all in a list
- App notifies (in-app) when a goal reaches notable milestones (25%, 50%, 75%, 100%)

### 4.5 AI Saving Tips

- Triggered automatically on dashboard load or by explicit user request
- At least one personalized tip per session, grounded in recent spending data
- Tips are category-specific and actionable (e.g., amount to save, behavioral swap)
- No generic financial advice; all tips reference the user's own data

### 4.6 AI Spending Insights

- Surfaced in the report view and the AI chat panel
- Identifies: top overspending categories, month-over-month trend changes, irregular spending patterns
- All insights include a supporting data point (e.g., "up 20% vs last month")

### 4.7 AI Conversational Chat

- Chat-style interface where user can ask free-form budget questions
- AI references the user's actual expense and goal data in responses
- Tone: friendly, supportive, non-judgmental, plain language
- AI does not make financial guarantees or investment recommendations
- Follow-up suggestions offered after each AI response

---

## 5. User Stories Summary

| ID   | Story                               | Priority    |
| ---- | ----------------------------------- | ----------- |
| US-1 | Add and categorize expenses         | Must Have   |
| US-2 | View budget summary                 | Must Have   |
| US-3 | Set and track saving goals          | Must Have   |
| US-4 | Receive AI saving tips              | Must Have   |
| US-5 | Get spending insights from AI       | Should Have |
| US-6 | Ask questions via conversational AI | Should Have |

Full acceptance criteria in [user-stories.md](../user-stories.md).

---

## 6. Non-Functional Requirements

| Category        | Requirement                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Performance     | AI responses returned within 3 seconds under normal load                                        |
| Responsiveness  | UI works on mobile, tablet, and desktop viewports                                               |
| Privacy         | User data is private and isolated per user account                                              |
| Security        | No financial credentials stored; data encrypted at rest                                         |
| Maintainability | Code structured to allow new expense categories and AI prompt updates without major refactoring |
| Accessibility   | Core flows meet WCAG 2.1 AA contrast and keyboard navigation requirements                       |

---

## 7. Business Rules

1. Budget periods are monthly; they reset on the 1st of each calendar month.
2. Expense categories at launch: Food, Transport, Bills, Entertainment, Health, Savings, Other.
3. AI insights are generated from the user's own data only — not industry benchmarks.
4. The app must never state or imply specific investment returns or guarantees.
5. Expense amounts are stored in the user's local currency (single-currency v1.0).

---

## 8. Success Criteria

The v1.0 release is considered successful when:

- All Must Have user stories pass acceptance criteria in QA
- AI tip and insight generation works correctly against sample data sets
- The app is responsive and usable on a 375px mobile screen
- No P0 security or data privacy issues exist at launch
