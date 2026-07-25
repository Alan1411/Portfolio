import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EmailTrackPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: link } = await supabase
    .from("email_links")
    .select("id, status")
    .eq("token", token)
    .single();

  if (link && link.status === "sent") {
    await supabase
      .from("email_links")
      .update({ status: "opened", opened_at: new Date().toISOString() })
      .eq("token", token);
  }

  redirect("/");
}
