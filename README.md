# Tracker Spese

App web per tenere traccia delle spese personali, con categorizzazione automatica, grafici mensili e un monitor abbonamenti.

## Funzionalità

- **Registrazione spese**: descrizione, importo, data e categoria.
- **Categorizzazione automatica**: la categoria viene suggerita analizzando la descrizione (es. "Conad" → Alimentari, "Netflix" → Abbonamenti); resta comunque modificabile manualmente.
- **Grafici mensili**: andamento della spesa totale negli ultimi mesi e ripartizione per categoria del mese selezionato.
- **Monitor abbonamenti**: elenco abbonamenti con frequenza di rinnovo (settimanale/mensile/annuale), calcolo del costo mensile equivalente totale e avviso per i rinnovi imminenti (finestra configurabile).
- **Persistenza locale**: i dati sono salvati nel `localStorage` del browser, nessun backend richiesto.

## Sviluppo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Stack

React + TypeScript + Vite, grafici con [Recharts](https://recharts.org/).
