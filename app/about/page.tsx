import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "About — ChicoCode",
  description: "About me and my tech stack.",
};

export default function About() {
  return (
    <>
      <Hero
        badge="About"
        title="About Me"
        subtitle="Developer, builder, and enthusiast for clean web experiences."
      />

      <Stagger className="cards">
        <StaggerItem className="card">
          <span className="card-icon">🧑‍💻</span>
          <h2>Who I Am</h2>
          <p>
            A full-stack developer passionate about building modern web
            applications with cutting-edge technologies.
          </p>
        </StaggerItem>
        <StaggerItem className="card">
          <span className="card-icon">⚙️</span>
          <h2>Tech Stack</h2>
          <p>
            Node.js, React, Next.js, TypeScript, Supabase, PostgreSQL, Express,
            and more.
          </p>
        </StaggerItem>
        <StaggerItem className="card">
          <span className="card-icon">🌍</span>
          <h2>Goals</h2>
          <p>
            Building tools that matter. Contributing to open source. Learning
            something new every day.
          </p>
        </StaggerItem>
      </Stagger>
    </>
  );
}
