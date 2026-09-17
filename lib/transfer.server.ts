// Server-Seite des File-Transfers: Ablage auf der lokalen Platte + Metadaten in
// Supabase. Darf NICHT aus Client-Komponenten importiert werden.

import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface TransferRow {
  id: string;
  slug: string;
  upload_token: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  status: "pending" | "ready";
  downloads: number;
  max_downloads: number | null;
  expires_at: string;
  created_at: string;
}

export function getSupabase(): SupabaseClient {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

/**
 * Wurzelverzeichnis für die Dateien. Auf dem Server per TRANSFER_STORAGE_DIR auf
 * ein persistentes Volume zeigen lassen (z.B. /var/lib/chicoweb/transfers) —
 * der Fallback liegt im Projektordner und überlebt einen Neu-Deploy nicht.
 */
export function storageRoot(): string {
  return process.env.TRANSFER_STORAGE_DIR || path.join(process.cwd(), ".data", "transfers");
}

/**
 * Relativen Pfad aus der DB in einen absoluten auflösen und sicherstellen, dass
 * er das Wurzelverzeichnis nicht verlässt (Schutz vor "../"-Tricks, falls je
 * ein manipulierter Wert in der Spalte landet).
 */
export function resolveStoragePath(relativePath: string): string {
  const root = path.resolve(storageRoot());
  const full = path.resolve(root, relativePath);
  if (full !== root && !full.startsWith(root + path.sep)) {
    throw new Error("Ungültiger Speicherpfad");
  }
  return full;
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/** IP des Clients — hinter nginx steht die echte IP im Forwarded-Header. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * IPs werden nur gehasht gespeichert: fürs Rate-Limit reicht ein Vergleichswert,
 * die rohe Adresse muss dafür nicht in der Datenbank liegen.
 */
export function hashIp(ip: string): string {
  const salt = process.env.SUPABASE_SECRET_KEY || "chicoweb";
  return crypto.createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export function isExpired(row: Pick<TransferRow, "expires_at">): boolean {
  return new Date(row.expires_at).getTime() <= Date.now();
}

export function downloadsExhausted(
  row: Pick<TransferRow, "downloads" | "max_downloads">
): boolean {
  return !!row.max_downloads && row.downloads >= row.max_downloads;
}

/** Datei + zugehöriges Slug-Verzeichnis entfernen (Fehler bewusst ignorieren). */
export async function removeStoredFile(relativePath: string): Promise<void> {
  try {
    const full = resolveStoragePath(relativePath);
    await fs.rm(full, { force: true });
    const dir = path.dirname(full);
    if (dir !== path.resolve(storageRoot())) {
      await fs.rm(dir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error("[TRANSFER] Datei konnte nicht gelöscht werden:", err);
  }
}

/** Datei von der Platte und Zeile aus der DB entfernen. */
export async function purgeTransfer(
  supabase: SupabaseClient,
  row: Pick<TransferRow, "id" | "storage_path">
): Promise<void> {
  await removeStoredFile(row.storage_path);
  await supabase.from("file_transfers").delete().eq("id", row.id);
}

/**
 * Abgelaufene Transfers und liegengebliebene Upload-Leichen aufräumen.
 * Wird vom Cleanup-Endpunkt (Cron) und nebenbei beim Seitenaufruf genutzt.
 */
export async function cleanupExpired(limit = 200): Promise<number> {
  const supabase = getSupabase();
  // Angefangene, nie abgeschlossene Uploads nach 6 Stunden ebenfalls wegräumen.
  const staleCutoff = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("file_transfers")
    .select("id, storage_path, status, created_at, expires_at")
    .or(`expires_at.lte.${new Date().toISOString()},and(status.eq.pending,created_at.lte.${staleCutoff})`)
    .limit(limit);

  if (!data?.length) return 0;

  for (const row of data) {
    await purgeTransfer(supabase, row as TransferRow);
  }
  return data.length;
}
