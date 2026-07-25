import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

// Cached data fetchers for public pages. supabase-js doesn't use fetch(),
// so Next's Data Cache never intercepts it automatically — unstable_cache
// wraps the query result manually. Tags let admin mutations bust the cache
// instantly via revalidateTag() instead of waiting for the 1h TTL.

export const getCachedProjects = unstable_cache(
  async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    return data || [];
  },
  ["projects-list"],
  { tags: ["projects"], revalidate: 3600 }
);

export const getCachedSkills = unstable_cache(
  async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    return data || [];
  },
  ["skills-list"],
  { tags: ["skills"], revalidate: 3600 }
);

export const getCachedBlogPosts = unstable_cache(
  async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return data || [];
  },
  ["blog-list"],
  { tags: ["blog"], revalidate: 3600 }
);

export const getCachedBlogPost = unstable_cache(
  async (slug: string) => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data || null;
  },
  ["blog-post"],
  { tags: ["blog"], revalidate: 3600 }
);
