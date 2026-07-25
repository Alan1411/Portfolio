-- 009_finances.sql
-- Personal finance tracking for the admin panel dashboard

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12,2) not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  description text,
  occurred_at date not null default current_date,
  created_at timestamptz default now()
);

create index if not exists idx_transactions_occurred_at on transactions (occurred_at desc);
create index if not exists idx_transactions_type on transactions (type);
create index if not exists idx_transactions_category on transactions (category);

alter table transactions enable row level security;
-- No policies: service-role only, matches users/analytics/email_links pattern

create table if not exists financial_goals (
  id uuid primary key default gen_random_uuid(),
  period text not null check (period in ('monthly', 'yearly')),
  target_amount numeric(12,2) not null,
  updated_at timestamptz default now(),
  unique (period)
);

alter table financial_goals enable row level security;
-- No policies: service-role only

insert into financial_goals (period, target_amount) values
  ('monthly', 5000),
  ('yearly', 60000)
on conflict (period) do nothing;
