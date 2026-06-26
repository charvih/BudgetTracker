import type { ExpenseCategory } from './types'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Other',
]

export const STORAGE_KEYS = {
  expenses: 'bloom-budget-expenses',
  session: 'bloom-budget-session',
}

export const BLOOM_COLORS: Record<ExpenseCategory, string> = {
  Food: '#A8C5A0',
  Transport: '#8BA6D9',
  Shopping: '#F4D7DA',
  Entertainment: '#D7C8F0',
  Education: '#F3C37A',
  Other: '#C7D7C1',
}
