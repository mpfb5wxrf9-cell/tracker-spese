import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Expense } from "../types";
import { formatCurrency, monthKey, monthLabel } from "../lib/format";

interface Props {
  expenses: Expense[];
  months?: number;
}

export function MonthlyChart({ expenses, months = 6 }: Props) {
  const data = useMemo(() => {
    const now = new Date();
    const keys: string[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const totals = new Map<string, number>(keys.map((k) => [k, 0]));
    for (const expense of expenses) {
      const key = monthKey(expense.date);
      if (totals.has(key)) {
        totals.set(key, (totals.get(key) ?? 0) + expense.amount);
      }
    }

    return keys.map((key) => ({
      key,
      label: monthLabel(key),
      total: Math.round((totals.get(key) ?? 0) * 100) / 100,
    }));
  }, [expenses, months]);

  return (
    <div className="card">
      <h2>Andamento mensile</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={12}
            tickFormatter={(v) => `€${v}`}
            width={56}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
            }}
          />
          <Bar dataKey="total" fill="var(--accent)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
