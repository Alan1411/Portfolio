"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Blendet Inhalte sanft ein — entweder sofort beim Laden ("immediate", z.B. Hero-Text)
// oder beim Scrollen ins Sichtfeld (Standard, für Sections weiter unten auf der Seite).
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.6,
  immediate = false,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  immediate?: boolean;
  className?: string;
  as?: "div" | "section";
}) {
  const visibility = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" } };

  const MotionTag = as === "section" ? motion.section : motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration, delay, ease: EASE }}
      {...visibility}
    >
      {children}
    </MotionTag>
  );
}
