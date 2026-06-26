# AI Agent Specification

## Purpose

The AI agent provides saving tips, spending insights, and conversational answers based on user budget and expense data.

## Capabilities

- Analyze recent expense history and identify patterns.
- Generate personalized saving suggestions.
- Explain overspending and categories of concern.
- Answer user questions about budget health, goals, and spending.

## AI Use Cases

### Use case 1: Personalized saving tip
- Trigger: User opens the app or requests a tip.
- Behavior: AI analyzes current spending vs. budget and returns one or more practical suggestions.
- Example: “You spent 15% more on dining out this week than usual. Try swapping one restaurant meal for a home-cooked option to save $40.”

### Use case 2: Spending insight
- Trigger: User asks for spending analysis or views their summary.
- Behavior: AI highlights category trends, unusual activity, and opportunities to improve.
- Example: “Your grocery spending is in line with your budget, but transportation is trending upward by 20% compared to last month.”

### Use case 3: Conversational response
- Trigger: User asks a question in the chat interface.
- Behavior: AI responds in a supportive tone and cites the user’s own data.
- Example: “You have $120 left in your monthly budget. If you keep your current pace, you may need to cut back on entertainment this week.”

## Response Guidelines

- Keep tone friendly, helpful, and non-judgmental.
- Use plain language; avoid financial jargon.
- Reference concrete numbers when available.
- Provide at least one actionable recommendation.
- If data is insufficient, ask for more details rather than guessing.

## Sample Prompts for Implementation

- “Review this user’s budget and spending. Provide one saving tip and one insight about overspending.”
- “Explain why the user’s spending is higher this month and suggest what category to reduce.”
- “Answer the user’s question about whether they are on track to reach their savings goal.”

## Example Responses

- “Great work so far! Your food budget is on track, but you can save more by cutting one coffee purchase a day. That could free up around $30 this week.”
- “Your top expense this month was transportation. Consider using public transit twice this week to keep your budget in balance.”
- “Yes — you’re currently 60% toward your goal, and if you keep saving $50 per week, you should reach it before your deadline.”
