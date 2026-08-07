import { useState, type FormEvent } from "react";
import type { Category, Expense } from "../types";
import { CATEGORIES, categorizeDescription } from "../lib/categories";
import { todayIso } from "../lib/format";

interface Props {
  onAdd: (expense: Expense) => void;
}

export function ExpenseForm({ onAdd }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Altro");
  const [date, setDate] = useState(todayIso());
  const [categoryTouched, setCategoryTouched] = useState(false);

  function handleDescriptionChange(value: string) {
    setDescription(value);
    if (!categoryTouched) {
      setCategory(categorizeDescription(value));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: parsedAmount,
      category,
      date,
      createdAt: new Date().toISOString(),
    });

    setDescription("");
    setAmount("");
    setCategory("Altro");
    setCategoryTouched(false);
    setDate(todayIso());
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Nuova spesa</h2>
      <div className="form-row">
        <label>
          Descrizione
          <input
            type="text"
            placeholder="Es. Spesa al supermercato"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="form-row form-row-split">
        <label>
          Importo (€)
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Data
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Categoria
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category);
              setCategoryTouched(true);
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        {!categoryTouched && description.trim() && (
          <span className="hint">Categoria suggerita automaticamente</span>
        )}
      </div>
      <button type="submit" className="btn-primary">
        Aggiungi spesa
      </button>
    </form>
  );
}
