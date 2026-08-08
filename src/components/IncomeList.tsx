import type { Income } from "../types";
import { INCOME_CATEGORY_COLORS } from "../lib/income";
import { formatCurrency, formatDate } from "../lib/format";

interface Props {
  incomes: Income[];
  onDelete: (id: string) => void;
}

export function IncomeList({ incomes, onDelete }: Props) {
  const sorted = [...incomes].sort((a, b) => b.date.localeCompare(a.date));
  const total = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Entrate recenti</h2>
      </div>
      {sorted.length === 0 ? (
        <p className="empty-state">Nessuna entrata registrata. Aggiungine una per iniziare.</p>
      ) : (
        <>
          <ul className="expense-list">
            {sorted.map((income) => (
              <li key={income.id} className="expense-item">
                <span
                  className="category-dot"
                  style={{ backgroundColor: INCOME_CATEGORY_COLORS[income.category] }}
                />
                <div className="expense-info">
                  <span className="expense-description">{income.description}</span>
                  <span className="expense-meta">
                    {income.category} · {formatDate(income.date)}
                  </span>
                </div>
                <span className="expense-amount income-amount">+{formatCurrency(income.amount)}</span>
                <button
                  type="button"
                  className="btn-icon"
                  aria-label="Elimina entrata"
                  onClick={() => onDelete(income.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <p className="total-line">Totale: {formatCurrency(total)}</p>
        </>
      )}
    </div>
  );
}
