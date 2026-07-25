import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Alan1411",
  description: "About me and my tech stack.",
};

export default function About() {
  return (
    <>
      <section className="hero">
        <p className="badge">About</p>
        <h1>About Me</h1>
        <p className="subtitle">
          Developer, builder, and enthusiast for clean web experiences.
        </p>
      </section>

      <section className="cards">
        <article className="card">
          <span className="card-icon">🧑‍💻</span>
          <h2>Who I Am</h2>
          <p>
            A full-stack developer passionate about building modern web
            applications with cutting-edge technologies.
          </p>
        </article>
        <article className="card">
          <span className="card-icon">⚙️</span>
          <h2>Tech Stack</h2>
          <p>
            Node.js, React, Next.js, TypeScript, Supabase, PostgreSQL, Express,
            and more.
          </p>
        </article>
        <article className="card">
          <span className="card-icon">🌍</span>
          <h2>Goals</h2>
          <p>
            Building tools that matter. Contributing to open source. Learning
            something new every day.
          </p>
        </article>
      </section>
    </>
  );
}
