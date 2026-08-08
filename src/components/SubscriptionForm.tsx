import { useState, type FormEvent } from "react";
import type { BillingCycle, Category, Subscription } from "../types";
import { CATEGORIES } from "../lib/categories";
import { todayIso } from "../lib/format";
import { DateFields } from "./DateFields";

const BILLING_CYCLES: BillingCycle[] = ["Settimanale", "Mensile", "Annuale"];

interface Props {
  onAdd: (subscription: Subscription) => void;
}

export function SubscriptionForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Mensile");
  const [nextRenewal, setNextRenewal] = useState(todayIso());
  const [category, setCategory] = useState<Category>("Abbonamenti");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!name.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      amount: parsedAmount,
      billingCycle,
      nextRenewal,
      category,
    });

    setName("");
    setAmount("");
    setBillingCycle("Mensile");
    setNextRenewal(todayIso());
    setCategory("Abbonamenti");
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Nuovo abbonamento</h2>
      <div className="form-row">
        <label>
          Nome
          <input
            type="text"
            placeholder="Es. Netflix"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          Frequenza
          <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}>
            {BILLING_CYCLES.map((cycle) => (
              <option key={cycle} value={cycle}>
                {cycle}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <span className="field-label">Prossimo rinnovo</span>
        <DateFields value={nextRenewal} onChange={setNextRenewal} />
      </div>
      <div className="form-row">
        <label>
          Categoria
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className="btn-primary">
        Aggiungi abbonamento
      </button>
    </form>
  );
}
