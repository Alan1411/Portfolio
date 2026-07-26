"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { FloatingNav } from "@/components/creative3d/FloatingNav";
import { ScrollRevealText } from "@/components/creative3d/ScrollRevealText";
import { ProjectsGrid } from "@/components/creative3d/ProjectsGrid";
import { AboutSection } from "@/components/creative3d/AboutSection";
import { ContactSection } from "@/components/creative3d/ContactSection";

const HeroScene = dynamic(
  () => import("@/components/creative3d/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export default function Creative3dPage() {
  return (
    <div className="c3d-root">
      <FloatingNav />

      {/* Hero 3D */}
      <section className="c3d-hero">
        <div className="c3d-canvas-wrap">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
        <div className="c3d-hero-content">
          <h1 className="c3d-hero-title">
            <span className="c3d-hero-line">Creative</span>
            <span className="c3d-hero-line c3d-accent">Developer</span>
          </h1>
          <p className="c3d-hero-sub">
            Building the future with code, AI &amp; hardware
          </p>
          <a href="#c3d-projects" className="c3d-hero-cta">
            Explore My Work
          </a>
        </div>
      </section>

      {/* Scroll Reveal */}
      <section className="c3d-reveal-section">
        <ScrollRevealText text="Turning Ideas Into Digital Reality" />
      </section>

      <div className="c3d-divider" />

      {/* Projects */}
      <section id="c3d-projects" className="c3d-content-section">
        <div className="c3d-section-header">
          <span className="c3d-tag">Projects</span>
          <h2 className="c3d-section-title">Featured Work</h2>
        </div>
        <ProjectsGrid />
      </section>

      <div className="c3d-divider" />

      {/* About */}
      <section id="c3d-about" className="c3d-content-section">
        <div className="c3d-section-header">
          <span className="c3d-tag">About</span>
          <h2 className="c3d-section-title">Who I Am</h2>
        </div>
        <AboutSection />
      </section>

      <div className="c3d-divider" />

      {/* Contact */}
      <section id="c3d-contact" className="c3d-content-section">
        <div className="c3d-section-header">
          <span className="c3d-tag">Contact</span>
          <h2 className="c3d-section-title">Get In Touch</h2>
        </div>
        <ContactSection />
      </section>

      <footer className="c3d-footer">
        <p>
          Built by <strong>ChicoCode</strong> · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
