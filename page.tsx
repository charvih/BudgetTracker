"use client";

import { useMemo, useState } from "react";
import {
  Flame,
  Leaf,
  Sparkles,
  Wallet,
  Heart,
  BookOpen,
  Truck,
  ShoppingBag,
  Music,
  Cpu,
  Edit3,
  Trash2,
  Flower2,
  CalendarDays,
  Sparkles as SparklesIcon,
} from "lucide-react";

const categories = [
  { value: "Food", icon: <FoodIcon /> },
  { value: "Transport", icon: <Truck size={16} /> },
  { value: "Shopping", icon: <ShoppingBag size={16} /> },
  { value: "Entertainment", icon: <Music size={16} /> },
  { value: "Education", icon: <BookOpen size={16} /> },
  { value: "Other", icon: <Cpu size={16} /> },
];

const categoryIcons: Record<string, JSX.Element> = {
  Food: <FoodIcon size={18} />,
  Transport: <Truck size={18} />,
  Shopping: <ShoppingBag size={18} />,
  Entertainment: <Music size={18} />,
  Education: <BookOpen size={18} />,
  Other: <Cpu size={18} />,
};

function FoodIcon({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 5.5V19" />
      <path d="M12 4.2V19" />
      <path d="M16 6.8V19" />
      <path d="M5 19h14" />
    </svg>
  );
}

function prettyDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildPrompt(expenses: Expense[]) {
  if (expenses.length === 0) {
    return `You are a warm older sister / auntie giving friendly finance advice to a teen. The user has no expenses yet. Encourage them gently to start tracking spending and share a short cute saving tip in a playful tone.`;
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = categories.reduce<Record<string, number>>((acc, category) => {
    acc[category.value] = expenses
      .filter((item) => item.category === category.value)
      .reduce((sum, item) => sum + item.amount, 0);
    return acc;
  }, {});
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const lastExpense = expenses[expenses.length - 1];

  return `You are a friendly older sister/auntie giving encouraging Asian-style saving advice. The user has these expenses:\n${expenses
    .map(
      (expense) => `- ${expense.date}: ${expense.category} ${formatCurrency(expense.amount)} (${expense.description})`,
    )
    .join("\n")}\n\nWrite a warm fun insight paragraph plus two saving tips. Mention the top category, a gentle note about pacing spending, and one cheerful reminder about budgeting for the next month. Use playful emoji and soft encouragement.`;
}

function generateInsights(expenses: Expense[]) {
  const prompt = buildPrompt(expenses);

  if (expenses.length === 0) {
    return "Hey flower friend 🌸, your wallet garden is ready to bloom! Start by jotting down one expense today, and I’ll help you grow a budget that feels easy and kind. Tip: save a little sparkle each week for a sweet treat later. 💖";
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = categories.reduce<Record<string, number>>((acc, category) => {
    acc[category.value] = expenses
      .filter((item) => item.category === category.value)
      .reduce((sum, item) => sum + item.amount, 0);
    return acc;
  }, {});
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const [topCategory, topAmount] = sorted[0];
  const second = sorted[1];
  const average = total / Math.max(expenses.length, 1);

  return `Sweetie, you spent ${formatCurrency(total)} this month and your biggest bloom came from ${topCategory} at ${formatCurrency(topAmount)}. ${
    second ? `The next biggest petal is ${second[0]} with ${formatCurrency(second[1])}. ` : ""
  }You’re doing great by tracking each purchase — that’s the first step to feeling confident with money. 🌿\n\nTips:\n1. If you want a little extra room for fun, try putting ${formatCurrency(Math.max(5, Math.round(total * 0.08)))} into a mini savings jar before you spend on snacks. 🍡\n2. When you choose between two treats, ask yourself: will this make me smile tomorrow too? If yes, it’s okay. If not, let the cozy savings grow. ✨\n\nKeep going, and I’ll remind you next month to celebrate your small wins and make a gentle plan for the next flower budget. 💐`;
}

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  createdAt: string;
};

const defaultExpenses: Expense[] = [
  {
    id: "1",
    amount: 18,
    category: "Food",
    date: "2026-06-05",
    description: "Bubble tea with friends",
    createdAt: "2026-06-05T13:30:00Z",
  },
  {
    id: "2",
    amount: 32,
    category: "Shopping",
    date: "2026-06-08",
    description: "New stationery set",
    createdAt: "2026-06-08T08:15:00Z",
  },
  {
    id: "3",
    amount: 12,
    category: "Transport",
    date: "2026-06-10",
    description: "Train to weekend study cafe",
    createdAt: "2026-06-10T16:50:00Z",
  },
];

export default function HomePage() {
  const [email, setEmail] = useState("charlie@example.com");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [formState, setFormState] = useState({
    amount: "",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const monthlyTotal = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );
  const categoryTotals = useMemo(
    () =>
      categories.map((category) => ({
        category: category.value,
        total: expenses
          .filter((expense) => expense.category === category.value)
          .reduce((sum, expense) => sum + expense.amount, 0),
      })),
    [expenses],
  );
  const topCategories = useMemo(
    () =>
      categoryTotals
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 3),
    [categoryTotals],
  );
  const previousMonthTotal = 260;
  const comparisonDelta = monthlyTotal - previousMonthTotal;
  const comparisonLabel = comparisonDelta >= 0 ? "higher" : "lower";
  const comparisonValue = Math.abs(comparisonDelta);
  const insights = generateInsights(expenses);

  const handleChange = (field: string, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    const amount = Number(formState.amount);
    if (!amount || !formState.description.trim()) return;

    const newExpense: Expense = {
      id: editingId || crypto.randomUUID(),
      amount,
      category: formState.category,
      date: formState.date,
      description: formState.description.trim(),
      createdAt: new Date().toISOString(),
    };

    setExpenses((current) => {
      if (editingId) {
        return current.map((expense) => (expense.id === editingId ? newExpense : expense));
      }
      return [newExpense, ...current];
    });

    setFormState({
      amount: "",
      category: "Food",
      date: new Date().toISOString().slice(0, 10),
      description: "",
    });
    setEditingId(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setFormState({
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      description: expense.description,
    });
  };

  const handleDelete = (id: string) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormState({
        amount: "",
        category: "Food",
        date: new Date().toISOString().slice(0, 10),
        description: "",
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <main>
        <section className="card" style={{ padding: "42px 32px", maxWidth: 520, margin: "80px auto" }}>
          <div style={{ display: "grid", gap: 22 }}>
            <div>
              <p className="small-label">Bloom Budget</p>
              <h1 className="hero-heading">Welcome back!</h1>
              <p className="subheading">Sign in and keep your money garden blooming with soft, easy steps.</p>
            </div>
            <input
              className="input-field"
              type="email"
              placeholder="your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button className="button-primary" onClick={() => setIsLoggedIn(true)}>
              Start tracking
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div style={{ marginBottom: 32 }}>
        <div className="section-title">
          <div>
            <p className="small-label">Bloom Budget</p>
            <h1 className="hero-heading">Hi Charlie, let’s bloom your money garden 🌸</h1>
            <p className="subheading">Track spending, celebrate wins, and get cozy saving tips with a friendly voice.</p>
          </div>
          <div>
            <button className="button-secondary">Monthly Summary</button>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <section className="card" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
          <div className="overlap-bg" />
          <p className="small-label">This month’s spending</p>
          <h2 style={{ margin: "12px 0 0", fontSize: "2rem" }}>{formatCurrency(monthlyTotal)}</h2>
          <p className="subheading" style={{ marginTop: 12 }}>Your wallet is full of stories — let’s see where the petals landed.</p>
        </section>
        <section className="card" style={{ padding: 24 }}>
          <p className="small-label">Top category</p>
          <h2 style={{ margin: "12px 0 0" }}>{topCategories[0]?.category ?? "No expenses yet"}</h2>
          <p className="subheading" style={{ marginTop: 12 }}>{topCategories[0] ? formatCurrency(topCategories[0].total) : "Add an expense to bloom."}</p>
        </section>
        <section className="card" style={{ padding: 24 }}>
          <p className="small-label">Month-over-month</p>
          <h2 style={{ margin: "12px 0 0" }}>{comparisonLabel} by {formatCurrency(comparisonValue)}</h2>
          <p className="subheading" style={{ marginTop: 12 }}>Compared to last month’s gentle spending total of {formatCurrency(previousMonthTotal)}.</p>
        </section>
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        <section className="card" style={{ padding: 28 }}>
          <div className="section-title">
            <div>
              <p className="small-label">Expense form</p>
              <h2>Add or update an expense</h2>
            </div>
            <span className="inline-chip">{editingId ? "Editing mode" : "New entry"}</span>
          </div>

          <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
            <div>
              <label className="small-label" htmlFor="amount">Amount</label>
              <input
                id="amount"
                className="input-field"
                type="number"
                min="1"
                value={formState.amount}
                onChange={(event) => handleChange("amount", event.target.value)}
                placeholder="e.g. 22"
              />
            </div>
            <div>
              <label className="small-label" htmlFor="category">Category</label>
              <select
                id="category"
                className="select-field"
                value={formState.category}
                onChange={(event) => handleChange("category", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="small-label" htmlFor="date">Date</label>
              <input
                id="date"
                className="input-field"
                type="date"
                value={formState.date}
                onChange={(event) => handleChange("date", event.target.value)}
              />
            </div>
            <div>
              <label className="small-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="textarea-field"
                rows={4}
                value={formState.description}
                onChange={(event) => handleChange("description", event.target.value)}
                placeholder="What did you spend on?"
              />
            </div>
            <button className="button-primary" onClick={handleSave}>
              Save expense
            </button>
          </div>
        </section>

        <section className="card soft-card" style={{ padding: 28 }}>
          <div className="section-title">
            <div>
              <p className="small-label">Insights & Tips</p>
              <h2>Friendly AI advice</h2>
            </div>
            <span className="inline-chip">From your spending garden</span>
          </div>
          <p style={{ marginTop: 18, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{insights}</p>
        </section>
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        <section className="card" style={{ padding: 24 }}>
          <div className="section-title">
            <div>
              <p className="small-label">Monthly summary</p>
              <h2>Category breakdown</h2>
            </div>
            <div className="inline-chip">Total {formatCurrency(monthlyTotal)}</div>
          </div>
          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            {categoryTotals.map((item) => (
              <div key={item.category} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <span>{item.category}</span>
                <span>{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card soft-card" style={{ padding: 24 }}>
          <div className="section-title">
            <div>
              <p className="small-label">Today’s mood</p>
              <h2>Budget buddy cheer</h2>
            </div>
          </div>
          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            <div className="inline-chip">🌙 Save a little spark for the weekend</div>
            <div className="inline-chip">🍱 Keep a note of snack spending for a happy habit</div>
            <div className="inline-chip">📚 Education goals are a nice steady bloom</div>
          </div>
        </section>
      </div>

      <section className="card" style={{ padding: 24 }}>
        <div className="section-title">
          <div>
            <p className="small-label">History</p>
            <h2>Expense journal</h2>
          </div>
          <span className="inline-chip">{expenses.length} entries</span>
        </div>
        <div style={{ marginTop: 16 }}>
          {expenses.length === 0 ? (
            <p className="subheading">No expenses logged yet. Add one above to start your budget story.</p>
          ) : (
            expenses.map((expense) => (
              <div className="expense-row" key={expense.id}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(expense.amount)}</span>
                    <span className="expense-category">{expense.category}</span>
                  </div>
                  <p style={{ margin: "10px 0 0", color: "var(--text-muted)" }}>{expense.description}</p>
                  <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>{prettyDate(expense.date)}</p>
                </div>
                <div className="expense-actions">
                  <button className="button-secondary" style={{ minWidth: 40 }} onClick={() => handleEdit(expense)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="button-secondary" style={{ minWidth: 40 }} onClick={() => handleDelete(expense.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
