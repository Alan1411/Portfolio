import type { Metadata } from "next";
import Link from "next/link";
import { getCachedBlogPosts } from "@/lib/cache";
import { Hero } from "@/components/Hero";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

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
      <Hero badge="Write" title="Blog" subtitle="Thoughts, tutorials, and updates." />

      <section className="blog-section">
        {posts.length === 0 ? (
          <p className="muted">No blog posts yet.</p>
        ) : (
          <Stagger className="blog-grid">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}>
                <StaggerItem className="card blog-card">
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
                </StaggerItem>
              </Link>
            ))}
          </Stagger>
        )}
      </section>
    </>
  );
}
