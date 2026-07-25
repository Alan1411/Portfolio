import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Blog — Alan1411",
  description: "Thoughts, tutorials, and updates.",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  created_at: string;
}

export const revalidate = 60;

export default async function Blog() {
  let posts: Post[] = [];

  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    posts = data || [];
  } catch {
    // API not available at build time
  }

  return (
    <>
      <section className="hero">
        <p className="badge">Write</p>
        <h1>Blog</h1>
        <p className="subtitle">Thoughts, tutorials, and updates.</p>
      </section>

      <section className="blog-section">
        <div className="blog-grid">
          {posts.length === 0 ? (
            <p className="muted">No blog posts yet.</p>
          ) : (
            posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}>
                <article className="card blog-card">
                  <h2>{p.title}</h2>
                  {p.excerpt && <p>{p.excerpt}</p>}
                  <small className="muted">
                    {new Date(p.created_at).toLocaleDateString()}
                  </small>
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}
