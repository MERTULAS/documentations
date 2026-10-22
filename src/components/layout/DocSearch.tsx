"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDocHref, projects } from "@/lib/docs/registry";

const searchablePages = projects.flatMap((project) =>
  project.pages.map((page) => ({
    project: project.name,
    label: page.label,
    description: page.description,
    href: getDocHref(project.slug, page.slug),
    searchText: `${project.name} ${page.label} ${page.description}`.toLowerCase(),
  })),
);

export function DocSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
  };

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return searchablePages;
    return searchablePages.filter((item) =>
      item.searchText.includes(normalizedQuery),
    );
  }, [query]);

  return (
    <>
      <button
        className="search-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
      >
        <span aria-hidden="true">⌕</span>
        <span className="search-trigger__label">Search docs</span>
        <kbd>⌘ K</kbd>
      </button>

      {open ? (
        <div
          className="search-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
        >
          <section
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
          >
            <div className="search-dialog__input">
              <span aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects and pages…"
              />
              <button type="button" onClick={closeSearch}>
                Esc
              </button>
            </div>

            <div className="search-results">
              {results.length ? (
                results.map((result) => (
                  <Link
                    key={result.href}
                    href={result.href}
                    onClick={closeSearch}
                  >
                    <span>{result.project}</span>
                    <strong>{result.label}</strong>
                    <small>{result.description}</small>
                  </Link>
                ))
              ) : (
                <p className="search-empty">No documentation page found.</p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
