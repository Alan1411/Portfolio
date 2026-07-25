import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLinks } from "@/components/NavLinks";

export const metadata: Metadata = {
  title: "Alan1411 — Portfolio",
  description: "A developer portfolio powered by Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="header">
          <nav className="nav">
            <a href="/" className="logo">
              Alan1411
            </a>
            <NavLinks />
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
