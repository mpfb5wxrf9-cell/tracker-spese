import { useMemo } from "react";
import type { Expense, Income, Subscription } from "../types";
import { MonthlyChart } from "./MonthlyChart";
import { CategoryChart } from "./CategoryChart";
import { formatCurrency, monthKey } from "../lib/format";
import { totalMonthlyCost, upcomingRenewals } from "../lib/subscriptions";

interface Props {
  expenses: Expense[];
  incomes: Income[];
  subscriptions: Subscription[];
}

export function Dashboard({ expenses, incomes, subscriptions }: Props) {
  const currentMonthKey = monthKey(new Date().toISOString().slice(0, 10));

  const currentMonthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === currentMonthKey),
    [expenses, currentMonthKey],
  );

  const currentMonthIncomes = useMemo(
    () => incomes.filter((i) => monthKey(i.date) === currentMonthKey),
    [incomes, currentMonthKey],
  );

  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentMonthIncomeTotal = currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const currentMonthBalance = currentMonthIncomeTotal - currentMonthTotal;

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
          <span className="stat-label">Entrate questo mese</span>
          <span className="stat-value stat-positive">{formatCurrency(currentMonthIncomeTotal)}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Spese questo mese</span>
          <span className="stat-value">{formatCurrency(currentMonthTotal)}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Saldo questo mese</span>
          <span className={`stat-value ${currentMonthBalance >= 0 ? "stat-positive" : "stat-negative"}`}>
            {formatCurrency(currentMonthBalance)}
          </span>
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
