"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getDocHref,
  groupPages,
  projects,
} from "@/lib/docs/registry";
import type { DocProjectDefinition } from "@/lib/docs/types";

export function DocsSidebar({ project }: { project: DocProjectDefinition }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = groupPages(project);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const sidebarContent = (
    <>
      <div className="sidebar__section">
        <span className="sidebar__eyebrow">Projects</span>
        <div className="project-switcher">
          {projects.map((candidate) => (
            <Link
              key={candidate.slug}
              href={getDocHref(candidate.slug, "overview")}
              onClick={() => setOpen(false)}
              className={candidate.slug === project.slug ? "is-active" : undefined}
            >
              <span
                className="project-switcher__mark"
                style={{
                  "--switcher-accent-light": candidate.accent,
                  "--switcher-accent-dark": candidate.accentDark,
                } as CSSProperties}
              >
                {candidate.shortName}
              </span>
              <span>
                <strong>{candidate.name}</strong>
                <small>{candidate.status}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <nav className="sidebar__nav" aria-label={`${project.name} documentation`}>
        {Object.entries(groups).map(([group, pages]) => (
          <div className="sidebar__group" key={group}>
            <span>{group}</span>
            {pages.map((page) => {
              const href = getDocHref(project.slug, page.slug);
              const isActive =
                pathname === href || pathname === `${href}/`;

              return (
                <Link
                  key={page.slug}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={isActive ? "is-active" : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <Link
        className="sidebar__all-projects"
        href="/"
        onClick={() => setOpen(false)}
      >
        ← All projects
      </Link>
    </>
  );

  return (
    <>
      <div className="mobile-docs-bar">
        <button type="button" onClick={() => setOpen(true)}>
          <span aria-hidden="true">☰</span>
          Menu
        </button>
        <span>{project.name}</span>
      </div>

      {open ? (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className={`docs-sidebar${open ? " is-open" : ""}`}>
        <div className="sidebar__mobile-header">
          <strong>Documentation</strong>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
