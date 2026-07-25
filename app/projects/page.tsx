import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Projects — Alan1411",
  description: "My projects and work.",
};

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  repo_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
}

export const dynamic = "force-dynamic";

export default async function Projects() {
  let projects: Project[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    projects = data || [];
  } catch {
    // API not available at build time
  }

  return (
    <>
      <section className="hero">
        <p className="badge">Work</p>
        <h1>Projects</h1>
        <p className="subtitle">Things I&apos;ve built and shipped.</p>
      </section>

      <section className="projects-section">
        <div className="cards">
          {projects.length === 0 ? (
            <p className="muted">No projects yet.</p>
          ) : (
            projects.map((p) => (
              <article key={p.id} className="card">
                <span className="card-icon">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      style={{ width: "100%", borderRadius: "0.5rem", marginBottom: "0.5rem" }}
                    />
                  ) : (
                    "📁"
                  )}
                </span>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="tech-tags">
                    {p.tech_stack.map((t) => (
                      <span key={t} className="tech-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="card-links">
                  {p.repo_url && (
                    <a
                      href={p.repo_url}
                      target="_blank"
                      rel="noopener"
                      className="btn btn-small"
                    >
                      GitHub
                    </a>
                  )}
                  {p.demo_url && (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noopener"
                      className="btn btn-small btn-primary"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
