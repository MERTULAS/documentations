import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getDocHref, projects } from "@/lib/docs/registry";

export const metadata: Metadata = {
  title: "All projects",
  description: "Browse all projects available in the documentation portal.",
};

export default function DocsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="directory-page">
        <span className="eyebrow">DOCUMENTATION DIRECTORY</span>
        <h1>All projects</h1>
        <p>Select a project to open its guides and API reference.</p>

        <div className="directory-list">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={getDocHref(project.slug, "overview")}
            >
              <span
                className="project-switcher__mark"
                style={{
                  "--switcher-accent-light": project.accent,
                  "--switcher-accent-dark": project.accentDark,
                } as CSSProperties}
              >
                {project.shortName}
              </span>
              <span>
                <strong>{project.name}</strong>
                <small>{project.description}</small>
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
