"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import ProwashLogo from "@/components/prowash/Logo";
import "./globals.css";

const NAV_LINKS = [
  { label: "Home", to: "/prowash" },
  { label: "Leistungen", to: "/prowash/leistungen" },
  { label: "Bewertungen", to: "/prowash/bewertungen" },
  { label: "Kontakt", to: "/prowash/kontakt" },
];

export default function ProwashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/prowash" ? pathname === "/prowash" : pathname.startsWith(path);

  return (
    <div className="prowash-root min-h-screen flex flex-col" style={{ background: "#080a0c" }}>
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(8,10,12,0.92)"
            : "rgba(8,10,12,0.4)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 md:h-20">
          <ProwashLogo />

          {/* Desktop nav + CTA */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.to}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive(l.to)
                      ? "#e74c3c"
                      : "rgba(255,255,255,0.55)",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <a
              href="tel:+4915738637912"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
              }}
            >
              <Phone size={15} /> Anrufen
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            style={{ color: "rgba(255,255,255,0.8)" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div
            className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-5"
            style={{
              background: "rgba(8,10,12,0.98)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.to}
                className="text-base font-medium"
                style={{
                  color: isActive(l.to)
                    ? "#e74c3c"
                    : "rgba(255,255,255,0.75)",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+4915738637912"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white mt-2 w-fit"
              style={{
                background:
                  "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
              }}
            >
              <Phone size={15} /> 01573 8637912
            </a>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 pt-16 md:pt-20">{children}</main>

      {/* FOOTER */}
      <footer
        style={{
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <ProwashLogo />
              <p
                className="mt-4 text-sm leading-relaxed max-w-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Professionelle Fahrzeugaufbereitung, Keramikversiegelung und
                Leasing-Rückläufer aus Osnabrück.
              </p>
            </div>

            {/* Nav */}
            <div>
              <p
                className="text-xs font-bold tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                NAVIGATION
              </p>
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.to}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p
                className="text-xs font-bold tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                KONTAKT
              </p>
              <div
                className="flex flex-col gap-3 text-sm"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <a
                  href="tel:+4915738637912"
                  className="hover:text-white transition-colors"
                >
                  01573 8637912
                </a>
                <a
                  href="mailto:info@prowash-osnabrueck.de"
                  className="hover:text-white transition-colors"
                >
                  info@prowash-osnabrueck.de
                </a>
                <span>Osnabrück, Niedersachsen</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} Prowash Autoaufbereitung. Alle Rechte
              vorbehalten.
            </p>
            <div
              className="flex gap-6 text-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <a href="/prowash" className="hover:text-white transition-colors">
                Impressum
              </a>
              <a href="/prowash" className="hover:text-white transition-colors">
                Datenschutz
              </a>
              <a href="/prowash" className="hover:text-white transition-colors">
                AGB
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
