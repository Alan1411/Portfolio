// Verschiedene Berechnungen: Uptime, SLA, Speichereinheiten

export interface UptimeAllowedDowntime {
  perDay: string;
  perWeek: string;
  perMonth: string;
  perYear: string;
}

function secondsToReadable(totalSeconds: number): string {
  if (totalSeconds < 1) return "< 1 Sek.";
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const parts = [];
  if (d) parts.push(`${d}T`);
  if (h) parts.push(`${h}Std`);
  if (m) parts.push(`${m}Min`);
  if (s && !d) parts.push(`${s}Sek`);
  return parts.join(" ") || "0 Sek.";
}

// Erlaubte Ausfallzeit aus einem Uptime-Prozentsatz (z.B. 99.9%)
export function calculateAllowedDowntime(uptimePercent: number): UptimeAllowedDowntime {
  const downFraction = 1 - uptimePercent / 100;
  return {
    perDay: secondsToReadable(downFraction * 86400),
    perWeek: secondsToReadable(downFraction * 86400 * 7),
    perMonth: secondsToReadable(downFraction * 86400 * 30.44),
    perYear: secondsToReadable(downFraction * 86400 * 365.25),
  };
}

// Tatsächlicher Uptime-Prozentsatz aus gemessener Downtime (in Minuten) über einen Zeitraum (in Tagen)
export function calculateUptimeFromDowntime(downtimeMinutes: number, periodDays: number): number {
  const periodMinutes = periodDays * 24 * 60;
  return Math.max(0, (1 - downtimeMinutes / periodMinutes) * 100);
}

// SLA-Rechner: Deadline aus Eingangszeitpunkt + SLA-Stunden. Optional nur Geschäftszeiten (Mo–Fr, 8–17 Uhr)
export function calculateSlaDeadline(startIso: string, slaHours: number, businessHoursOnly: boolean): Date {
  let current = new Date(startIso);
  if (!businessHoursOnly) {
    current.setHours(current.getHours() + slaHours);
    return current;
  }

  const BUSINESS_START = 8;
  const BUSINESS_END = 17;
  let remainingMinutes = slaHours * 60;

  // Falls Start außerhalb der Geschäftszeit liegt, auf nächsten Geschäftszeit-Beginn springen
  const advanceToBusinessStart = (date: Date) => {
    while (date.getDay() === 0 || date.getDay() === 6 || date.getHours() >= BUSINESS_END) {
      date.setDate(date.getDate() + 1);
      date.setHours(BUSINESS_START, 0, 0, 0);
    }
    if (date.getHours() < BUSINESS_START) date.setHours(BUSINESS_START, 0, 0, 0);
  };

  advanceToBusinessStart(current);

  while (remainingMinutes > 0) {
    const minutesLeftToday = (BUSINESS_END - current.getHours()) * 60 - current.getMinutes();
    if (remainingMinutes <= minutesLeftToday) {
      current = new Date(current.getTime() + remainingMinutes * 60000);
      remainingMinutes = 0;
    } else {
      remainingMinutes -= minutesLeftToday;
      current.setDate(current.getDate() + 1);
      current.setHours(BUSINESS_START, 0, 0, 0);
      advanceToBusinessStart(current);
    }
  }

  return current;
}

// Speichereinheiten-Konverter: dezimal (GB, MB, TB = 1000er) vs. binär (GiB, MiB, TiB = 1024er)
export type StorageUnit = "B" | "KB" | "MB" | "GB" | "TB" | "KiB" | "MiB" | "GiB" | "TiB";

const STORAGE_FACTORS: Record<StorageUnit, number> = {
  B: 1,
  KB: 1e3,
  MB: 1e6,
  GB: 1e9,
  TB: 1e12,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
};

export function convertStorageUnit(value: number, from: StorageUnit): Record<StorageUnit, number> {
  const bytes = value * STORAGE_FACTORS[from];
  const result = {} as Record<StorageUnit, number>;
  (Object.keys(STORAGE_FACTORS) as StorageUnit[]).forEach((unit) => {
    result[unit] = bytes / STORAGE_FACTORS[unit];
  });
  return result;
}
