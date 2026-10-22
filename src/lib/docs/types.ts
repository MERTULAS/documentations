export type DocHeading = {
  id: string;
  label: string;
  level?: 2 | 3;
};

export type DocPageDefinition = {
  slug: string;
  label: string;
  description: string;
  group: string;
  headings: DocHeading[];
};

export type DocProjectDefinition = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  accent: string;
  accentDark: string;
  version: string;
  status: "Stable" | "Beta" | "Internal";
  repositoryUrl?: string;
  packageUrl?: string;
  pages: DocPageDefinition[];
};

export type DocRouteParams = {
  projectSlug: string;
  pageSlug?: string[];
};
