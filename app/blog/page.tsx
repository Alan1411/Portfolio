import type { Metadata } from "next";
import Link from "next/link";
import { getCachedBlogPosts } from "@/lib/cache";

export const metadata: Metadata = {
  title: "Blog — ChicoCode",
  description: "Thoughts, tutorials, and updates.",
};

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export const revalidate = 3600; // 1 hour — refreshed instantly on admin changes via revalidateTag

export default async function Blog() {
  let posts: Post[] = [];

  try {
    posts = await getCachedBlogPosts();
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
                  {p.cover_image_url && (
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      style={{ width: "100%", borderRadius: "0.5rem", marginBottom: "0.75rem", aspectRatio: "16/9", objectFit: "cover" }}
                    />
                  )}
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
