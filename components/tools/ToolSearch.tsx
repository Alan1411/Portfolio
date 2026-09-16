"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ToolMeta } from "@/lib/tools/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/tools/types";

export function ToolSearch({ tools }: { tools: ToolMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [tools, query]);

  const byCategory = useMemo(() => {
    const map = new Map<string, ToolMeta[]>();
    for (const t of filtered) {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category)!.push(t);
    }
    return map;
  }, [filtered]);

  return (
    <>
      <div className="tool-search-wrap">
        <input
          className="tool-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tools durchsuchen… (z.B. Hash, Subnetz, Passwort)"
        />
      </div>

      {filtered.length === 0 && <p className="muted">Keine Tools gefunden.</p>}

      {CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => (
        <section key={category} className="tool-category-section">
          <h2>{CATEGORY_LABELS[category]}</h2>
          <div className="cards tool-grid">
            {byCategory.get(category)!.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="card tool-card">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
