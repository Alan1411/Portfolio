-- 010_email_redirect.sql
-- Add redirect_url column to email_links

ALTER TABLE public.email_links
  ADD COLUMN IF NOT EXISTS redirect_url TEXT;
