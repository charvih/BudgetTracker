export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Education'
  | 'Other'

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  date: string
  description: string
  createdDate: string
}

export interface UserSession {
  name: string
}

export interface MonthlySummary {
  monthKey: string
  total: number
  byCategory: Record<ExpenseCategory, number>
  count: number
}

export interface InsightItem {
  title: string
  message: string
}

export interface InsightResult {
  greeting: string
  summaryLine: string
  items: InsightItem[]
}
