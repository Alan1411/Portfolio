"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Wiederverwendbarer Hero-Bereich: animierte Gradient-Blobs mit leichtem Parallax-Effekt
// beim Scrollen, plus gestaffelte Eingangsanimation für Badge/Titel/Subtitle/Actions.
export function Hero({
  badge,
  title,
  subtitle,
  actions,
}: {
  badge: string;
  title: ReactNode;
  subtitle: ReactNode;
  actions?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero-blob hero-blob-1" style={{ y: blob1Y }} aria-hidden="true" />
      <motion.div className="hero-blob hero-blob-2" style={{ y: blob2Y }} aria-hidden="true" />

      <motion.p
        className="badge"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {badge}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
      >
        {subtitle}
      </motion.p>
      {actions && (
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
        >
          {actions}
        </motion.div>
      )}
    </section>
  );
}
