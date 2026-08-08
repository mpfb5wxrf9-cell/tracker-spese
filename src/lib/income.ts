import type { IncomeCategory } from "../types";

export const INCOME_CATEGORIES: IncomeCategory[] = [
  "Stipendio",
  "Freelance",
  "Regalo",
  "Rimborso",
  "Investimenti",
  "Altro",
];

export const INCOME_CATEGORY_COLORS: Record<IncomeCategory, string> = {
  Stipendio: "#4caf7d",
  Freelance: "#4a90d9",
  Regalo: "#d65fa0",
  Rimborso: "#e0c14c",
  Investimenti: "#9b6bd6",
  Altro: "#9aa3ad",
};

const KEYWORD_RULES: Array<{ category: IncomeCategory; keywords: string[] }> = [
  { category: "Stipendio", keywords: ["stipendio", "salario", "busta paga", "tredicesima", "quattordicesima"] },
  { category: "Freelance", keywords: ["fattura", "consulenza", "progetto", "cliente", "freelance", "partita iva"] },
  { category: "Regalo", keywords: ["regalo", "regalata", "regalato"] },
  { category: "Rimborso", keywords: ["rimborso", "restituzione", "cashback"] },
  { category: "Investimenti", keywords: ["dividendo", "interessi", "investimento", "azioni", "etf", "cedola"] },
];

/**
 * Guesses an income category from a free-text description using keyword matching.
 * Falls back to "Altro" when no rule matches.
 */
export function categorizeIncomeDescription(description: string): IncomeCategory {
  const text = description.toLowerCase().trim();
  if (!text) return "Altro";

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.category;
    }
  }

  return "Altro";
}
