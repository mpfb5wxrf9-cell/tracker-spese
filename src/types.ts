export type Category =
  | "Alimentari"
  | "Ristoranti"
  | "Trasporti"
  | "Casa e Bollette"
  | "Salute"
  | "Svago"
  | "Shopping"
  | "Abbonamenti"
  | "Istruzione"
  | "Viaggi"
  | "Altro";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // ISO yyyy-MM-dd
  createdAt: string; // ISO datetime
}

export type BillingCycle = "Settimanale" | "Mensile" | "Annuale";

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextRenewal: string; // ISO yyyy-MM-dd
  category: Category;
  notes?: string;
}
