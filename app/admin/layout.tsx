import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Admin Panel — Alan1411",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

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
          <LogoutButton className="admin-nav-link" />
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
