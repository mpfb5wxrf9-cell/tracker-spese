import { useMemo } from "react";
import type { Expense, Subscription } from "../types";
import { MonthlyChart } from "./MonthlyChart";
import { CategoryChart } from "./CategoryChart";
import { formatCurrency, monthKey } from "../lib/format";
import { totalMonthlyCost, upcomingRenewals } from "../lib/subscriptions";

interface Props {
  expenses: Expense[];
  subscriptions: Subscription[];
}

export function Dashboard({ expenses, subscriptions }: Props) {
  const currentMonthKey = monthKey(new Date().toISOString().slice(0, 10));

  const currentMonthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === currentMonthKey),
    [expenses, currentMonthKey],
  );

  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const topCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of currentMonthExpenses) {
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }
    let best: string | null = null;
    let bestAmount = 0;
    for (const [category, amount] of totals) {
      if (amount > bestAmount) {
        best = category;
        bestAmount = amount;
      }
    }
    return best;
  }, [currentMonthExpenses]);

  const subscriptionsMonthlyTotal = totalMonthlyCost(subscriptions);
  const imminentCount = upcomingRenewals(subscriptions, 7).length;

  return (
    <div className="dashboard">
      <div className="stat-grid">
        <div className="card stat-card">
          <span className="stat-label">Spese questo mese</span>
          <span className="stat-value">{formatCurrency(currentMonthTotal)}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Categoria principale</span>
          <span className="stat-value stat-value-sm">{topCategory ?? "—"}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Costo abbonamenti/mese</span>
          <span className="stat-value">{formatCurrency(subscriptionsMonthlyTotal)}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Rinnovi imminenti (7gg)</span>
          <span className="stat-value">{imminentCount}</span>
        </div>
      </div>

      <div className="chart-grid">
        <MonthlyChart expenses={expenses} />
        <CategoryChart expenses={expenses} />
      </div>
    </div>
  );
}
