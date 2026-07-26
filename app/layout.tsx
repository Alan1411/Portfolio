import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLinks } from "@/components/NavLinks";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Alan1411 — Portfolio",
  description: "A developer portfolio powered by Next.js and Supabase.",
  icons: {
    icon: "/images/Schwarz512x512.png",
  },
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

async function getUser() {
  const user = await getCurrentUser();
  return user;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [announcements, user] = await Promise.all([
    getActiveAnnouncements(),
    getUser(),
  ]);
  const isAdmin = user?.role === "admin";

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AnalyticsTracker />
        <AnnouncementBar announcements={announcements} />
        <header className="header">
          <nav className="nav">
            <Logo />
            <NavLinks isAdmin={isAdmin} user={user} />
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
