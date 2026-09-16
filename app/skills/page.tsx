import type { Metadata } from "next";
import { getCachedSkills } from "@/lib/cache";
import { Hero } from "@/components/Hero";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SkillBar } from "@/components/SkillBar";

export const metadata: Metadata = {
  title: "Skills — ChicoCode",
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

export const revalidate = 3600; // 1 hour — refreshed instantly on admin changes via revalidateTag

export default async function Skills() {
  let skills: Skill[] = [];

  try {
    skills = await getCachedSkills();
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
      <Hero badge="Tech" title="Skills" subtitle="Technologies and tools I work with." />

      <section className="skills-section">
        {Object.keys(grouped).length === 0 ? (
          <p className="muted">No skills listed yet.</p>
        ) : (
          <Stagger className="skills-grid">
            {Object.entries(grouped).map(([cat, items]) => (
              <StaggerItem key={cat} className="skill-group">
                <h3 className="skill-category">{cat}</h3>
                <div className="skill-items">
                  {items.map((s) => (
                    <div key={s.id} className="skill-pill">
                      <span className="skill-pill-name">
                        {s.icon && <span>{s.icon}</span>}
                        <span>{s.name}</span>
                      </span>
                      <SkillBar proficiency={s.proficiency} />
                    </div>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </>
  );
}
