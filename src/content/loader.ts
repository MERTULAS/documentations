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
  "direactree/tree-updates": () => import("./direactree/tree-updates.mdx"),
  "direactree/validation": () => import("./direactree/validation.mdx"),
  "direactree/navigation": () => import("./direactree/navigation.mdx"),
  "direactree/customization": () =>
    import("./direactree/customization.mdx"),
  "direactree/large-trees": () => import("./direactree/large-trees.mdx"),
  "direactree/upgrading": () => import("./direactree/upgrading.mdx"),
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
