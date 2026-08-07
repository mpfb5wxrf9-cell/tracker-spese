import { useMemo, useState } from "react";
import type { Subscription } from "../types";
import { formatCurrency, formatDate } from "../lib/format";
import { monthlyEquivalent, nextUpcomingRenewal, daysUntil, totalMonthlyCost } from "../lib/subscriptions";

interface Props {
  subscriptions: Subscription[];
  onDelete: (id: string) => void;
}

const ALERT_WINDOW_OPTIONS = [3, 7, 14, 30];

export function SubscriptionMonitor({ subscriptions, onDelete }: Props) {
  const [alertWindow, setAlertWindow] = useState(7);

  const enriched = useMemo(() => {
    return subscriptions
      .map((sub) => {
        const effectiveRenewal = nextUpcomingRenewal(sub.nextRenewal, sub.billingCycle);
        return {
          ...sub,
          effectiveRenewal,
          daysLeft: daysUntil(effectiveRenewal),
          monthly: monthlyEquivalent(sub),
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [subscriptions]);

  const monthlyTotal = useMemo(() => totalMonthlyCost(subscriptions), [subscriptions]);
  const imminent = enriched.filter((sub) => sub.daysLeft <= alertWindow);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Monitor abbonamenti</h2>
      </div>

      <div className="stat-row">
        <div className="stat-box">
          <span className="stat-label">Costo mensile totale</span>
          <span className="stat-value">{formatCurrency(monthlyTotal)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Abbonamenti attivi</span>
          <span className="stat-value">{subscriptions.length}</span>
        </div>
      </div>

      <div className="alert-window">
        <span>Segnala rinnovi entro</span>
        <select value={alertWindow} onChange={(e) => setAlertWindow(Number(e.target.value))}>
          {ALERT_WINDOW_OPTIONS.map((days) => (
            <option key={days} value={days}>
              {days} giorni
            </option>
          ))}
        </select>
      </div>

      {imminent.length > 0 && (
        <div className="alert-banner">
          {imminent.length === 1
            ? "1 rinnovo imminente"
            : `${imminent.length} rinnovi imminenti`}
          : {imminent.map((s) => s.name).join(", ")}
        </div>
      )}

      {subscriptions.length === 0 ? (
        <p className="empty-state">Nessun abbonamento registrato.</p>
      ) : (
        <ul className="subscription-list">
          {enriched.map((sub) => (
            <li key={sub.id} className={`subscription-item ${sub.daysLeft <= alertWindow ? "is-imminent" : ""}`}>
              <div className="subscription-info">
                <span className="subscription-name">{sub.name}</span>
                <span className="expense-meta">
                  {sub.category} · {sub.billingCycle} · {formatCurrency(sub.amount)}
                </span>
              </div>
              <div className="subscription-renewal">
                <span className="renewal-date">{formatDate(sub.effectiveRenewal)}</span>
                <span className={`renewal-badge ${sub.daysLeft <= alertWindow ? "badge-warning" : ""}`}>
                  {sub.daysLeft < 0
                    ? "Scaduto"
                    : sub.daysLeft === 0
                      ? "Oggi"
                      : `tra ${sub.daysLeft} giorni`}
                </span>
              </div>
              <span className="expense-amount">{formatCurrency(sub.monthly)}/mese</span>
              <button
                type="button"
                className="btn-icon"
                aria-label="Elimina abbonamento"
                onClick={() => onDelete(sub.id)}
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
