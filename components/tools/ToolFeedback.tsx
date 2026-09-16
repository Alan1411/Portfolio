"use client";

import { useEffect, useState } from "react";

// Einfaches Daumen hoch/runter-Feedback pro Tool, gespeichert in Supabase (tool_feedback)
export function ToolFeedback({ toolSlug }: { toolSlug: string }) {
  const [counts, setCounts] = useState<{ up: number; down: number } | null>(null);
  const [voted, setVoted] = useState<1 | -1 | null>(null);

  useEffect(() => {
    const key = `tool_feedback_${toolSlug}`;
    const stored = localStorage.getItem(key);
    if (stored === "1" || stored === "-1") setVoted(Number(stored) as 1 | -1);

    fetch(`/api/tools/feedback?tool=${encodeURIComponent(toolSlug)}`)
      .then((r) => r.json())
      .then((data) => setCounts({ up: data.up || 0, down: data.down || 0 }))
      .catch(() => setCounts({ up: 0, down: 0 }));
  }, [toolSlug]);

  async function vote(rating: 1 | -1) {
    if (voted) return; // ein Vote pro Browser (localStorage)
    setVoted(rating);
    localStorage.setItem(`tool_feedback_${toolSlug}`, String(rating));
    setCounts((c) =>
      c ? { up: c.up + (rating === 1 ? 1 : 0), down: c.down + (rating === -1 ? 1 : 0) } : c
    );
    try {
      await fetch("/api/tools/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName: toolSlug, rating }),
      });
    } catch {
      // Feedback ist optional, Fehler ignorieren
    }
  }

  return (
    <div className="tool-feedback">
      <span className="tool-feedback-label">War dieses Tool hilfreich?</span>
      <button
        type="button"
        className={`tool-feedback-btn${voted === 1 ? " active" : ""}`}
        onClick={() => vote(1)}
        disabled={!!voted}
        aria-label="Daumen hoch"
      >
        👍 {counts?.up ?? ""}
      </button>
      <button
        type="button"
        className={`tool-feedback-btn${voted === -1 ? " active" : ""}`}
        onClick={() => vote(-1)}
        disabled={!!voted}
        aria-label="Daumen runter"
      >
        👎 {counts?.down ?? ""}
      </button>
    </div>
  );
}
