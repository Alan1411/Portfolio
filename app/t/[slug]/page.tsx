import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileDown } from "lucide-react";
import { formatBytes, formatExpiry } from "@/lib/transfer";
import {
  downloadsExhausted,
  getSupabase,
  isExpired,
  purgeTransfer,
  type TransferRow,
} from "@/lib/transfer.server";

export const dynamic = "force-dynamic";

// Transfer-Links gehören nicht in Suchmaschinen.
export const metadata: Metadata = {
  title: "Download — ChicoCode",
  robots: { index: false, follow: false },
};

async function getTransfer(slug: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("file_transfers")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .single();

  const row = data as TransferRow | null;
  if (!row || row.status !== "ready") return null;

  // Beim Aufruf gleich mit aufräumen — dann hängt nicht alles am Cron.
  if (isExpired(row) || downloadsExhausted(row)) {
    await purgeTransfer(supabase, row);
    return null;
  }

  return row;
}

export default async function TransferDownloadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const transfer = await getTransfer(slug);

  if (!transfer) {
    return (
      <section className="transfer-download">
        <div className="transfer-download-card">
          <h1>Link nicht verfügbar</h1>
          <p className="muted">
            Dieser Transfer ist abgelaufen, wurde gelöscht oder hat sein
            Download-Limit erreicht.
          </p>
          <Link href="/transfer" className="btn btn-primary">
            Eigene Datei teilen
          </Link>
        </div>
      </section>
    );
  }

  const remaining = transfer.max_downloads
    ? transfer.max_downloads - transfer.downloads
    : null;

  return (
    <section className="transfer-download">
      <div className="transfer-download-card">
        <FileDown size={40} aria-hidden="true" className="transfer-download-icon" />
        <h1 className="transfer-download-name">{transfer.file_name}</h1>
        <p className="muted">{formatBytes(transfer.file_size)}</p>

        <a
          href={`/api/transfer/${transfer.slug}/download`}
          className="btn btn-primary transfer-download-btn"
          download
        >
          <Download size={18} aria-hidden="true" />
          Herunterladen
        </a>

        <ul className="transfer-download-meta">
          <li>Läuft ab {formatExpiry(transfer.expires_at)}</li>
          {remaining !== null && (
            <li>
              Noch {remaining} Download{remaining === 1 ? "" : "s"} möglich
            </li>
          )}
        </ul>

        <Link href="/transfer" className="transfer-inline-link">
          Selbst eine Datei teilen →
        </Link>
      </div>
    </section>
  );
}
