import { EXPENSE_CATEGORIES } from '../constants'
import type {
  Expense,
  ExpenseCategory,
  InsightItem,
  InsightResult,
  MonthlySummary,
} from '../types'

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`
}

export function getMonthKeyFromDate(dateIso: string): string {
  return toMonthKey(new Date(dateIso))
}

export function getCurrentMonthKey(): string {
  return toMonthKey(new Date())
}

export function getPreviousMonthKey(monthKey: string): string {
  const [yearRaw, monthRaw] = monthKey.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw) - 1
  const previousDate = new Date(year, month - 1, 1)
  return toMonthKey(previousDate)
}

export function summarizeExpenses(
  expenses: Expense[],
  monthKey: string,
): MonthlySummary {
  const monthExpenses = expenses.filter(
    (expense) => getMonthKeyFromDate(expense.date) === monthKey,
  )

  const byCategory = EXPENSE_CATEGORIES.reduce<Record<ExpenseCategory, number>>(
    (acc, category) => {
      acc[category] = 0
      return acc
    },
    {} as Record<ExpenseCategory, number>,
  )

  for (const expense of monthExpenses) {
    byCategory[expense.category] += expense.amount
  }

  return {
    monthKey,
    total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    byCategory,
    count: monthExpenses.length,
  }
}

function monthlySummaryAgent(
  current: MonthlySummary,
  previous: MonthlySummary,
): InsightItem {
  if (current.total === 0) {
    return {
      title: 'Fresh Start Bloom',
      message:
        'No spending entries yet this month. Plant your first tiny money seed today 🌱 and we will cheer you on together!',
    }
  }

  const diff = current.total - previous.total
  const trend =
    previous.total === 0
      ? 'This is your first tracked month, jia you and keep logging!'
      : diff > 0
        ? `You spent $${diff.toFixed(2)} more than last month.`
        : `You spent $${Math.abs(diff).toFixed(2)} less than last month. Wah, strong discipline!`

  return {
    title: 'Monthly Summary Agent',
    message: `This month you spent $${current.total.toFixed(2)} across ${current.count} expenses. ${trend}`,
  }
}

function overspendAlertAgent(current: MonthlySummary): InsightItem {
  const entries = Object.entries(current.byCategory)
  const top = entries.sort((a, b) => b[1] - a[1])[0]

  if (!top || top[1] <= 0 || current.total <= 0) {
    return {
      title: 'Overspend Alert Agent',
      message:
        'No overspend alert now. Your spending is balanced, nice and steady ✨',
    }
  }

  const percentage = (top[1] / current.total) * 100
  if (percentage >= 40) {
    return {
      title: 'Overspend Alert Agent',
      message: `${top[0]} takes ${percentage.toFixed(0)}% of your month. Maybe cap this category with a mini weekly limit, can?`,
    }
  }

  return {
    title: 'Overspend Alert Agent',
    message: `Top category is ${top[0]} at ${percentage.toFixed(0)}% of spend. Healthy, but keep one eye on it 👀`,
  }
}

function tipsAgent(current: MonthlySummary): InsightItem {
  const sorted = Object.entries(current.byCategory).sort((a, b) => b[1] - a[1])
  const [topCategory, topValue] = sorted[0] ?? ['Other', 0]

  if (current.total <= 0) {
    return {
      title: 'Tips Agent',
      message:
        'Try a tiny goal: log every purchase for 3 days. Awareness first, savings naturally follow 🌸',
    }
  }

  const targetCut = Math.max(5, topValue * 0.12)
  return {
    title: 'Tips Agent',
    message: `Auntie tip: trim about $${targetCut.toFixed(2)} from ${topCategory} next month and move it to your future-fun fund. Small cuts become big wins!`,
  }
}

function budgetAgent(current: MonthlySummary): InsightItem {
  const suggestedNextMonth = current.total * 0.9
  return {
    title: 'Budget Agent',
    message:
      current.total > 0
        ? `Suggested next-month budget: $${suggestedNextMonth.toFixed(2)} (about 10% leaner). Keep it realistic, then beat it gently 💪`
        : 'Set a starter budget after your first week of entries so it matches your real life rhythm.',
  }
}

async function tryBase44Agent(payload: {
  current: MonthlySummary
  previous: MonthlySummary
  userName: string
}): Promise<InsightResult | null> {
  const endpoint = import.meta.env.VITE_BASE44_ENDPOINT
  if (!endpoint) {
    return null
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt:
          'Generate encouraging budget insights in a warm Asian older-sibling/auntie tone. Reference the supplied expense data only.',
        data: payload,
      }),
    })

    if (!response.ok) {
      return null
    }

    const body = (await response.json()) as Partial<InsightResult>
    if (!body.items || !body.greeting || !body.summaryLine) {
      return null
    }

    return {
      greeting: body.greeting,
      summaryLine: body.summaryLine,
      items: body.items,
    }
  } catch {
    return null
  }
}

export async function buildInsights(
  expenses: Expense[],
  userName: string,
  monthKey: string,
): Promise<InsightResult> {
  const current = summarizeExpenses(expenses, monthKey)
  const previous = summarizeExpenses(expenses, getPreviousMonthKey(monthKey))

  const fromBase44 = await tryBase44Agent({ current, previous, userName })
  if (fromBase44) {
    return fromBase44
  }

  const items = [
    monthlySummaryAgent(current, previous),
    overspendAlertAgent(current),
    tipsAgent(current),
    budgetAgent(current),
  ]

  return {
    greeting: `Welcome back ${userName}! Your money garden is blooming nicely 🌸`,
    summaryLine: `Tracked ${current.count} expense${current.count === 1 ? '' : 's'} this month with total spending of $${current.total.toFixed(2)}.`,
    items,
  }
}
