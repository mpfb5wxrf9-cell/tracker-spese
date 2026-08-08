import { useState } from "react";
import { signOut } from "firebase/auth";
import "./App.css";
import type { Expense, Income, Subscription } from "./types";
import { auth } from "./lib/firebase";
import { useAuth } from "./hooks/useAuth";
import { useFirestoreCollection } from "./hooks/useFirestoreCollection";
import { AuthScreen } from "./components/AuthScreen";
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
  const { user, loading } = useAuth();
  const uid = user?.uid;

  const { items: expenses, add: addExpense, remove: deleteExpense } =
    useFirestoreCollection<Expense>(uid, "expenses");
  const { items: incomes, add: addIncome, remove: deleteIncome } =
    useFirestoreCollection<Income>(uid, "incomes");
  const { items: subscriptions, add: addSubscription, remove: deleteSubscription } =
    useFirestoreCollection<Subscription>(uid, "subscriptions");

  const [tab, setTab] = useState<Tab>("dashboard");

  if (loading) {
    return null;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-row">
          <span className="user-email">{user.email}</span>
          <button type="button" className="btn-signout" onClick={() => signOut(auth)}>
            Esci
          </button>
        </div>
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
