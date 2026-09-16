import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export default function Home() {
  return (
    <>
      <Hero
        badge="Portfolio"
        title="Hello, World!"
        subtitle="A developer portfolio powered by Next.js and Supabase."
        actions={
          <>
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
          </>
        }
      />

      <Stagger className="cards">
        <StaggerItem className="card">
          <span className="card-icon">🚀</span>
          <h2>Next.js</h2>
          <p>React framework with SSR, file-based routing, and Vercel deployment.</p>
        </StaggerItem>
        <StaggerItem className="card">
          <span className="card-icon">🎨</span>
          <h2>Styled</h2>
          <p>Clean layout with light and dark mode support.</p>
        </StaggerItem>
        <StaggerItem className="card">
          <span className="card-icon">📦</span>
          <h2>Supabase</h2>
          <p>Connected to Supabase for authentication, database, and storage.</p>
        </StaggerItem>
      </Stagger>

      <Reveal className="home-cta-banner">
        <span>Need an IT tool for a quick task?</span>
        <Link href="/tools" className="btn btn-secondary btn-small">
          Explore the Toolbox →
        </Link>
      </Reveal>
    </>
  );
}
