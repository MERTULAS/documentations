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
