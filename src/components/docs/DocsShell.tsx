import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  getAdjacentPages,
  getDocHref,
} from "@/lib/docs/registry";
import type {
  DocPageDefinition,
  DocProjectDefinition,
} from "@/lib/docs/types";
import { DocsSidebar } from "./DocsSidebar";

export function DocsShell({
  children,
  page,
  project,
}: {
  children: ReactNode;
  page: DocPageDefinition;
  project: DocProjectDefinition;
}) {
  const adjacentPages = getAdjacentPages(project, page);
  const projectStyle = {
    "--project-accent-light": project.accent,
    "--project-accent-dark": project.accentDark,
  } as CSSProperties;

  return (
    <div className="project-theme" style={projectStyle}>
      <SiteHeader />
      <div className="docs-layout">
        <DocsSidebar project={project} />

        <main className="docs-main">
          <div className="docs-content-grid">
            <div className="docs-article-column">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <Link href="/">Projects</Link>
                <span>/</span>
                <Link href={getDocHref(project.slug, "overview")}>
                  {project.name}
                </Link>
                <span>/</span>
                <span aria-current="page">{page.label}</span>
              </nav>

              <article className="docs-prose">{children}</article>

              <nav className="doc-pager" aria-label="Documentation pages">
                {adjacentPages.previous ? (
                  <Link
                    href={getDocHref(project.slug, adjacentPages.previous.slug)}
                  >
                    <small>Previous</small>
                    <strong>← {adjacentPages.previous.label}</strong>
                  </Link>
                ) : (
                  <span />
                )}
                {adjacentPages.next ? (
                  <Link
                    className="doc-pager__next"
                    href={getDocHref(project.slug, adjacentPages.next.slug)}
                  >
                    <small>Next</small>
                    <strong>{adjacentPages.next.label} →</strong>
                  </Link>
                ) : null}
              </nav>
            </div>

            {page.headings.length ? (
              <aside className="table-of-contents">
                <strong>On this page</strong>
                <nav aria-label="On this page">
                  {page.headings.map((heading) => (
                    <a
                      key={heading.id}
                      className={heading.level === 3 ? "is-nested" : undefined}
                      href={`#${heading.id}`}
                    >
                      {heading.label}
                    </a>
                  ))}
                </nav>
              </aside>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
