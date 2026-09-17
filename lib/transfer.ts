// Gemeinsame Konstanten/Helfer für den File-Transfer.
// Wird von Client- UND Server-Code importiert -> bewusst ohne Node-Imports
// (crypto.getRandomValues gibt es in Browser und Node >= 18 global).
// Alles, was Dateisystem oder Supabase braucht, steht in lib/transfer.server.ts.

/** Maximale Größe einer einzelnen Datei. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

/**
 * Der Upload wird in Häppchen dieser Größe geschickt. Dadurch bleibt jeder
 * einzelne HTTP-Request klein (nginx client_max_body_size / Timeouts bleiben
 * entspannt) und der Fortschrittsbalken ist genau.
 */
export const CHUNK_SIZE = 8 * 1024 * 1024; // 8 MB

/** Rate-Limit pro IP und Stunde — ohne Login der einzige Missbrauchsschutz. */
export const UPLOADS_PER_IP_PER_HOUR = 20;

export type ExpiryKey = "1h" | "1d" | "7d" | "30d";

export const EXPIRY_OPTIONS: { key: ExpiryKey; label: string; seconds: number }[] = [
  { key: "1h", label: "1 Stunde", seconds: 60 * 60 },
  { key: "1d", label: "1 Tag", seconds: 24 * 60 * 60 },
  { key: "7d", label: "7 Tage", seconds: 7 * 24 * 60 * 60 },
  { key: "30d", label: "30 Tage", seconds: 30 * 24 * 60 * 60 },
];

export const DEFAULT_EXPIRY: ExpiryKey = "7d";

export const DOWNLOAD_LIMIT_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "Unbegrenzt" },
  { value: 1, label: "1 Download (Einmal-Link)" },
  { value: 5, label: "5 Downloads" },
  { value: 25, label: "25 Downloads" },
];

export function expirySeconds(key: string | undefined): number {
  const option = EXPIRY_OPTIONS.find((o) => o.key === key);
  return (option || EXPIRY_OPTIONS.find((o) => o.key === DEFAULT_EXPIRY)!).seconds;
}

// Ohne 0/1/l/o: Slugs werden auch mal abgetippt oder vorgelesen.
const SLUG_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

export function generateSlug(length = 10): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return slug;
}

export function randomToken(bytes = 24): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let hex = "";
  for (let i = 0; i < buf.length; i++) hex += buf[i].toString(16).padStart(2, "0");
  return hex;
}

/** Dateinamen für den Storage-Pfad entschärfen (Pfad-Traversal, Unicode-Kram). */
export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() || "datei";
  const safe = base
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 100);
  return safe || "datei";
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

export function formatExpiry(expiresAt: string): string {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "abgelaufen";
  const hours = Math.round(diffMs / (60 * 60 * 1000));
  if (hours < 1) return "in weniger als 1 Stunde";
  if (hours < 48) return `in ${hours} Stunde${hours === 1 ? "" : "n"}`;
  return `in ${Math.round(hours / 24)} Tagen`;
}
