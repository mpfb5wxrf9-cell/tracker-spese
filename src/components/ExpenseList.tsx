import type { Expense } from "../types";
import { CATEGORY_COLORS } from "../lib/categories";
import { formatCurrency, formatDate } from "../lib/format";

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: Props) {
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="card">
      <h2>Spese recenti</h2>
      {sorted.length === 0 ? (
        <p className="empty-state">Nessuna spesa registrata. Aggiungine una per iniziare.</p>
      ) : (
        <ul className="expense-list">
          {sorted.map((expense) => (
            <li key={expense.id} className="expense-item">
              <span
                className="category-dot"
                style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
              />
              <div className="expense-info">
                <span className="expense-description">{expense.description}</span>
                <span className="expense-meta">
                  {expense.category} · {formatDate(expense.date)}
                </span>
              </div>
              <span className="expense-amount">{formatCurrency(expense.amount)}</span>
              <button
                type="button"
                className="btn-icon"
                aria-label="Elimina spesa"
                onClick={() => onDelete(expense.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
