import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/AdminNav";
import { logout } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Admin Panel — Alan1411",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>⚙️ Admin Panel</h2>
        <AdminNav />
        <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", padding: "0 0.5rem" }}>
            {user?.email}
          </p>
          <Link href="/" className="admin-nav-link">
            ← Back to Site
          </Link>
          <form action={logout}>
            <button type="submit" className="admin-nav-link" style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
              Log Out
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
