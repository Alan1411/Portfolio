// Cron-Ausdruck <-> Klartext (5 Felder: Minute Stunde Tag Monat Wochentag)

const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function describeField(field: string, unit: string, names?: string[]): string {
  if (field === "*") return `jede${unit === "Minute" || unit === "Stunde" ? "" : "n"} ${unit}`;

  if (field.includes("/")) {
    const [range, step] = field.split("/");
    const base = range === "*" ? `jede${unit === "Minute" || unit === "Stunde" ? "" : "n"} ${unit}` : describeField(range, unit, names);
    return `alle ${step} ${unit}(n), beginnend bei ${range === "*" ? "0" : range}`;
  }

  if (field.includes(",")) {
    const parts = field.split(",").map((p) => (names ? names[Number(p)] ?? p : p));
    return `${unit} ${parts.join(", ")}`;
  }

  if (field.includes("-")) {
    const [from, to] = field.split("-");
    const fromLabel = names ? names[Number(from)] ?? from : from;
    const toLabel = names ? names[Number(to)] ?? to : to;
    return `${unit} ${fromLabel} bis ${toLabel}`;
  }

  const label = names ? names[Number(field)] ?? field : field;
  return `${unit} ${label}`;
}

export function explainCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error("Cron-Ausdruck muss aus 5 Feldern bestehen: Minute Stunde Tag Monat Wochentag");
  }
  const [minute, hour, day, month, weekday] = parts;

  // Häufiger Sonderfall: jede Minute
  if ([minute, hour, day, month, weekday].every((f) => f === "*")) {
    return "Läuft jede Minute.";
  }

  const segments: string[] = [];

  if (minute !== "*" && hour !== "*" && !minute.includes("/") && !hour.includes("/")) {
    segments.push(`um ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} Uhr`);
  } else {
    segments.push(describeField(minute, "Minute"));
    segments.push(describeField(hour, "Stunde"));
  }

  if (day !== "*") segments.push(describeField(day, "Tag"));
  if (month !== "*") segments.push(describeField(month, "Monat", ["", ...MONTHS]));
  if (weekday !== "*") segments.push(describeField(weekday, "Wochentag", WEEKDAYS));

  return `Läuft ${segments.join(", ")}.`;
}

export interface CronBuilderOptions {
  minute: string;
  hour: string;
  day: string;
  month: string;
  weekday: string;
}

export function buildCron(opts: CronBuilderOptions): string {
  return `${opts.minute} ${opts.hour} ${opts.day} ${opts.month} ${opts.weekday}`;
}
