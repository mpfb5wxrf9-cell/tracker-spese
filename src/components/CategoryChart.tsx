import { useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Expense } from "../types";
import { CATEGORY_COLORS } from "../lib/categories";
import { formatCurrency, monthKey, monthLabel } from "../lib/format";

interface Props {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: Props) {
  const availableMonths = useMemo(() => {
    const keys = new Set(expenses.map((e) => monthKey(e.date)));
    const currentKey = monthKey(new Date().toISOString().slice(0, 10));
    keys.add(currentKey);
    return Array.from(keys).sort().reverse();
  }, [expenses]);

  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]);
  const activeMonth = availableMonths.includes(selectedMonth) ? selectedMonth : availableMonths[0];

  const data = useMemo(() => {
    const totals = new Map<string, number>();
    for (const expense of expenses) {
      if (monthKey(expense.date) !== activeMonth) continue;
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    }
    return Array.from(totals.entries())
      .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, activeMonth]);

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Spese per categoria</h2>
        <select value={activeMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {availableMonths.map((key) => (
            <option key={key} value={key}>
              {monthLabel(key)}
            </option>
          ))}
        </select>
      </div>
      {data.length === 0 ? (
        <p className="empty-state">Nessuna spesa in questo mese.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="total-line">Totale: {formatCurrency(total)}</p>
        </>
      )}
    </div>
  );
}
