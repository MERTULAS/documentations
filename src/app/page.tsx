import type { CSSProperties } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getDocHref, projects } from "@/lib/docs/registry";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="home">
        <section className="home-hero">
          <span className="eyebrow">OPEN-SOURCE DOCUMENTATION</span>
          <h1>Build with clarity.</h1>
          <p>
            Guides, interactive examples, and API references for projects by
            Mert Ulas—all in one focused workspace.
          </p>
          <div className="home-hero__actions">
            <Link className="button button--primary" href="/docs/direactree">
              Explore Direactree
            </Link>
            <a
              className="button button--secondary"
              href="https://github.com/MERTULAS"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub
            </a>
          </div>
        </section>

        <section className="project-catalog" aria-labelledby="projects-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PROJECTS</span>
              <h2 id="projects-title">Choose a project</h2>
            </div>
            <p>Each project keeps its own guides and reference navigation.</p>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article
                className="project-card"
                key={project.slug}
                style={{
                  "--card-accent-light": project.accent,
                  "--card-accent-dark": project.accentDark,
                } as CSSProperties}
              >
                <div className="project-card__top">
                  <span className="project-card__mark">{project.shortName}</span>
                  <span className="status-badge">{project.status}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-card__meta">
                  <span>v{project.version}</span>
                  <span>{project.pages.length} pages</span>
                </div>
                <Link href={getDocHref(project.slug, "overview")}>
                  Open documentation <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="home-principles">
          <div>
            <span>01</span>
            <h3>Practical first</h3>
            <p>Copyable examples sit next to the concepts they explain.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Easy to navigate</h3>
            <p>Every page has a stable URL and a predictable place.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Built to grow</h3>
            <p>New projects plug into one shared documentation system.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Mert Ulas</span>
        <span>Documentation that stays close to the code.</span>
      </footer>
    </>
  );
}
