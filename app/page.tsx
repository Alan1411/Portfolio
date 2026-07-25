import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="badge">Portfolio</p>
        <h1>Hello, World!</h1>
        <p className="subtitle">
          A developer portfolio powered by Next.js and Supabase.
        </p>
        <div className="hero-actions">
          <Link
            href="https://github.com/Alan1411"
            className="btn btn-secondary"
            target="_blank"
            rel="noopener"
          >
            View GitHub
          </Link>
          <Link href="/projects" className="btn btn-primary">
            My Projects
          </Link>
        </div>
      </section>

      <section className="cards">
        <article className="card">
          <span className="card-icon">🚀</span>
          <h2>Next.js</h2>
          <p>React framework with SSR, file-based routing, and Vercel deployment.</p>
        </article>
        <article className="card">
          <span className="card-icon">🎨</span>
          <h2>Styled</h2>
          <p>Clean layout with light and dark mode support.</p>
        </article>
        <article className="card">
          <span className="card-icon">📦</span>
          <h2>Supabase</h2>
          <p>Connected to Supabase for authentication, database, and storage.</p>
        </article>
      </section>
    </>
  );
}
