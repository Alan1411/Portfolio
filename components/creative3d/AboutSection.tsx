"use client";

import { motion } from "framer-motion";

const skills = [
  { icon: "⚡", title: "Web Development", desc: "Next.js, React, TypeScript, Node.js" },
  { icon: "🤖", title: "AI & Automation", desc: "LLMs, Prompt Engineering, Smart Systems" },
  { icon: "🔧", title: "Hardware", desc: "Raspberry Pi, ESP32, Electronics" },
  { icon: "🖨️", title: "3D Printing", desc: "CAD Design, Maker Projects" },
  { icon: "🎨", title: "UI/UX Design", desc: "Figma, Modern Interfaces, 3D Web" },
  { icon: "🚀", title: "DevOps", desc: "Vercel, Docker, CI/CD, Supabase" },
];

const wrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function AboutSection() {
  return (
    <div className="c3d-about">
      <motion.div
        className="c3d-about-text"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p>
          Full-Stack Entwickler mit Leidenschaft für modernste Technologien.
          Ich baue intelligente Systeme, interaktive Web-Erfahrungen und
          Hardware-Projekte — immer mit Fokus auf Qualität und Innovation.
        </p>
        <p>
          Von der Konzeption bis zum Deployment — ich entwickle Lösungen,
          die nicht nur funktionieren, sondern begeistern.
        </p>
      </motion.div>

      <motion.div
        className="c3d-skills-grid"
        variants={wrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {skills.map((s) => (
          <motion.div key={s.title} className="c3d-skill-card" variants={item} whileHover={{ y: -5, scale: 1.03 }}>
            <span className="c3d-skill-icon">{s.icon}</span>
            <h3 className="c3d-skill-title">{s.title}</h3>
            <p className="c3d-skill-desc">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
