-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Profiles table (extends auth.users with role info)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Users can read their own profile; admins can read all
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);

create policy "Admins read all profiles" on profiles
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins update profiles" on profiles
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    case when not exists (select 1 from public.profiles) then 'admin' else 'user' end
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Announcements table (yellow banner shown on every page)
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  type text not null default 'info' check (type in ('info', 'warning', 'success', 'error')),
  active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table announcements enable row level security;

create policy "Public read active announcements" on announcements
  for select using (active = true);

create policy "Admins manage announcements" on announcements
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create index if not exists idx_announcements_active on announcements (active);
create index if not exists idx_profiles_role on profiles (role);
