"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string | null;
  occurred_at: string;
  created_at: string;
}

interface Goal {
  id: string;
  period: "monthly" | "yearly";
  target_amount: number;
}

const COLORS = ["#39ff88", "#ffd700", "#3b82f6", "#dc143c", "#a78bfa", "#22d3ee", "#f472b6", "#f59e0b"];
const CATEGORIES = ["Salary", "Freelance", "Investments", "Rent", "Food", "Software", "Marketing", "Other"];

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", { month: "short" });
}

export default function AdminFinances() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ amount: "", type: "income", category: "Salary", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingGoal, setEditingGoal] = useState<"monthly" | "yearly" | null>(null);
  const [goalInput, setGoalInput] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [txRes, goalsRes] = await Promise.all([
        fetch("/api/admin/transactions"),
        fetch("/api/admin/goals"),
      ]);
      const tx = await txRes.json();
      const gl = await goalsRes.json();
      if (!txRes.ok) throw new Error(tx.error);
      if (!goalsRes.ok) throw new Error(gl.error);
      setTransactions(tx);
      setGoals(gl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm({ amount: "", type: "income", category: "Salary", description: "" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const removeTx = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/admin/transactions/${id}`, { method: "DELETE" });
    load();
  };

  const saveGoal = async (period: "monthly" | "yearly") => {
    const amount = Number(goalInput);
    if (!amount || amount <= 0) return;
    await fetch("/api/admin/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period, target_amount: amount }),
    });
    setEditingGoal(null);
    setGoalInput("");
    load();
  };

  // ---- Derived data ----
  const stats = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const profit = totalIncome - totalExpenses;
    const savings = Math.max(profit, 0);

    // Group by month for sparklines + bar chart
    const byMonth: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const key = monthKey(t.occurred_at);
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0 };
      byMonth[key][t.type === "income" ? "income" : "expense"] += Number(t.amount);
    });

    const monthKeys = Object.keys(byMonth).sort().slice(-6);
    const monthly = monthKeys.map((key) => ({
      month: monthLabel(key),
      income: byMonth[key].income,
      expense: byMonth[key].expense,
      profit: byMonth[key].income - byMonth[key].expense,
    }));

    const incomeSparkline = monthly.map((m) => ({ v: m.income }));
    const expenseSparkline = monthly.map((m) => ({ v: m.expense }));
    const profitSparkline = monthly.map((m) => ({ v: m.profit }));
    const savingsSparkline = monthly.map((m, i) => {
      const cumulative = monthly.slice(0, i + 1).reduce((s, x) => s + x.profit, 0);
      return { v: Math.max(cumulative, 0) };
    });

    // Income by category (donut)
    const incomeByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + Number(t.amount);
      });
    const donutData = Object.entries(incomeByCategory)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));

    // Current month / year progress for goals
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentMonthIncome = byMonth[currentMonthKey]?.income || 0;
    const currentYearIncome = transactions
      .filter((t) => new Date(t.occurred_at).getFullYear() === now.getFullYear() && t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpenses,
      profit,
      savings,
      monthly,
      incomeSparkline,
      expenseSparkline,
      profitSparkline,
      savingsSparkline,
      donutData,
      currentMonthIncome,
      currentYearIncome,
    };
  }, [transactions]);

  const monthlyGoal = goals.find((g) => g.period === "monthly");
  const yearlyGoal = goals.find((g) => g.period === "yearly");
  const monthlyProgress = monthlyGoal ? Math.min((stats.currentMonthIncome / Number(monthlyGoal.target_amount)) * 100, 100) : 0;
  const yearlyProgress = yearlyGoal ? Math.min((stats.currentYearIncome / Number(yearlyGoal.target_amount)) * 100, 100) : 0;

  return (
    <div className="finance-dashboard">
      <div className="admin-header">
        <h1>Finances</h1>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <>
          {/* KPI Cards with Sparklines */}
          <div className="finance-kpi-grid">
            <div className="finance-kpi-card">
              <div className="finance-kpi-label">Income</div>
              <div className="finance-kpi-value" style={{ color: "#39ff88" }}>
                €{stats.totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="finance-sparkline">
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={stats.incomeSparkline}>
                    <Line type="monotone" dataKey="v" stroke="#39ff88" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="finance-kpi-card">
              <div className="finance-kpi-label">Expenses</div>
              <div className="finance-kpi-value" style={{ color: "#dc143c" }}>
                €{stats.totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="finance-sparkline">
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={stats.expenseSparkline}>
                    <Line type="monotone" dataKey="v" stroke="#dc143c" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="finance-kpi-card">
              <div className="finance-kpi-label">Profit</div>
              <div className="finance-kpi-value" style={{ color: "#3b82f6" }}>
                €{stats.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="finance-sparkline">
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={stats.profitSparkline}>
                    <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="finance-kpi-card">
              <div className="finance-kpi-label">Savings</div>
              <div className="finance-kpi-value" style={{ color: "#ffd700" }}>
                €{stats.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="finance-sparkline">
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={stats.savingsSparkline}>
                    <Line type="monotone" dataKey="v" stroke="#ffd700" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="finance-main-grid">
            {/* Transaction Entry Widget */}
            <div className="finance-card">
              <h3>Add Transaction</h3>
              <form onSubmit={submit} className="finance-tx-form">
                <div className="finance-tx-type-toggle">
                  <button
                    type="button"
                    className={form.type === "income" ? "active income" : ""}
                    onClick={() => setForm({ ...form, type: "income" })}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    className={form.type === "expense" ? "active expense" : ""}
                    onClick={() => setForm({ ...form, type: "expense" })}
                  >
                    Expense
                  </button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount (€)"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Transaction"}
                </button>
              </form>

              <div className="finance-tx-list">
                {transactions.slice(0, 6).map((t) => (
                  <div key={t.id} className="finance-tx-row">
                    <span className={`finance-tx-dot ${t.type}`} />
                    <span className="finance-tx-category">{t.category}</span>
                    <span className={`finance-tx-amount ${t.type}`}>
                      {t.type === "income" ? "+" : "-"}€{Number(t.amount).toLocaleString()}
                    </span>
                    <button className="finance-tx-delete" onClick={() => removeTx(t.id)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart */}
            <div className="finance-card">
              <h3>Income Distribution</h3>
              {stats.donutData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      label={(props: any) => `${((props.percent || 0) * 100).toFixed(0)}%`}
                    >
                      {stats.donutData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                      formatter={(v: any) => `€${Number(v).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">No income data yet.</p>
              )}
            </div>
          </div>

          <div className="finance-main-grid">
            {/* Bar Chart */}
            <div className="finance-card" style={{ gridColumn: "1 / -1" }}>
              <h3>Income vs Expenses</h3>
              {stats.monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                      formatter={(v: any) => `€${Number(v).toLocaleString()}`}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#39ff88" name="Income" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="#dc143c" name="Expenses" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">No data yet.</p>
              )}
            </div>
          </div>

          {/* Circular Progress Goals */}
          <div className="finance-goals-grid">
            <div className="finance-card finance-goal-card">
              <h3>Monthly Goal</h3>
              <div className="finance-radial">
                <ResponsiveContainer width="100%" height={180}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[{ value: monthlyProgress, fill: "#39ff88" }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" background={{ fill: "#334155" }} cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="finance-radial-label">{monthlyProgress.toFixed(0)}%</div>
              </div>
              <p className="muted">
                €{stats.currentMonthIncome.toLocaleString()} / €{Number(monthlyGoal?.target_amount || 0).toLocaleString()}
              </p>
              {editingGoal === "monthly" ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Target €"
                    autoFocus
                  />
                  <button className="btn btn-small btn-primary" onClick={() => saveGoal("monthly")}>Save</button>
                </div>
              ) : (
                <button
                  className="btn btn-small"
                  onClick={() => {
                    setEditingGoal("monthly");
                    setGoalInput(String(monthlyGoal?.target_amount || ""));
                  }}
                >
                  Edit Goal
                </button>
              )}
            </div>

            <div className="finance-card finance-goal-card">
              <h3>Yearly Goal</h3>
              <div className="finance-radial">
                <ResponsiveContainer width="100%" height={180}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[{ value: yearlyProgress, fill: "#ffd700" }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" background={{ fill: "#334155" }} cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="finance-radial-label">{yearlyProgress.toFixed(0)}%</div>
              </div>
              <p className="muted">
                €{stats.currentYearIncome.toLocaleString()} / €{Number(yearlyGoal?.target_amount || 0).toLocaleString()}
              </p>
              {editingGoal === "yearly" ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Target €"
                    autoFocus
                  />
                  <button className="btn btn-small btn-primary" onClick={() => saveGoal("yearly")}>Save</button>
                </div>
              ) : (
                <button
                  className="btn btn-small"
                  onClick={() => {
                    setEditingGoal("yearly");
                    setGoalInput(String(yearlyGoal?.target_amount || ""));
                  }}
                >
                  Edit Goal
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
