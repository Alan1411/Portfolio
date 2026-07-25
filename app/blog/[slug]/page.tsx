import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!data) return { title: "Post Not Found" };

  return {
    title: `${data.title} — Alan1411`,
    description: data.excerpt || undefined,
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

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
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
