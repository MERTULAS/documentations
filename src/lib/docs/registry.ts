import type {
  DocPageDefinition,
  DocProjectDefinition,
  DocRouteParams,
} from "./types";

export const projects: DocProjectDefinition[] = [
  {
    slug: "direactree",
    name: "Direactree",
    shortName: "DT",
    description:
      "A React component for displaying and editing directory structures.",
    accent: "#88572f",
    accentDark: "#d7aa7d",
    version: "0.4.0",
    status: "Stable",
    repositoryUrl: "https://github.com/MERTULAS/direactree",
    packageUrl: "https://www.npmjs.com/package/direactree",
    pages: [
      {
        slug: "overview",
        label: "Overview",
        description: "What Direactree offers and when to use it.",
        group: "Start here",
        headings: [
          { id: "why-direactree", label: "Why Direactree" },
          { id: "how-it-works", label: "How it works" },
          { id: "core-features", label: "Core features" },
          { id: "safety-guarantees", label: "Safety guarantees" },
        ],
      },
      {
        slug: "getting-started",
        label: "Getting started",
        description: "Install the package, add the stylesheet, and render an editable tree.",
        group: "Start here",
        headings: [
          { id: "installation", label: "Installation" },
          { id: "stylesheet", label: "Stylesheet" },
          { id: "framework-imports", label: "Framework imports" },
          { id: "your-first-tree", label: "Your first tree" },
          { id: "make-it-editable", label: "Make it editable" },
          { id: "state-ownership", label: "State ownership" },
          { id: "next-steps", label: "Next steps" },
        ],
      },
      {
        slug: "examples",
        label: "Interactive example",
        description: "A complete file explorer with every feature turned on.",
        group: "Start here",
        headings: [
          { id: "file-explorer-demo", label: "File explorer demo" },
          { id: "operations-to-try", label: "Operations to try" },
          { id: "how-it-is-built", label: "How it is built" },
          { id: "persisting-changes", label: "Persisting changes" },
        ],
      },
      {
        slug: "tree-updates",
        label: "useDireactree & helpers",
        description: "Ready-made tree updates for the callbacks and your own state.",
        group: "Guides",
        headings: [
          { id: "wire-it-straight-in", label: "Wire it straight in" },
          { id: "after-the-backend-answers", label: "After the backend answers" },
          { id: "update-first-roll-back-on-failure", label: "Optimistic updates", level: 3 },
          { id: "hook-reference", label: "Hook reference" },
          { id: "pure-helpers", label: "Pure helpers" },
        ],
      },
      {
        slug: "validation",
        label: "Names & permissions",
        description: "Name checks, move conflicts, locked nodes, and per-node permissions.",
        group: "Guides",
        headings: [
          { id: "name-checks", label: "Name checks" },
          { id: "namerules", label: "nameRules", level: 3 },
          { id: "validatename", label: "validateName", level: 3 },
          { id: "the-same-check-as-a-function", label: "As a function", level: 3 },
          { id: "move-conflicts", label: "Move conflicts" },
          { id: "permissions", label: "Permissions" },
        ],
      },
      {
        slug: "navigation",
        label: "Search & navigation",
        description: "Search, reveal from code, multiple selection, open folders, keyboard.",
        group: "Guides",
        headings: [
          { id: "search", label: "Search" },
          { id: "reveal-from-code", label: "Reveal from code" },
          { id: "selection", label: "Selection" },
          { id: "multiple-selection", label: "Multiple selection", level: 3 },
          { id: "opening-a-file", label: "Opening a file", level: 3 },
          { id: "open-folders", label: "Open folders" },
          { id: "keyboard", label: "Keyboard" },
        ],
      },
      {
        slug: "customization",
        label: "Rows, menus & toolbox",
        description: "Icons, badges, labels, the context menu, and toolbox actions.",
        group: "Guides",
        headings: [
          { id: "your-own-data", label: "Your own data" },
          { id: "row-slots", label: "Row slots" },
          { id: "context-menu", label: "Context menu" },
          { id: "toolbox-actions", label: "Toolbox actions" },
        ],
      },
      {
        slug: "large-trees",
        label: "Large trees",
        description: "Lazy loading and virtualization for big hierarchies.",
        group: "Guides",
        headings: [
          { id: "lazy-loading", label: "Lazy loading" },
          { id: "virtualization", label: "Virtualization" },
        ],
      },
      {
        slug: "theming",
        label: "Styling & accessibility",
        description: "Appearance, CSS tokens, data attributes, classNames, and accessibility.",
        group: "Guides",
        headings: [
          { id: "stylesheet", label: "Stylesheet" },
          { id: "theme-appearance-density", label: "Theme, appearance, density" },
          { id: "css-tokens", label: "CSS tokens" },
          { id: "one-color-or-two", label: "One color or two", level: 3 },
          { id: "token-list", label: "Token list", level: 3 },
          { id: "state-attributes", label: "State attributes" },
          { id: "classnames", label: "classNames" },
          { id: "screen-readers", label: "Screen readers" },
          { id: "motion-and-contrast", label: "Motion and contrast" },
        ],
      },
      {
        slug: "api-reference",
        label: "Props & callbacks",
        description: "Every prop, callback, ref method, type, and export.",
        group: "Reference",
        headings: [
          { id: "props-overview", label: "Props overview" },
          { id: "structure", label: "structure" },
          { id: "display-and-interaction", label: "Display & interaction" },
          { id: "allowdraganddrop-and-allowreorder", label: "Drag & reorder", level: 3 },
          { id: "confirmdelete", label: "confirmDelete", level: 3 },
          { id: "theme-and-copy", label: "Theme & copy" },
          { id: "messages", label: "messages", level: 3 },
          { id: "event-callbacks", label: "Event callbacks" },
          { id: "onnodemove", label: "onNodeMove", level: 3 },
          { id: "onsave", label: "onSave", level: 3 },
          { id: "async-callbacks-and-errors", label: "Async & errors", level: 3 },
          { id: "ref-handle", label: "Ref handle" },
          { id: "complete-types", label: "Complete types" },
          { id: "exports", label: "Exports" },
        ],
      },
      {
        slug: "upgrading",
        label: "Upgrading",
        description: "Changes from 0.3, 0.2, and 0.1, and how to update.",
        group: "Reference",
        headings: [
          { id: "from-03-to-04", label: "From 0.3 to 0.4" },
          { id: "from-02-to-03", label: "From 0.2 to 0.3" },
          { id: "from-01-to-02", label: "From 0.1 to 0.2" },
        ],
      },
    ],
  },
  {
    slug: "docs-hub",
    name: "Docs Hub",
    shortName: "DH",
    description:
      "The architecture and contribution guide for this documentation portal.",
    accent: "#3f6c62",
    accentDark: "#88b9ab",
    version: "1.0",
    status: "Internal",
    repositoryUrl:
      "https://github.com/MERTULAS/direactree-documentation",
    pages: [
      {
        slug: "overview",
        label: "Overview",
        description: "How the shared documentation portal is organized.",
        group: "Portal",
        headings: [
          { id: "architecture", label: "Architecture" },
          { id: "content-flow", label: "Content flow" },
          { id: "design-principles", label: "Design principles" },
        ],
      },
      {
        slug: "adding-a-project",
        label: "Adding a project",
        description: "Register a project and publish its documentation.",
        group: "Contributing",
        headings: [
          { id: "create-the-content", label: "Create the content" },
          { id: "register-the-project", label: "Register the project" },
          { id: "register-the-loader", label: "Register the loader" },
          { id: "validate-the-output", label: "Validate the output" },
        ],
      },
    ],
  },
];

