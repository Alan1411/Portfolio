"use client";

import { useState, useEffect } from "react";

function updateFavicon(theme: string) {
  const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (link) {
    link.href = theme === "dark" ? "/images/Weiss512x512.png" : "/images/Schwarz512x512.png";
  }
}

export function Logo() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    updateFavicon(saved);

    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(t);
      updateFavicon(t);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const src = theme === "dark" ? "/images/Weiss.png" : "/images/Schwarz.png";

  return (
    <a href="/" className="logo-link">
      <img src={src} alt="Alan1411" className="logo-img" />
    </a>
  );
}
