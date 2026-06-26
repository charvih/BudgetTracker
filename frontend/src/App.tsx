import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BLOOM_COLORS, EXPENSE_CATEGORIES } from './constants'
import {
  buildInsights,
  getCurrentMonthKey,
  getPreviousMonthKey,
  summarizeExpenses,
} from './services/insights'
import {
  clearSession,
  getExpenses,
  getSession,
  saveExpenses,
  saveSession,
} from './services/storage'
import type {
  Expense,
  ExpenseCategory,
  InsightResult,
  UserSession,
} from './types'
import './App.css'

type ExpenseDraft = {
  amount: string
  category: ExpenseCategory
  date: string
  description: string
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🌸' },
  { to: '/expenses', label: 'Expenses', icon: '🧾' },
  { to: '/summary', label: 'Monthly Summary', icon: '📈' },
  { to: '/insights', label: 'Insights & Tips', icon: '💡' },
]

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-')
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
    },
  )
}

function formatDate(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0]
}

function toCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

function tooltipCurrency(value: unknown): string {
  return toCurrency(typeof value === 'number' ? value : 0)
}

function App() {
  const [session, setSession] = useState<UserSession | null>(() => getSession())
  const [expenses, setExpenses] = useState<Expense[]>(() => getExpenses())
  const [activeMonthKey, setActiveMonthKey] = useState(getCurrentMonthKey())
  const [insights, setInsights] = useState<InsightResult | null>(null)
  const [insightLoading, setInsightLoading] = useState(false)

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const refreshInsights = useCallback(async () => {
    if (!session) {
      setInsights(null)
      return
    }

    setInsightLoading(true)
    const next = await buildInsights(expenses, session.name, activeMonthKey)
    setInsights(next)
    setInsightLoading(false)
  }, [activeMonthKey, expenses, session])

  useEffect(() => {
    void refreshInsights()
  }, [refreshInsights])

  const handleLogin = (name: string) => {
    const nextSession = { name }
    setSession(nextSession)
    saveSession(nextSession)
  }

  const handleLogout = () => {
    setSession(null)
    clearSession()
  }

  const addExpense = (draft: ExpenseDraft) => {
    const next: Expense = {
      id: crypto.randomUUID(),
      amount: Number(draft.amount),
      category: draft.category,
      date: draft.date,
      description: draft.description,
      createdDate: new Date().toISOString(),
    }
    setExpenses((prev) => [next, ...prev])
  }

  const updateExpense = (id: string, draft: ExpenseDraft) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              amount: Number(draft.amount),
              category: draft.category,
              date: draft.date,
              description: draft.description,
            }
          : expense,
      ),
    )
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  if (!session) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <header>
          <h1>Bloom Budget</h1>
          <p>Money habits, but make it cozy 🌿</p>
        </header>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <footer>
          <p className="sidebar-user">Hi, {session.name} ✨</p>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Log Out
          </button>
        </footer>
      </aside>

      <main className="content-panel">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                userName={session.name}
                expenses={expenses}
                monthKey={activeMonthKey}
                onMonthChange={setActiveMonthKey}
                insights={insights}
                insightLoading={insightLoading}
              />
            }
          />
          <Route
            path="/expenses"
            element={
              <ExpensesPage
                expenses={expenses}
                onAdd={addExpense}
                onUpdate={updateExpense}
                onDelete={deleteExpense}
              />
            }
          />
          <Route
            path="/summary"
            element={
              <SummaryPage expenses={expenses} monthKey={activeMonthKey} />
            }
          />
          <Route
            path="/insights"
            element={
              <InsightsPage
                monthKey={activeMonthKey}
                onMonthChange={setActiveMonthKey}
                insights={insights}
                isLoading={insightLoading}
                onRefresh={refreshInsights}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function LoginPage({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = name.trim()
    if (!value) {
      return
    }
    onLogin(value)
  }

  return (
    <section className="login-page">
      <div className="petal petal-a" aria-hidden />
      <div className="petal petal-b" aria-hidden />
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Welcome to Bloom Budget</h1>
        <p>
          Your warm little finance corner for tracking daily spend and growing
          wise money habits 🌸
        </p>
        <label htmlFor="name">Nickname</label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Mei, Aiko, or Jisoo"
          maxLength={32}
          required
        />
        <button type="submit">Start My Bloom Journey</button>
      </form>
    </section>
  )
}

function DashboardPage({
  userName,
  expenses,
  monthKey,
  onMonthChange,
  insights,
  insightLoading,
}: {
  userName: string
  expenses: Expense[]
  monthKey: string
  onMonthChange: (monthKey: string) => void
  insights: InsightResult | null
  insightLoading: boolean
}) {
  const summary = useMemo(
    () => summarizeExpenses(expenses, monthKey),
    [expenses, monthKey],
  )
  const chartData = useMemo(
    () =>
      EXPENSE_CATEGORIES.map((category) => ({
        name: category,
        value: summary.byCategory[category],
        color: BLOOM_COLORS[category],
      })).filter((item) => item.value > 0),
    [summary.byCategory],
  )

  const topCategories = [...EXPENSE_CATEGORIES]
    .map((category) => ({
      category,
      amount: summary.byCategory[category],
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>
            Hello {userName}, your spending garden for{' '}
            {formatMonthLabel(monthKey)} is ready 🌼
          </p>
        </div>
        <MonthPicker value={monthKey} onChange={onMonthChange} />
      </header>

      <div className="card-grid stat-grid">
        <StatCard
          title="Monthly Total"
          value={toCurrency(summary.total)}
          subtitle="Tracked spending"
        />
        <StatCard
          title="Expense Entries"
          value={`${summary.count}`}
          subtitle="All manually logged"
        />
        <StatCard
          title="Top Category"
          value={topCategories[0]?.category ?? 'None yet'}
          subtitle={toCurrency(topCategories[0]?.amount ?? 0)}
        />
      </div>

      <div className="card-grid two-column">
        <article className="card chart-card">
          <h3>Category Snapshot</h3>
          <p>Where your money is flowing this month</p>
          <div className="chart-wrap">
            {chartData.length === 0 ? (
              <EmptyState message="Add your first expense and this flower chart will bloom 🌱" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={45}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipCurrency} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <ul className="legend-list">
            {topCategories.map((item) => (
              <li key={item.category}>
                <span
                  className="legend-dot"
                  style={{ backgroundColor: BLOOM_COLORS[item.category] }}
                />
                {item.category} · {toCurrency(item.amount)}
              </li>
            ))}
          </ul>
        </article>

        <article className="card insights-card">
          <h3>Insights & Tips</h3>
          <p>Gentle AI nudges from your money auntie squad 💌</p>
          {insightLoading || !insights ? (
            <EmptyState message="Brewing your personalized tips..." />
          ) : (
            <>
              <p className="insight-greeting">{insights.greeting}</p>
              <p className="insight-summary">{insights.summaryLine}</p>
              <ul className="insight-list">
                {insights.items.map((item) => (
                  <li key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.message}</p>
                  </li>
                ))}
              </ul>
              <Link to="/insights" className="link-button">
                Open full Insights panel
              </Link>
            </>
          )}
        </article>
      </div>
    </section>
  )
}

function ExpensesPage({
  expenses,
  onAdd,
  onUpdate,
  onDelete,
}: {
  expenses: Expense[]
  onAdd: (draft: ExpenseDraft) => void
  onUpdate: (id: string, draft: ExpenseDraft) => void
  onDelete: (id: string) => void
}) {
  const [draft, setDraft] = useState<ExpenseDraft>({
    amount: '',
    category: 'Food',
    date: todayIso(),
    description: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.amount || Number(draft.amount) <= 0) {
      return
    }

    if (editingId) {
      onUpdate(editingId, draft)
      setEditingId(null)
    } else {
      onAdd(draft)
    }

    setDraft({
      amount: '',
      category: 'Food',
      date: todayIso(),
      description: '',
    })
  }

  const startEditing = (expense: Expense) => {
    setEditingId(expense.id)
    setDraft({
      amount: `${expense.amount}`,
      category: expense.category,
      date: expense.date,
      description: expense.description,
    })
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Expense Form & History</h2>
          <p>Log every spend with love and clarity 🧾</p>
        </div>
      </header>

      <div className="card-grid two-column">
        <article className="card">
          <h3>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
          <form className="expense-form" onSubmit={handleSubmit}>
            <label>
              Amount ($)
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.amount}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, amount: event.target.value }))
                }
                required
              />
            </label>

            <label>
              Category
              <select
                value={draft.category}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    category: event.target.value as ExpenseCategory,
                  }))
                }
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                value={draft.date}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, date: event.target.value }))
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Milk tea with bestie, school supplies, bus card top-up..."
              />
            </label>

            <div className="form-actions">
              <button type="submit">
                {editingId ? 'Save Update' : 'Save Expense'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    setEditingId(null)
                    setDraft({
                      amount: '',
                      category: 'Food',
                      date: todayIso(),
                      description: '',
                    })
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="card history-card">
          <h3>Expense History</h3>
          {sortedExpenses.length === 0 ? (
            <EmptyState message="No expense yet. Start with one tiny entry today ✨" />
          ) : (
            <ul className="history-list">
              {sortedExpenses.map((expense) => (
                <li key={expense.id}>
                  <div>
                    <h4>{expense.category}</h4>
                    <p>{expense.description || 'No description'}</p>
                    <small>{formatDate(expense.date)}</small>
                  </div>
                  <div className="history-actions">
                    <strong>{toCurrency(expense.amount)}</strong>
                    <button type="button" onClick={() => startEditing(expense)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  )
}

function SummaryPage({
  expenses,
  monthKey,
}: {
  expenses: Expense[]
  monthKey: string
}) {
  const current = useMemo(
    () => summarizeExpenses(expenses, monthKey),
    [expenses, monthKey],
  )
  const previousMonthKey = getPreviousMonthKey(monthKey)
  const previous = useMemo(
    () => summarizeExpenses(expenses, previousMonthKey),
    [expenses, previousMonthKey],
  )

  const comparison = current.total - previous.total
  const comparisonLabel =
    previous.total === 0
      ? 'No previous month data yet'
      : comparison >= 0
        ? `${toCurrency(comparison)} more than last month`
        : `${toCurrency(Math.abs(comparison))} less than last month`

  const chartData = EXPENSE_CATEGORIES.map((category) => ({
    category,
    value: current.byCategory[category],
    color: BLOOM_COLORS[category],
  }))

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Monthly Summary</h2>
          <p>Spending breakdown and month-to-month momentum</p>
        </div>
      </header>

      <div className="card-grid stat-grid">
        <StatCard
          title={formatMonthLabel(monthKey)}
          value={toCurrency(current.total)}
          subtitle="Total spent"
        />
        <StatCard
          title="Previous Month"
          value={toCurrency(previous.total)}
          subtitle={formatMonthLabel(previousMonthKey)}
        />
        <StatCard
          title="Comparison"
          value={comparisonLabel}
          subtitle="Month-over-month view"
        />
      </div>

      <div className="card-grid two-column">
        <article className="card chart-card">
          <h3>Category Breakdown Chart</h3>
          <p>Visual share of each category for this month</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e4dc" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={tooltipCurrency} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card">
          <h3>Category Detail</h3>
          <p>Compare your categories at a glance</p>
          <ul className="category-breakdown-list">
            {chartData.map((entry) => {
              const percentage =
                current.total > 0 ? (entry.value / current.total) * 100 : 0
              return (
                <li key={entry.category}>
                  <div className="category-row-title">
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: BLOOM_COLORS[entry.category] }}
                    />
                    <strong>{entry.category}</strong>
                  </div>
                  <p>
                    {toCurrency(entry.value)} · {percentage.toFixed(0)}%
                  </p>
                </li>
              )
            })}
          </ul>
        </article>
      </div>
    </section>
  )
}

function InsightsPage({
  monthKey,
  onMonthChange,
  insights,
  isLoading,
  onRefresh,
}: {
  monthKey: string
  onMonthChange: (value: string) => void
  insights: InsightResult | null
  isLoading: boolean
  onRefresh: () => void
}) {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>AI Insights & Tips</h2>
          <p>
            Triage flow: Monthly Summary Agent, Overspend Alert Agent, Tips
            Agent, and Budget Agent
          </p>
        </div>
        <div className="insights-controls">
          <MonthPicker value={monthKey} onChange={onMonthChange} />
          <button type="button" onClick={onRefresh}>
            Refresh Insights
          </button>
        </div>
      </header>

      <article className="card insights-card full-width">
        {isLoading || !insights ? (
          <EmptyState message="Your advice bouquet is being prepared..." />
        ) : (
          <>
            <h3>{insights.greeting}</h3>
            <p className="insight-summary">{insights.summaryLine}</p>
            <ul className="insight-list">
              {insights.items.map((item) => (
                <li key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.message}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
    </section>
  )
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <article className="card stat-card">
      <p>{title}</p>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </article>
  )
}

function MonthPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="month-picker">
      Month
      <input
        type="month"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  )
}

export default App
