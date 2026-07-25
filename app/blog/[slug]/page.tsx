import type { Metadata } from "next";
import Link from "next/link";
import { getCachedBlogPost } from "@/lib/cache";
import { notFound } from "next/navigation";

export const revalidate = 3600; // 1 hour — refreshed instantly on admin changes via revalidateTag

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const data = await getCachedBlogPost(params.slug);

    if (!data) return { title: "Post Not Found" };

    return {
      title: `${data.title} — Alan1411`,
      description: data.excerpt || undefined,
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post = await getCachedBlogPost(params.slug);

    if (!post) notFound();

    return (
      <div className="blog-content">
        <Link href="/blog" className="blog-back">
          ← Back to Blog
        </Link>
        <h1>{post.title}</h1>
        <p className="meta">
          {new Date(post.created_at).toLocaleDateString()}
          {post.updated_at &&
            ` (updated ${new Date(post.updated_at).toLocaleDateString()})`}
        </p>
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ width: "100%", borderRadius: "0.75rem", margin: "1rem 0" }}
          />
        )}
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
