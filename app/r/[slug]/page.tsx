import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ShortLinkRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: link } = await supabase
    .from("short_links")
    .select("url, clicks")
    .eq("slug", slug.toLowerCase())
    .single();

  if (link) {
    await supabase
      .from("short_links")
      .update({ clicks: (link.clicks || 0) + 1 })
      .eq("slug", slug.toLowerCase());
  }

  redirect(link?.url || "/");
}