export function getProject(slug: string): DocProjectDefinition | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getPage(
  project: DocProjectDefinition,
  pageSlug?: string[],
): DocPageDefinition | undefined {
  const slug = pageSlug?.join("/") || "overview";
  return project.pages.find((page) => page.slug === slug);
}

export function getDocHref(projectSlug: string, pageSlug: string): string {
  return pageSlug === "overview"
    ? `/docs/${projectSlug}`
    : `/docs/${projectSlug}/${pageSlug}`;
}

export function getAllDocParams(): DocRouteParams[] {
  return projects.flatMap((project) =>
    project.pages.map((page) => ({
      projectSlug: project.slug,
      pageSlug: page.slug === "overview" ? undefined : page.slug.split("/"),
    })),
  );
}

export function getAdjacentPages(
  project: DocProjectDefinition,
  page: DocPageDefinition,
) {
  const index = project.pages.findIndex((candidate) => candidate.slug === page.slug);

  return {
    previous: index > 0 ? project.pages[index - 1] : undefined,
    next: index < project.pages.length - 1 ? project.pages[index + 1] : undefined,
  };
}

export function groupPages(project: DocProjectDefinition) {
  return project.pages.reduce<Record<string, DocPageDefinition[]>>(
    (groups, page) => {
      groups[page.group] ??= [];
      groups[page.group].push(page);
      return groups;
    },
    {},
  );
}
