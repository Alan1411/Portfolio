"use client";

import Link from "next/link";
import { useToolTracking } from "@/lib/tools/useToolTracking";
import { ToolFeedback } from "./ToolFeedback";
import type { ToolMeta } from "@/lib/tools/types";

// Gemeinsamer Rahmen für alle Tool-Seiten: Titel, Beschreibung, Nutzungs-Tracking,
// Feedback-Widget. Übernimmt das bestehende Card/Hero-Design der Seite.
export function ToolShell({ tool, children }: { tool: ToolMeta; children: React.ReactNode }) {
  useToolTracking(tool.slug);

  return (
    <>
      <section className="hero tool-hero">
        <Link href="/tools" className="blog-back">
          ← Alle Tools
        </Link>
        <p className="badge">{tool.name}</p>
        <h1>{tool.name}</h1>
        <p className="subtitle">{tool.description}</p>
      </section>

      <section className="tool-body">{children}</section>

      <ToolFeedback toolSlug={tool.slug} />
    </>
  );
}
