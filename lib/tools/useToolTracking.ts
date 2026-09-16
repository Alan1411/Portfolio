"use client";

import { useEffect } from "react";

// Feuert einmal pro Seitenaufruf einen anonymen "Tool genutzt"-Eintrag ab.
export function useToolTracking(toolSlug: string) {
  useEffect(() => {
    fetch("/api/tools/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolName: toolSlug }),
    }).catch(() => {
      // Tracking darf das Tool nie blockieren
    });
  }, [toolSlug]);
}
