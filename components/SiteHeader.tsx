"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// Fügt dem Header eine "scrolled"-Klasse hinzu, sobald die Seite gescrollt wurde
// (kleinerer Header, stärkerer Schatten/Blur)
export function SiteHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <header className={`header${scrolled ? " scrolled" : ""}`}>{children}</header>;
}
