import { STORAGE_KEYS } from '../constants'
import type { Expense, UserSession } from '../types'

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function getExpenses(): Expense[] {
  return parseJson<Expense[]>(localStorage.getItem(STORAGE_KEYS.expenses), [])
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses))
}

export function getSession(): UserSession | null {
  return parseJson<UserSession | null>(
    localStorage.getItem(STORAGE_KEYS.session),
    null,
  )
}

export function saveSession(session: UserSession): void {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.session)
}
