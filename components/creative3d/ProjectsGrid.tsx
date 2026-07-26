"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
}

const wrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d))
      .catch(() => {});
  }, []);

  const cats = ["all", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div className="c3d-filters">
        {cats.map((c) => (
          <button
            key={c}
            className={`c3d-filter-btn ${filter === c ? "c3d-active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <motion.div
        className="c3d-projects-grid"
        variants={wrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            className="c3d-project-card"
            variants={item}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {p.image_url && (
              <div className="c3d-card-img">
                <img src={p.image_url} alt={p.title} loading="lazy" />
              </div>
            )}
            <div className="c3d-card-body">
              <span className="c3d-card-cat">{p.category}</span>
              <h3 className="c3d-card-title">{p.title}</h3>
              <p className="c3d-card-desc">{p.description}</p>
              {p.technologies?.length > 0 && (
                <div className="c3d-card-techs">
                  {p.technologies.map((t) => (
                    <span key={t} className="c3d-tech">{t}</span>
                  ))}
                </div>
              )}
              <div className="c3d-card-links">
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noopener" className="c3d-link">
                    GitHub
                  </a>
                )}
                {p.demo_url && (
                  <a href={p.demo_url} target="_blank" rel="noopener" className="c3d-link c3d-link-primary">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
