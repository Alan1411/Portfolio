-- 007_rls_hardening.sql
-- Fixes:
-- 1. projects/skills/blog_posts had CREATE POLICY but RLS was never enabled (dead policies)
-- 2. messages allowed public SELECT (anyone with anon key could read all contact messages)

-- Enable RLS on tables that had policies defined but RLS never turned on
alter table projects enable row level security;
alter table skills enable row level security;
alter table blog_posts enable row level security;

-- Remove the dangerous public read policy on messages.
-- Contact form still works: it uses the server-side service-role key (bypasses RLS),
-- and public INSERT policy stays so the anon key path (if ever used) can still submit.
drop policy if exists "Public read for messages" on messages;

-- Admin reads happen exclusively via SUPABASE_SECRET_KEY server-side (bypasses RLS),
-- so no additional SELECT policy is added here on purpose.
