import { useState } from "react";
import "./App.css";
import type { Expense, Income, Subscription } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Dashboard } from "./components/Dashboard";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";
import { IncomeForm } from "./components/IncomeForm";
import { IncomeList } from "./components/IncomeList";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionMonitor } from "./components/SubscriptionMonitor";

type Tab = "dashboard" | "expenses" | "income" | "subscriptions";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "expenses", label: "Spese" },
  { id: "income", label: "Entrate" },
  { id: "subscriptions", label: "Abbonamenti" },
];

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("tracker-spese:expenses", []);
  const [incomes, setIncomes] = useLocalStorage<Income[]>("tracker-spese:incomes", []);
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>(
    "tracker-spese:subscriptions",
    [],
  );
  const [tab, setTab] = useState<Tab>("dashboard");

  function addExpense(expense: Expense) {
    setExpenses((prev) => [expense, ...prev]);
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  function addIncome(income: Income) {
    setIncomes((prev) => [income, ...prev]);
  }

  function deleteIncome(id: string) {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  }

  function addSubscription(subscription: Subscription) {
    setSubscriptions((prev) => [subscription, ...prev]);
  }

  function deleteSubscription(id: string) {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tracker Spese</h1>
        <p className="app-subtitle">Spese, grafici mensili e abbonamenti in un unico posto</p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "tab-active" : ""}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === "dashboard" && (
          <Dashboard expenses={expenses} incomes={incomes} subscriptions={subscriptions} />
        )}

        {tab === "expenses" && (
          <div className="two-column">
            <ExpenseForm onAdd={addExpense} />
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
        )}

        {tab === "income" && (
          <div className="two-column">
            <IncomeForm onAdd={addIncome} />
            <IncomeList incomes={incomes} onDelete={deleteIncome} />
          </div>
        )}

        {tab === "subscriptions" && (
          <div className="two-column">
            <SubscriptionForm onAdd={addSubscription} />
            <SubscriptionMonitor subscriptions={subscriptions} onDelete={deleteSubscription} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
