"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Copy, FileUp, Link2, Trash2, X } from "lucide-react";
import {
  CHUNK_SIZE,
  DEFAULT_EXPIRY,
  DOWNLOAD_LIMIT_OPTIONS,
  EXPIRY_OPTIONS,
  MAX_UPLOAD_BYTES,
  formatBytes,
  type ExpiryKey,
} from "@/lib/transfer";

type ItemStatus = "queued" | "uploading" | "done" | "error";

interface TransferItem {
  id: string;
  name: string;
  size: number;
  status: ItemStatus;
  uploaded: number;
  slug?: string;
  token?: string;
  error?: string;
}

const MAX_CHUNK_RETRIES = 3;

async function postChunk(
  slug: string,
  token: string,
  offset: number,
  blob: Blob
): Promise<number> {
  const res = await fetch(`/api/transfer/${slug}/chunk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "x-upload-token": token,
      "x-chunk-offset": String(offset),
    },
    body: blob,
  });

  const data = await res.json().catch(() => ({}));

  // 409 = Server steht woanders als der Client (z.B. nach einem Retry, bei dem
  // das Häppchen doch angekommen war). Der Server nennt den echten Stand.
  if (res.status === 409 && typeof data.offset === "number") return data.offset;
  if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen");

  return data.offset as number;
}

export function FileTransferUploader() {
  const [items, setItems] = useState<TransferItem[]>([]);
  const [expiry, setExpiry] = useState<ExpiryKey>(DEFAULT_EXPIRY);
  const [maxDownloads, setMaxDownloads] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Uploads laufen streng nacheinander: parallele Multi-GB-Transfers bringen
  // weder Durchsatz noch einen brauchbaren Fortschrittsbalken.
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const busy = items.some((i) => i.status === "uploading" || i.status === "queued");

  const patch = useCallback((id: string, changes: Partial<TransferItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  }, []);

  const upload = useCallback(
    async (item: TransferItem, file: File) => {
      try {
        patch(item.id, { status: "uploading", uploaded: 0 });

        const createRes = await fetch("/api/transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            expiry,
            maxDownloads,
          }),
        });
        const created = await createRes.json();
        if (!createRes.ok) throw new Error(created.error || "Upload konnte nicht starten");

        const { slug, uploadToken } = created;
        patch(item.id, { slug, token: uploadToken });

        let offset = 0;
        while (offset < file.size) {
          const chunk = file.slice(offset, Math.min(offset + CHUNK_SIZE, file.size));

          let attempt = 0;
          for (;;) {
            try {
              offset = await postChunk(slug, uploadToken, offset, chunk);
              break;
            } catch (err) {
              // Netzwerkaussetzer bei großen Dateien sind normal — ein paar Mal
              // mit wachsender Pause neu versuchen, bevor aufgegeben wird.
              attempt++;
              if (attempt >= MAX_CHUNK_RETRIES) throw err;
              await new Promise((r) => setTimeout(r, 1000 * attempt));
            }
          }

          patch(item.id, { uploaded: offset });
        }

        const doneRes = await fetch(`/api/transfer/${slug}/complete`, {
          method: "POST",
          headers: { "x-upload-token": uploadToken },
        });
        const done = await doneRes.json();
        if (!doneRes.ok) throw new Error(done.error || "Abschluss fehlgeschlagen");

        patch(item.id, { status: "done", uploaded: file.size });
      } catch (err: any) {
        patch(item.id, { status: "error", error: err?.message || "Upload fehlgeschlagen" });
      }
    },
    [expiry, maxDownloads, patch]
  );

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;

      Array.from(files).forEach((file) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const item: TransferItem = {
          id,
          name: file.name,
          size: file.size,
          status: "queued",
          uploaded: 0,
        };

        if (file.size === 0) {
          item.status = "error";
          item.error = "Leere Datei";
        } else if (file.size > MAX_UPLOAD_BYTES) {
          item.status = "error";
          item.error = `Zu groß (max. ${formatBytes(MAX_UPLOAD_BYTES)})`;
        }

        setItems((prev) => [...prev, item]);
        if (item.status === "queued") {
          queueRef.current = queueRef.current.then(() => upload(item, file));
        }
      });
    },
    [upload]
  );

  const shareUrl = (slug: string) =>
    typeof window === "undefined" ? `/t/${slug}` : `${window.location.origin}/t/${slug}`;

  const copy = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl(slug));
      setCopied(slug);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* Clipboard blockiert (kein HTTPS o.ä.) — Link steht ja sichtbar da. */
    }
  };

  const revoke = async (item: TransferItem) => {
    if (item.slug && item.token) {
      await fetch(`/api/transfer/${item.slug}/complete`, {
        method: "DELETE",
        headers: { "x-upload-token": item.token },
      }).catch(() => null);
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="transfer-panel">
      <div
        className={`transfer-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <FileUp size={32} aria-hidden="true" />
        <p className="transfer-dropzone-title">Datei hierher ziehen oder klicken</p>
        <p className="transfer-dropzone-hint">
          Bis zu {formatBytes(MAX_UPLOAD_BYTES)} pro Datei · kein Login, kein Passwort
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          style={{ display: "none" }}
        />
      </div>

      <div className="transfer-options">
        <label className="transfer-field">
          <span>Link läuft ab nach</span>
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value as ExpiryKey)}
            disabled={busy}
          >
            {EXPIRY_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="transfer-field">
          <span>Download-Limit</span>
          <select
            value={maxDownloads}
            onChange={(e) => setMaxDownloads(Number(e.target.value))}
            disabled={busy}
          >
            {DOWNLOAD_LIMIT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {items.length > 0 && (
        <ul className="transfer-list">
          {items.map((item) => {
            const percent = item.size ? Math.round((item.uploaded / item.size) * 100) : 0;
            return (
              <li key={item.id} className={`transfer-item transfer-item-${item.status}`}>
                <div className="transfer-item-head">
                  <span className="transfer-item-name" title={item.name}>
                    {item.name}
                  </span>
                  <span className="transfer-item-size">{formatBytes(item.size)}</span>
                  <button
                    type="button"
                    className="transfer-item-remove"
                    onClick={() => revoke(item)}
                    aria-label={item.status === "done" ? "Link löschen" : "Entfernen"}
                    title={item.status === "done" ? "Link sofort löschen" : "Entfernen"}
                  >
                    {item.status === "done" ? <Trash2 size={16} /> : <X size={16} />}
                  </button>
                </div>

                {item.status === "uploading" && (
                  <>
                    <div className="transfer-progress">
                      <div className="transfer-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="transfer-item-meta">
                      {formatBytes(item.uploaded)} von {formatBytes(item.size)} · {percent}%
                    </p>
                  </>
                )}

                {item.status === "done" && item.slug && (
                  <div className="transfer-result">
                    <Link2 size={16} aria-hidden="true" />
                    <a href={shareUrl(item.slug)} className="transfer-link" target="_blank" rel="noopener">
                      {shareUrl(item.slug)}
                    </a>
                    <button
                      type="button"
                      className="btn btn-small btn-primary transfer-copy"
                      onClick={() => copy(item.slug!)}
                    >
                      {copied === item.slug ? <Check size={14} /> : <Copy size={14} />}
                      {copied === item.slug ? "Kopiert" : "Kopieren"}
                    </button>
                  </div>
                )}

                {item.status === "error" && <p className="transfer-item-error">{item.error}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
