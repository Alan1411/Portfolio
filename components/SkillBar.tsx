"use client";

import { motion } from "framer-motion";

// Füllt sich animiert, sobald die Leiste ins Sichtfeld scrollt
export function SkillBar({ proficiency }: { proficiency: number }) {
  const pct = Math.max(0, Math.min(5, proficiency)) * 20;

  return (
    <span className="skill-bar-track" aria-hidden="true">
      <motion.span
        className="skill-bar-fill"
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}
