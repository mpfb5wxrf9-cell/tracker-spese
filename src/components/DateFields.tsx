const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

interface Props {
  value: string; // yyyy-MM-dd
  onChange: (value: string) => void;
}

function toIso(day: number, month: number, year: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export function DateFields({ value, onChange }: Props) {
  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const days = Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  function handleDay(newDay: number) {
    onChange(toIso(newDay, month, year));
  }

  function handleMonth(newMonth: number) {
    const clampedDay = Math.min(day, daysInMonth(newMonth, year));
    onChange(toIso(clampedDay, newMonth, year));
  }

  function handleYear(newYear: number) {
    const clampedDay = Math.min(day, daysInMonth(month, newYear));
    onChange(toIso(clampedDay, month, newYear));
  }

  return (
    <div className="date-fields">
      <select
        aria-label="Giorno"
        value={day}
        onChange={(e) => handleDay(Number(e.target.value))}
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        aria-label="Mese"
        value={month}
        onChange={(e) => handleMonth(Number(e.target.value))}
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>
      <select
        aria-label="Anno"
        value={year}
        onChange={(e) => handleYear(Number(e.target.value))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
