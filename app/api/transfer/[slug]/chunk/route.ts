import { NextResponse } from "next/server";
import crypto from "crypto";
import { appendFile, stat } from "fs/promises";
import { CHUNK_SIZE, MAX_UPLOAD_BYTES, formatBytes } from "@/lib/transfer";
import {
  getSupabase,
  isExpired,
  purgeTransfer,
  resolveStoragePath,
  type TransferRow,
} from "@/lib/transfer.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenMatches(a: string, b: string): boolean {
  const bufA = Buffer.from(a || "");
  const bufB = Buffer.from(b || "");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/transfer/[slug]/chunk — ein Häppchen an die Datei anhängen.
// Der Client schickt die Chunks streng der Reihe nach und nennt im Header den
// Offset, an dem er gerade steht; stimmt der nicht mit der Datei auf der Platte
// überein, wird abgelehnt statt eine kaputte Datei zusammenzukleben.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = request.headers.get("x-upload-token") || "";
    const offset = Number(request.headers.get("x-chunk-offset"));

    if (!Number.isFinite(offset) || offset < 0) {
      return NextResponse.json({ error: "Ungültiger Offset" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data } = await supabase
      .from("file_transfers")
      .select("*")
      .eq("slug", slug.toLowerCase())
      .single();

    const row = data as TransferRow | null;
    if (!row || !tokenMatches(token, row.upload_token)) {
      return NextResponse.json({ error: "Upload nicht gefunden" }, { status: 404 });
    }
    if (row.status !== "pending") {
      return NextResponse.json({ error: "Upload ist bereits abgeschlossen" }, { status: 409 });
    }
    if (isExpired(row)) {
      await purgeTransfer(supabase, row);
      return NextResponse.json({ error: "Upload ist abgelaufen" }, { status: 410 });
    }

    const buffer = Buffer.from(await request.arrayBuffer());
    if (buffer.length === 0) {
      return NextResponse.json({ error: "Leeres Häppchen" }, { status: 400 });
    }
    if (buffer.length > CHUNK_SIZE * 2) {
      return NextResponse.json({ error: "Häppchen zu groß" }, { status: 413 });
    }

    const fullPath = resolveStoragePath(row.storage_path);
    const current = await stat(fullPath).then((s) => s.size).catch(() => -1);
    if (current < 0) {
      await purgeTransfer(supabase, row);
      return NextResponse.json({ error: "Upload nicht gefunden" }, { status: 404 });
    }
    if (current !== offset) {
      // Client und Server sind auseinandergelaufen (Retry, Doppel-Request).
      // Der echte Stand geht zurück, damit der Client dort weitermachen kann.
      return NextResponse.json(
        { error: "Offset passt nicht", offset: current },
        { status: 409 }
      );
    }
    if (current + buffer.length > MAX_UPLOAD_BYTES) {
      await purgeTransfer(supabase, row);
      return NextResponse.json(
        { error: `Datei ist zu groß (max. ${formatBytes(MAX_UPLOAD_BYTES)})` },
        { status: 413 }
      );
    }

    await appendFile(fullPath, buffer);

    return NextResponse.json({ offset: current + buffer.length });
  } catch (err: any) {
    console.error("[TRANSFER] chunk:", err?.message);
    return NextResponse.json({ error: "Häppchen konnte nicht gespeichert werden" }, { status: 500 });
  }
}
