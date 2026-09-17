import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import {
  downloadsExhausted,
  getSupabase,
  isExpired,
  purgeTransfer,
  resolveStoragePath,
  type TransferRow,
} from "@/lib/transfer.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function gone(message: string) {
  return NextResponse.json({ error: message }, { status: 410 });
}

// GET /api/transfer/[slug]/download — Datei ausliefern.
// Wird als Stream geschickt (große Dateien landen nie komplett im RAM) und
// unterstützt Range-Requests, damit abgebrochene Downloads fortgesetzt werden
// können.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data } = await supabase
    .from("file_transfers")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .single();

  const row = data as TransferRow | null;
  if (!row || row.status !== "ready") {
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }
  if (isExpired(row)) {
    await purgeTransfer(supabase, row);
    return gone("Dieser Link ist abgelaufen");
  }
  if (downloadsExhausted(row)) {
    await purgeTransfer(supabase, row);
    return gone("Das Download-Limit für diesen Link ist erreicht");
  }

  let fullPath: string;
  try {
    fullPath = resolveStoragePath(row.storage_path);
  } catch {
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }

  const fileStat = await stat(fullPath).catch(() => null);
  if (!fileStat) {
    await purgeTransfer(supabase, row);
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }

  const size = fileStat.size;
  const rangeHeader = request.headers.get("range");
  let start = 0;
  let end = size - 1;
  let status = 200;

  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (match) {
      if (match[1]) start = Number(match[1]);
      if (match[2]) end = Number(match[2]);
      if (!match[1] && match[2]) start = Math.max(size - Number(match[2]), 0);
      if (start >= size || end >= size || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${size}` },
        });
      }
      status = 206;
    }
  }

  // Nur den Beginn eines Downloads zählen — sonst würde jeder Range-Request
  // eines Download-Managers den Zähler hochtreiben.
  if (start === 0) {
    await supabase
      .from("file_transfers")
      .update({ downloads: row.downloads + 1 })
      .eq("id", row.id);
  }

  const stream = createReadStream(fullPath, { start, end });
  const fileName = encodeURIComponent(row.file_name);

  return new NextResponse(Readable.toWeb(stream) as unknown as ReadableStream, {
    status,
    headers: {
      // Bewusst octet-stream + attachment: so kann der Transfer nicht als
      // Hoster für HTML/SVG unter der eigenen Domain missbraucht werden.
      "Content-Type": "application/octet-stream",
      "Content-Length": String(end - start + 1),
      "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${fileName}`,
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      ...(status === 206 ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}),
    },
  });
}
