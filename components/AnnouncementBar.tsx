"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
}

export function AnnouncementBar({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("dismissed-announcements") || "[]"
    );
    setDismissed(stored);
    setHydrated(true);
  }, []);

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem("dismissed-announcements", JSON.stringify(next));
  };

  if (!hydrated) return null;

  const visible = announcements.filter((a) => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="announcement-stack">
      {visible.map((a) => (
        <div key={a.id} className={`announcement-bar announcement-${a.type}`}>
          <span>{a.message}</span>
          <button
            className="announcement-close"
            onClick={() => dismiss(a.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
