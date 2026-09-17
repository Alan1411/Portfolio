import { NextResponse } from "next/server";
import path from "path";
import {
  MAX_UPLOAD_BYTES,
  UPLOADS_PER_IP_PER_HOUR,
  expirySeconds,
  generateSlug,
  randomToken,
  sanitizeFileName,
  formatBytes,
} from "@/lib/transfer";
import {
  clientIp,
  ensureDir,
  getSupabase,
  hashIp,
  resolveStoragePath,
  storageRoot,
} from "@/lib/transfer.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/transfer — Upload anmelden.
// Legt die Metadatenzeile (status: pending) und die leere Zieldatei an und gibt
// den Slug plus ein Upload-Token zurück. Die Bytes kommen danach in Häppchen
// über /api/transfer/[slug]/chunk.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
    const fileSize = Number(body.fileSize);
    const mimeType =
      typeof body.mimeType === "string" && body.mimeType
        ? body.mimeType.slice(0, 120)
        : "application/octet-stream";
    const maxDownloads = Number(body.maxDownloads) > 0 ? Math.floor(Number(body.maxDownloads)) : null;

    if (!fileName) {
      return NextResponse.json({ error: "Dateiname fehlt" }, { status: 400 });
    }
    if (!Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json({ error: "Leere Dateien können nicht geteilt werden" }, { status: 400 });
    }
    if (fileSize > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `Datei ist zu groß (max. ${formatBytes(MAX_UPLOAD_BYTES)})` },
        { status: 413 }
      );
    }

    const supabase = getSupabase();
    const ipHash = hashIp(clientIp(request));

    // Rate-Limit: ohne Login ist das die einzige Bremse gegen Massen-Uploads.
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("file_transfers")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", hourAgo);

    if ((count || 0) >= UPLOADS_PER_IP_PER_HOUR) {
      return NextResponse.json(
        { error: "Zu viele Uploads in der letzten Stunde. Bitte später erneut versuchen." },
        { status: 429 }
      );
    }

    const safeName = sanitizeFileName(fileName);
    const expiresAt = new Date(Date.now() + expirySeconds(body.expiry) * 1000).toISOString();
    const uploadToken = randomToken();

    // Slug-Kollisionen sind bei 32^10 praktisch ausgeschlossen, der Unique-Index
    // fängt den Rest ab — deshalb einfach ein paar Versuche.
    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = generateSlug();
      const storagePath = `${slug}/${safeName}`;

      const { data, error } = await supabase
        .from("file_transfers")
        .insert({
          slug,
          upload_token: uploadToken,
          storage_path: storagePath,
          file_name: safeName,
          file_size: 0,
          mime_type: mimeType,
          status: "pending",
          max_downloads: maxDownloads,
          ip_hash: ipHash,
          expires_at: expiresAt,
        })
        .select("slug, expires_at")
        .single();

      if (error) continue;

      const fullPath = resolveStoragePath(storagePath);
      await ensureDir(path.dirname(fullPath));
      const { writeFile } = await import("fs/promises");
      await writeFile(fullPath, new Uint8Array(0));

      return NextResponse.json(
        { slug: data.slug, uploadToken, expiresAt: data.expires_at, fileName: safeName },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Upload konnte nicht angelegt werden" }, { status: 500 });
  } catch (err: any) {
    console.error("[TRANSFER] create:", err?.message, "storageRoot:", storageRoot());
    return NextResponse.json({ error: "Upload konnte nicht angelegt werden" }, { status: 500 });
  }
}
