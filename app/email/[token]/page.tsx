import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

export default async function EmailTrackPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = getSupabase();

  const { data: link } = await supabase
    .from("email_links")
    .select("id, email, subject, message, status")
    .eq("token", token)
    .single();

  if (!link) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h1>Link not found</h1>
        <p>This link is invalid or has expired.</p>
      </div>
    );
  }

  // Log the open if not already opened
  if (link.status === "sent") {
    await supabase
      .from("email_links")
      .update({ status: "opened", opened_at: new Date().toISOString() })
      .eq("token", token);
  }

  const subject = link.subject || "Message";
  const message = link.message || "This link has been tracked and the owner has been notified.";

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "var(--surface, #1e293b)",
          borderRadius: 16,
          padding: "2.5rem",
          textAlign: "center",
          border: "1px solid var(--border, #334155)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✉️</div>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{subject}</h1>
        <p style={{ color: "var(--muted, #94a3b8)", lineHeight: 1.6 }}>{message}</p>
        <span
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.4rem 1rem",
            background: "rgba(34,197,94,0.1)",
            color: "#22c55e",
            borderRadius: 999,
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          ✓ Link opened
        </span>
      </div>
    </div>
  );
}
