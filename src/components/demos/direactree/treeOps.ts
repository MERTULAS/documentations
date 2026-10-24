import type { SaveProps, TreeNode } from "direactree";

// Direactree 0.2 never changes `structure` itself. These helpers build the next
// tree from a callback payload; each returns a new array and leaves the input intact.

function cloneTree(nodes: TreeNode[]): TreeNode[] {
  return JSON.parse(JSON.stringify(nodes)) as TreeNode[];
}

export function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = node.children ? findNode(node.children, id) : undefined;
    if (nested) return nested;
  }
}

function detachNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  const index = nodes.findIndex((node) => node.id === id);
  if (index >= 0) return nodes.splice(index, 1)[0];

  for (const node of nodes) {
    const removed = node.children ? detachNode(node.children, id) : undefined;
    if (removed) return removed;
  }
}

export function applySave(nodes: TreeNode[], change: SaveProps): TreeNode[] {
  const next = cloneTree(nodes);

  if (change.actionType === "edit" && change.selectedNode) {
    const node = findNode(next, change.selectedNode.id);
    if (node) node.name = change.newName;
    return next;
  }

  const newNode: TreeNode = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: change.newName,
    type: change.createType ?? "file",
    ...(change.createType === "folder" ? { children: [] } : {}),
  };
  const parent = change.selectedNode
    ? findNode(next, change.selectedNode.id)
    : undefined;

  if (parent?.type === "folder") {
    parent.children = [...(parent.children ?? []), newNode];
  } else {
    next.push(newNode);
  }

  return next;
}

export function removeNode(nodes: TreeNode[], id: string): TreeNode[] {
  const next = cloneTree(nodes);
  detachNode(next, id);
  return next;
}

export function moveNode(nodes: TreeNode[], sourceId: string, targetId: string): TreeNode[] {
  const next = cloneTree(nodes);
  const moved = detachNode(next, sourceId);
  const target = findNode(next, targetId);
  if (!moved || target?.type !== "folder") return nodes;

  target.children = [...(target.children ?? []), moved];
  return next;
}
