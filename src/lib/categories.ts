import type { Category } from "../types";

export const CATEGORIES: Category[] = [
  "Alimentari",
  "Ristoranti",
  "Trasporti",
  "Casa e Bollette",
  "Salute",
  "Svago",
  "Shopping",
  "Abbonamenti",
  "Istruzione",
  "Viaggi",
  "Altro",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Alimentari: "#4caf7d",
  Ristoranti: "#f2994a",
  Trasporti: "#4a90d9",
  "Casa e Bollette": "#9b6bd6",
  Salute: "#e05d5d",
  Svago: "#e0c14c",
  Shopping: "#d65fa0",
  Abbonamenti: "#3fb8c9",
  Istruzione: "#7c8cf0",
  Viaggi: "#5fc3e4",
  Altro: "#9aa3ad",
};

// Keyword -> category map used for automatic categorization.
// Matching is case-insensitive and looks for the keyword anywhere in the description.
const KEYWORD_RULES: Array<{ category: Category; keywords: string[] }> = [
  {
    category: "Alimentari",
    keywords: [
      "supermercato", "spesa", "conad", "coop", "esselunga", "carrefour",
      "lidl", "eurospin", "pam", "despar", "iper", "market", "alimentari",
      "macelleria", "panetteria", "frutta", "verdura",
    ],
  },
  {
    category: "Ristoranti",
    keywords: [
      "ristorante", "pizzeria", "bar", "caffe", "caffè", "trattoria",
      "sushi", "mcdonald", "burger", "kebab", "gelateria", "pub",
      "aperitivo", "cena", "pranzo", "deliveroo", "glovo", "just eat",
      "justeat", "uber eats",
    ],
  },
  {
    category: "Trasporti",
    keywords: [
      "benzina", "carburante", "esso", "eni", "q8", "autostrada",
      "telepass", "treno", "trenitalia", "italo", "atm", "atac", "gtt",
      "bus", "metro", "taxi", "uber", "parcheggio", "parking", "car sharing",
      "noleggio auto", "bici",
    ],
  },
  {
    category: "Casa e Bollette",
    keywords: [
      "affitto", "mutuo", "condominio", "enel", "eni gas", "a2a", "hera",
      "iren", "acea", "bolletta", "luce", "gas", "acqua", "internet",
      "fibra", "tim", "vodafone", "wind", "iliad", "fastweb", "spazzatura",
      "tari", "imu",
    ],
  },
  {
    category: "Salute",
    keywords: [
      "farmacia", "medico", "dottore", "dentista", "visita", "analisi",
      "ospedale", "clinica", "fisioterapia", "psicologo", "ottico",
      "occhiali", "assicurazione sanitaria",
    ],
  },
  {
    category: "Svago",
    keywords: [
      "cinema", "teatro", "concerto", "museo", "biglietti", "evento",
      "sport", "palestra", "piscina", "videogioch", "steam", "playstation",
      "xbox", "libro", "libreria",
    ],
  },
  {
    category: "Shopping",
    keywords: [
      "amazon", "zalando", "abbigliamento", "scarpe", "negozio",
      "centro commerciale", "elettronica", "mediaworld", "unieuro",
      "ikea", "regalo",
    ],
  },
  {
    category: "Abbonamenti",
    keywords: [
      "netflix", "spotify", "disney", "prime video", "youtube premium",
      "abbonamento", "subscription", "icloud", "google one", "dropbox",
      "playstation plus", "xbox game pass", "apple music", "nintendo",
      "hbo", "paramount", "dazn", "sky",
    ],
  },
  {
    category: "Istruzione",
    keywords: [
      "universita", "università", "corso", "scuola", "libri scolastici",
      "retta", "master", "esame", "iscrizione",
    ],
  },
  {
    category: "Viaggi",
    keywords: [
      "hotel", "volo", "aereo", "booking", "airbnb", "ryanair", "easyjet",
      "vacanza", "viaggio", "valigia", "resort", "trenitalia internazionale",
    ],
  },
];

/**
 * Guesses a category from a free-text expense description using keyword matching.
 * Falls back to "Altro" when no rule matches.
 */
export function categorizeDescription(description: string): Category {
  const text = description.toLowerCase().trim();
  if (!text) return "Altro";

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.category;
    }
  }

  return "Altro";
}
