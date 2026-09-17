import { NextResponse } from "next/server";
import crypto from "crypto";
import { stat } from "fs/promises";
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

async function loadRow(slug: string, token: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("file_transfers")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .single();

  const row = data as TransferRow | null;
  if (!row || !tokenMatches(token, row.upload_token)) return { supabase, row: null };
  return { supabase, row };
}

// POST /api/transfer/[slug]/complete — Upload abschließen.
// Die tatsächliche Dateigröße kommt von der Platte, nicht vom Client, und erst
// danach wird der Transfer auf "ready" gesetzt und der Link nutzbar.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { supabase, row } = await loadRow(slug, request.headers.get("x-upload-token") || "");

    if (!row) {
      return NextResponse.json({ error: "Upload nicht gefunden" }, { status: 404 });
    }
    if (isExpired(row)) {
      await purgeTransfer(supabase, row);
      return NextResponse.json({ error: "Upload ist abgelaufen" }, { status: 410 });
    }

    const size = await stat(resolveStoragePath(row.storage_path))
      .then((s) => s.size)
      .catch(() => 0);

    if (size <= 0) {
      await purgeTransfer(supabase, row);
      return NextResponse.json({ error: "Es sind keine Daten angekommen" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("file_transfers")
      .update({ status: "ready", file_size: size })
      .eq("id", row.id)
      .select("slug, file_name, file_size, expires_at, max_downloads")
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[TRANSFER] complete:", err?.message);
    return NextResponse.json({ error: "Upload konnte nicht abgeschlossen werden" }, { status: 500 });
  }
}

// DELETE /api/transfer/[slug] ist bewusst hier mit abgebildet: wer das
// Upload-Token hat (also der Uploader im selben Tab), darf den Link sofort
// wieder zurückziehen, ohne auf das Ablaufdatum zu warten.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { supabase, row } = await loadRow(slug, request.headers.get("x-upload-token") || "");

    if (!row) {
      return NextResponse.json({ error: "Upload nicht gefunden" }, { status: 404 });
    }

    await purgeTransfer(supabase, row);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[TRANSFER] delete:", err?.message);
    return NextResponse.json({ error: "Löschen fehlgeschlagen" }, { status: 500 });
  }
}
