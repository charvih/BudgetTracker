# Requirements

## Business Requirements

1. Provide an intuitive financial overview for users.
2. Help users understand spending behavior and make better choices.
3. Use AI to deliver personalized saving tips and spending insights.
4. Keep interaction simple and supportive, without overwhelming the user.

## Functional Requirements

### Expense management
- Users can add, edit, and delete expenses.
- Each expense record includes amount, category, date, and note.
- Users can view expenses grouped by category and date.

### Budget tracking
- Users can set monthly budgets and view remaining amounts.
- The app displays total spending and budget balance.
- The app detects overspending and provides visual cues.

### Goal tracking
- Users can create saving goals with target amount and deadline.
- The app tracks goal progress and displays completion status.
- Users can view goal summaries alongside budget insights.

### Insights and recommendations
- AI generates saving tips based on expense patterns.
- AI provides spending insights for the user’s current period.
- The app offers conversational responses to user questions.

### AI agent
- The AI agent analyzes recent spending and budget data.
- It responds with friendly, clear, and practical advice.
- It can answer questions such as:
  - “How can I save more this month?”
  - “Why is my restaurant spending high?”
  - “Do I have enough saved for my goal?”

## Non-Functional Requirements

- The UI must be responsive and mobile-friendly.
- Data must be stored securely and private to each user.
- AI responses should be returned within a few seconds.
- The system should be easy to maintain and extend.

## Business Rules

- Budget periods are tracked monthly by default.
- Expense categories should include at minimum: Food, Transport, Bills, Entertainment, Health, Savings, Other.
- AI insights are based on the latest available user data.
- The app must avoid making financial guarantees or giving investment advice.

## Assumptions

- Users are comfortable with a conversational AI assistant.
- Expense data is manually entered or imported from a simple source.
- The initial product scope focuses on budgeting, saving, and insights rather than full accounting.
