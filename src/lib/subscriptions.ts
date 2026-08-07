import type { BillingCycle, Subscription } from "../types";

const WEEKS_PER_MONTH = 52 / 12;

export function monthlyEquivalent(sub: Pick<Subscription, "amount" | "billingCycle">): number {
  switch (sub.billingCycle) {
    case "Settimanale":
      return sub.amount * WEEKS_PER_MONTH;
    case "Annuale":
      return sub.amount / 12;
    case "Mensile":
    default:
      return sub.amount;
  }
}

export function totalMonthlyCost(subs: Subscription[]): number {
  return subs.reduce((sum, sub) => sum + monthlyEquivalent(sub), 0);
}

export function daysUntil(dateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateIso + "T00:00:00");
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * If a subscription's stored renewal date has already passed, advances it forward
 * by whole billing cycles so the UI always shows the next upcoming renewal,
 * without requiring the user to manually bump the date after every payment.
 */
export function nextUpcomingRenewal(dateIso: string, cycle: BillingCycle): string {
  let date = new Date(dateIso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let guard = 0;
  while (date.getTime() < today.getTime() && guard < 1000) {
    date = advanceByCycle(date, cycle);
    guard++;
  }
  return date.toISOString().slice(0, 10);
}

function advanceByCycle(date: Date, cycle: BillingCycle): Date {
  const next = new Date(date);
  switch (cycle) {
    case "Settimanale":
      next.setDate(next.getDate() + 7);
      break;
    case "Annuale":
      next.setFullYear(next.getFullYear() + 1);
      break;
    case "Mensile":
    default:
      next.setMonth(next.getMonth() + 1);
      break;
  }
  return next;
}

export function upcomingRenewals(subs: Subscription[], withinDays: number): Array<Subscription & { daysLeft: number; effectiveRenewal: string }> {
  return subs
    .map((sub) => {
      const effectiveRenewal = nextUpcomingRenewal(sub.nextRenewal, sub.billingCycle);
      return { ...sub, effectiveRenewal, daysLeft: daysUntil(effectiveRenewal) };
    })
    .filter((sub) => sub.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
