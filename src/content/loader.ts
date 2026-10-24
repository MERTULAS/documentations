import type { ComponentType } from "react";

type MdxModule = {
  default: ComponentType;
};

const contentLoaders: Record<string, () => Promise<MdxModule>> = {
  "direactree/overview": () => import("./direactree/overview.mdx"),
  "direactree/getting-started": () =>
    import("./direactree/getting-started.mdx"),
  "direactree/examples": () => import("./direactree/examples.mdx"),
  "direactree/api-reference": () =>
    import("./direactree/api-reference.mdx"),
  "direactree/theming": () => import("./direactree/theming.mdx"),
  "docs-hub/overview": () => import("./docs-hub/overview.mdx"),
  "docs-hub/adding-a-project": () =>
    import("./docs-hub/adding-a-project.mdx"),
};

export async function loadDocContent(projectSlug: string, pageSlug: string) {
  const loader = contentLoaders[`${projectSlug}/${pageSlug}`];

  if (!loader) {
    return undefined;
  }

  return loader();
}
