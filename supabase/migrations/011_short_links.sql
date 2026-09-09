-- 011_short_links.sql
-- URL shortener

CREATE TABLE IF NOT EXISTS public.short_links (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  url         TEXT NOT NULL,
  clicks      INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_short_links_slug ON public.short_links (slug);
CREATE INDEX IF NOT EXISTS idx_short_links_created ON public.short_links (created_at);

ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;

-- No policies: service-role only, matches email_links/finances pattern