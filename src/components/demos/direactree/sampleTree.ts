import type { TreeNode } from "direactree";

export const sampleTree: TreeNode[] = [
  {
    id: "0",
    name: "Desktop",
    type: "folder",
    children: [
      {
        id: "1",
        name: "Projects",
        type: "folder",
        children: [
          {
            id: "1.1",
            name: "Web Applications",
            type: "folder",
            children: [
              { id: "sample.txt", name: "project-notes.txt", type: "file" },
              { id: "example.json", name: "config.json", type: "file" },
              { id: "sample.ts", name: "utils.ts", type: "file" },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Documents",
        type: "folder",
        children: [
          { id: "REST-API.md", name: "REST-API.md", type: "file" },
        ],
      },
      { id: "DireactreeUsage.tsx", name: "DireactreeUsage.tsx", type: "file" },
    ],
  },
];

export function cloneSampleTree(): TreeNode[] {
  return JSON.parse(JSON.stringify(sampleTree)) as TreeNode[];
}

/** Your own fields travel in `TreeNode.data`. */
export type FileData = {
  git?: "M" | "A" | "D" | "U";
  errors?: number;
  size?: string;
};

export const projectTree: TreeNode<FileData>[] = [
  {
    id: "app",
    name: "my-app",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "src",
        name: "src",
        type: "folder",
        isExpanded: true,
        children: [
          {
            id: "components",
            name: "components",
            type: "folder",
            isExpanded: true,
            children: [
              { id: "button", name: "Button.tsx", type: "file", data: { git: "M", errors: 2, size: "3.1 KB" } },
              { id: "modal", name: "Modal.tsx", type: "file", data: { git: "A", size: "5.8 KB" } },
              { id: "tooltip", name: "Tooltip.tsx", type: "file", data: { size: "1.2 KB" } },
            ],
          },
          { id: "hooks", name: "hooks", type: "folder", children: [{ id: "use-auth", name: "useAuth.ts", type: "file", data: { git: "U", size: "0.9 KB" } }] },
          { id: "index", name: "index.ts", type: "file", data: { size: "0.4 KB" } },
          { id: "styles", name: "styles.css", type: "file", data: { git: "M", size: "2.2 KB" } },
        ],
      },
      {
        id: "public",
        name: "public",
        type: "folder",
        children: [
          { id: "logo", name: "logo.svg", type: "file", data: { size: "4.0 KB" } },
          { id: "robots", name: "robots.txt", type: "file", data: { size: "0.1 KB" } },
        ],
      },
      { id: "node_modules", name: "node_modules", type: "folder", locked: true, children: [] },
      { id: "package", name: "package.json", type: "file", data: { git: "M", size: "1.4 KB" } },
      { id: "readme", name: "README.md", type: "file", data: { size: "2.7 KB" } },
    ],
  },
];

export function cloneProjectTree(): TreeNode<FileData>[] {
  return JSON.parse(JSON.stringify(projectTree)) as TreeNode<FileData>[];
}

/** `folders` folders with `filesPerFolder` files each, plus the root. */
export function makeLargeTree(folders: number, filesPerFolder: number): TreeNode[] {
  return [
    {
      id: "large-root",
      name: "monorepo",
      type: "folder",
      isExpanded: true,
      children: Array.from({ length: folders }, (_, f) => ({
        id: `pkg-${f}`,
        name: `package-${String(f).padStart(3, "0")}`,
        type: "folder" as const,
        isExpanded: f < 3,
        children: Array.from({ length: filesPerFolder }, (_, i) => ({
          id: `pkg-${f}-file-${i}`,
          name: `module-${String(i).padStart(3, "0")}.ts`,
          type: "file" as const,
        })),
      })),
    },
  ];
}

export function countNodes(nodes: TreeNode[]): number {
  return nodes.reduce((total, node) => total + 1 + (node.children ? countNodes(node.children) : 0), 0);
}

export const remoteTree: TreeNode[] = [
  { id: "bucket", name: "s3://assets", type: "folder", hasChildren: true },
  { id: "drive", name: "Shared drive", type: "folder", hasChildren: true },
];
