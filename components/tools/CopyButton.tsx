"use client";

import { useState } from "react";

// Kleiner Button zum Kopieren von Text in die Zwischenablage, mit kurzer Bestätigung
export function CopyButton({ text, label = "Kopieren" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Zwischenablage nicht verfügbar (z.B. kein HTTPS-Kontext)
    }
  }

  return (
    <button type="button" className="btn btn-secondary btn-small" onClick={handleCopy}>
      {copied ? "Kopiert ✓" : label}
    </button>
  );
}
