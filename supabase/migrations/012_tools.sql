-- 012_tools.sql
-- Tabellen für die IT-Tools-Sammlung (/tools): Nutzungsstatistik, Snippets, Feedback.
-- Alle Berechnungen der Tools laufen clientseitig, Supabase wird nur für diese
-- drei nicht-sensiblen Zwecke verwendet.

-- Anonyme Nutzungsstatistik: ein Eintrag pro Tool-Aufruf, kein Personenbezug
create table if not exists public.tool_usage (
  id        uuid default gen_random_uuid() primary key,
  tool_name text not null,
  used_at   timestamptz default now()
);

create index if not exists idx_tool_usage_tool_name on public.tool_usage (tool_name);
create index if not exists idx_tool_usage_used_at on public.tool_usage (used_at desc);

alter table public.tool_usage enable row level security;

-- PowerShell/Bash Snippet-Sammlung (CRUD)
create table if not exists public.snippets (
  id         uuid default gen_random_uuid() primary key,
  title      text not null,
  language   text not null default 'bash',
  code       text not null,
  tags       text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_snippets_language on public.snippets (language);
create index if not exists idx_snippets_created_at on public.snippets (created_at desc);

alter table public.snippets enable row level security;

-- Daumen hoch/runter pro Tool
create table if not exists public.tool_feedback (
  id         uuid default gen_random_uuid() primary key,
  tool_name  text not null,
  rating     smallint not null check (rating in (-1, 1)), -- -1 = runter, 1 = hoch
  created_at timestamptz default now()
);

create index if not exists idx_tool_feedback_tool_name on public.tool_feedback (tool_name);

alter table public.tool_feedback enable row level security;

-- Zugriff läuft ausschließlich serverseitig über die API-Routen unter /api/tools/*
-- mit dem Service-Role-Key (gleiche Konvention wie bei "analytics"), daher sind
-- hier bewusst keine öffentlichen RLS-Policies definiert.
