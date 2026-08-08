const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Indirizzo email non valido.",
  "auth/user-disabled": "Questo account è stato disabilitato.",
  "auth/user-not-found": "Nessun account trovato con questa email.",
  "auth/wrong-password": "Password errata.",
  "auth/invalid-credential": "Email o password errati.",
  "auth/email-already-in-use": "Esiste già un account con questa email.",
  "auth/weak-password": "La password deve avere almeno 6 caratteri.",
  "auth/popup-closed-by-user": "Accesso con Google annullato.",
  "auth/network-request-failed": "Errore di rete. Controlla la connessione.",
  "auth/too-many-requests": "Troppi tentativi. Riprova tra qualche minuto.",
};

export function authErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    if (MESSAGES[code]) return MESSAGES[code];
  }
  return "Si è verificato un errore. Riprova.";
}
