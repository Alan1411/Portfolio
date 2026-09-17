import { NextResponse } from "next/server";
import crypto from "crypto";
import { cleanupExpired } from "@/lib/transfer.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET|POST /api/transfer/cleanup — abgelaufene Transfers und abgebrochene
// Uploads von der Platte räumen. Gedacht für einen Cron/systemd-Timer auf dem
// Server, z.B.:
//   */30 * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" \
//                  https://chicoweb.de/api/transfer/cleanup
async function handle(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET ist nicht gesetzt" },
      { status: 503 }
    );
  }

  const provided = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const removed = await cleanupExpired();
  return NextResponse.json({ removed });
}

export const GET = handle;
export const POST = handle;
