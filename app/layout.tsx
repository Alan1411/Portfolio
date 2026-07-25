import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLinks } from "@/components/NavLinks";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Alan1411 — Portfolio",
  description: "A developer portfolio powered by Next.js and Supabase.",
};

export const dynamic = "force-dynamic";

async function getActiveAnnouncements() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );
    const { data } = await supabase
      .from("announcements")
      .select("id, message, type")
      .eq("active", true)
      .order("created_at", { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

async function getIsAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [announcements, isAdmin] = await Promise.all([
    getActiveAnnouncements(),
    getIsAdmin(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AnnouncementBar announcements={announcements} />
        <header className="header">
          <nav className="nav">
            <a href="/" className="logo">
              Alan1411
            </a>
            <NavLinks isAdmin={isAdmin} />
            <ThemeToggle />
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>
            Built by <strong>Alan1411</strong> · {new Date().getFullYear()}
          </p>
        </footer>
      </body>
    </html>
  );
}
