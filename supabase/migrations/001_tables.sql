-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text[] default '{}',
  repo_url text,
  demo_url text,
  image_url text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Skills table
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'general',
  icon text,
  proficiency int default 3 check (proficiency between 1 and 5),
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Blog posts table
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table (already exists, just ensure RLS)
alter table messages enable row level security;

-- RLS policies
create policy "Public read access for projects" on projects
  for select using (true);

create policy "Public read access for skills" on skills
  for select using (true);

create policy "Public read access for published blog posts" on blog_posts
  for select using (published = true);

create policy "Public insert for messages" on messages
  for insert with check (true);

create policy "Public read for messages" on messages
  for select using (true);

-- Indexes
create index if not exists idx_projects_featured on projects (featured);
create index if not exists idx_projects_sort on projects (sort_order);
create index if not exists idx_skills_category on skills (category);
create index if not exists idx_blog_slug on blog_posts (slug);
create index if not exists idx_blog_published on blog_posts (published);
