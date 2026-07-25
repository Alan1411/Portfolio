-- 008_storage.sql
-- Storage bucket for project/blog images.
-- Public READ (images are public portfolio content, rendered directly via <img src>).
-- Write access is service-role only (uploads go through admin API routes using
-- SUPABASE_SECRET_KEY, never the anon key) — no insert/update/delete policies needed
-- since service_role bypasses RLS entirely.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read policy (bucket is already public=true, this is belt-and-suspenders
-- in case the "public" flag is ever toggled off)
drop policy if exists "Public read access for portfolio-media" on storage.objects;
create policy "Public read access for portfolio-media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

-- Add optional cover image to blog posts (projects already has image_url)
alter table blog_posts add column if not exists cover_image_url text;

-- Message status tracking
alter table messages add column if not exists status text default 'unread'
  check (status in ('unread', 'read', 'archived'));
create index if not exists idx_messages_status on messages (status);
