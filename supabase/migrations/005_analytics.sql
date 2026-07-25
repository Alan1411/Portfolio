-- 005_analytics.sql
-- Custom analytics table for page view tracking

CREATE TABLE IF NOT EXISTS public.analytics (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page       TEXT NOT NULL,
  referrer   TEXT,
  visitor_id TEXT NOT NULL,
  user_agent TEXT,
  country    TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON public.analytics (page);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON public.analytics (visitor_id);

-- RLS: only service role can access (no public policies)
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Partition by month for performance (optional, keeps query fast as data grows)
-- We'll handle aggregation in the API instead for simplicity
