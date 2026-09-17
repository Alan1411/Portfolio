-- 013_file_transfer.sql
-- Öffentlicher File-Transfer (WeTransfer-artig): Datei hochladen, Link teilen.
-- Kein Login, kein Passwort — stattdessen: nicht erratbarer Slug, Ablaufdatum,
-- optionales Download-Limit und IP-Rate-Limit gegen Missbrauch.
--
-- Die Dateien selbst liegen NICHT in Supabase Storage, sondern auf der Platte
-- des Servers (TRANSFER_STORAGE_DIR). Hier steht nur die Metadatenzeile.

CREATE TABLE IF NOT EXISTS public.file_transfers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  -- Geheimnis, das nur der Uploader kennt: verhindert, dass Fremde einen
  -- laufenden Upload bestücken, abschließen oder löschen.
  upload_token  TEXT NOT NULL,
  -- Pfad relativ zu TRANSFER_STORAGE_DIR, z.B. "ab3kf9xz2q/urlaub.zip"
  storage_path  TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_size     BIGINT NOT NULL DEFAULT 0,
  mime_type     TEXT NOT NULL DEFAULT 'application/octet-stream',
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready')),
  downloads     INTEGER NOT NULL DEFAULT 0,
  max_downloads INTEGER,
  -- SHA-256(IP + Secret), nie die rohe IP — ausschließlich fürs Rate-Limit.
  ip_hash       TEXT,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_file_transfers_slug ON public.file_transfers (slug);
CREATE INDEX IF NOT EXISTS idx_file_transfers_expires ON public.file_transfers (expires_at);
CREATE INDEX IF NOT EXISTS idx_file_transfers_ip ON public.file_transfers (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_file_transfers_status ON public.file_transfers (status, created_at);

ALTER TABLE public.file_transfers ENABLE ROW LEVEL SECURITY;
-- Keine Policies: Zugriff ausschließlich über die API-Routen mit service_role
-- (gleiches Muster wie short_links / finances).
