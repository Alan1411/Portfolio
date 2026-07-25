-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- Custom auth system: replaces Supabase Auth. This table is accessed
-- exclusively via the server (service role key), so RLS stays locked down
-- with no public policies.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  password_hash text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  email_verified boolean not null default false,
  verification_code text,
  verification_expires timestamptz,
  verification_attempts int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table users enable row level security;

-- No public policies: all access happens server-side with the service
-- role key, which bypasses RLS entirely. This blocks anon/authenticated
-- client access to the table by default.

create index if not exists idx_users_email on users (email);
create index if not exists idx_users_role on users (role);
