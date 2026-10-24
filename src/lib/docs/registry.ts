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
    version: "0.2.0",
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
        description: "Install the package and render your first tree.",
        group: "Start here",
        headings: [
          { id: "installation", label: "Installation" },
          { id: "framework-imports", label: "Framework imports" },
          { id: "your-first-tree", label: "Your first tree" },
          { id: "state-ownership", label: "State ownership" },
          { id: "upgrading-from-01", label: "Upgrading from 0.1" },
        ],
      },
      {
        slug: "examples",
        label: "Interactive example",
        description: "Explore selection, editing, and drag-and-drop behavior.",
        group: "Guides",
        headings: [
          { id: "file-explorer-demo", label: "File explorer demo" },
          { id: "operations-to-try", label: "Operations to try" },
          { id: "implementation-notes", label: "Implementation notes" },
          { id: "persisting-changes", label: "Persisting changes" },
        ],
      },
      {
        slug: "theming",
        label: "Theming & accessibility",
        description: "Themes, CSS variables, keyboard, and screen-reader support.",
        group: "Guides",
        headings: [
          { id: "stylesheet", label: "Stylesheet" },
          { id: "built-in-themes", label: "Built-in themes" },
          { id: "css-variables", label: "CSS variables" },
          { id: "keyboard", label: "Keyboard" },
          { id: "screen-readers", label: "Screen readers" },
          { id: "motion-and-contrast", label: "Motion and contrast" },
        ],
      },
      {
        slug: "api-reference",
        label: "Props & callbacks",
        description: "Every prop, callback, type, default, and behavior note.",
        group: "Reference",
        headings: [
          { id: "props-overview", label: "Props overview" },
          { id: "structure", label: "structure" },
          { id: "display-and-interaction", label: "Display & interaction" },
          { id: "confirmdelete", label: "confirmDelete", level: 3 },
          { id: "theme-and-copy", label: "Theme & copy" },
          { id: "messages", label: "messages", level: 3 },
          { id: "event-callbacks", label: "Event callbacks" },
          { id: "onselectednodechange", label: "onSelectedNodeChange", level: 3 },
          { id: "onnodemove", label: "onNodeMove", level: 3 },
          { id: "toolbox-action-callbacks", label: "Toolbox actions", level: 3 },
          { id: "onsave", label: "onSave", level: 3 },
          { id: "async-callbacks-and-errors", label: "Async & errors", level: 3 },
          { id: "complete-types", label: "Complete types" },
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
