-- 006_email_tracking.sql
-- Email link tracking system

CREATE TABLE IF NOT EXISTS public.email_links (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  subject     TEXT,
  message     TEXT,
  status      TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'opened')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  opened_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_email_links_token ON public.email_links (token);
CREATE INDEX IF NOT EXISTS idx_email_links_email ON public.email_links (email);

ALTER TABLE public.email_links ENABLE ROW LEVEL SECURITY;
