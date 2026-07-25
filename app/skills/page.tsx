import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Skills — Alan1411",
  description: "My technical skills and proficiency.",
};

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  proficiency: number;
  sort_order: number;
}

export const revalidate = 60;

export default async function Skills() {
  let skills: Skill[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });

    skills = data || [];
  } catch {
    // API not available at build time
  }

  const grouped: Record<string, Skill[]> = {};
  skills.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <>
      <section className="hero">
        <p className="badge">Tech</p>
        <h1>Skills</h1>
        <p className="subtitle">Technologies and tools I work with.</p>
      </section>

      <section className="skills-section">
        <div className="skills-grid">
          {Object.keys(grouped).length === 0 ? (
            <p className="muted">No skills listed yet.</p>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="skill-group">
                <h3 className="skill-category">{cat}</h3>
                <div className="skill-items">
                  {items.map((s) => (
                    <div key={s.id} className="skill-pill">
                      {s.icon && <span>{s.icon}</span>}
                      <span>{s.name}</span>
                      <span className="skill-level">
                        {"●".repeat(s.proficiency)}
                        {"○".repeat(5 - s.proficiency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
