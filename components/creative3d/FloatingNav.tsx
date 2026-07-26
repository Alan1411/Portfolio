"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#", label: "Home" },
  { href: "#c3d-projects", label: "Projects" },
  { href: "#c3d-about", label: "About" },
  { href: "#c3d-contact", label: "Contact" },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      className={`c3d-nav ${scrolled ? "c3d-nav-scrolled" : ""}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
    >
      <div className="c3d-nav-inner">
        <a href="#" className="c3d-nav-logo">
          ChicoCode
        </a>

        <ul className="c3d-nav-links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <a href="/login" className="c3d-nav-cta">
          Admin
        </a>

        <button
          className="c3d-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span data-o={String(open)} />
          <span data-o={String(open)} />
          <span data-o={String(open)} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="c3d-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="/login" onClick={() => setOpen(false)}>
              Admin
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
