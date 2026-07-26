"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.2"],
  });

  const words = text.split(" ");

  return (
    <div ref={ref} className="c3d-reveal-box">
      <h2 className="c3d-reveal-text">
        {words.map((word, wi) => (
          <span key={wi} className="c3d-reveal-word">
            {word.split("").map((char, ci) => {
              const done = words.slice(0, wi).join("").length + ci;
              const total = text.replace(/\s/g, "").length;
              const s = done / total;
              const e = s + 1 / total;

              const opacity = useTransform(scrollYProgress, [s, e], [0.15, 1]);
              const color = useTransform(
                scrollYProgress,
                [s, e],
                ["rgba(100,100,120,0.3)", "rgba(129,140,248,1)"]
              );
              const y = useTransform(scrollYProgress, [s, e], [20, 0]);

              return (
                <motion.span key={ci} style={{ opacity, color, y }} className="c3d-char">
                  {char}
                </motion.span>
              );
            })}
            <span>&nbsp;</span>
          </span>
        ))}
      </h2>
    </div>
  );
}
