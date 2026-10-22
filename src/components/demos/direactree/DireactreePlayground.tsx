"use client";

import { useState } from "react";
import Direactree from "direactree/next";
import type { NodePath, SaveProps, TreeNode } from "direactree";
import { cloneSampleTree } from "./sampleTree";

const minimalExample = `"use client";

import { useState } from "react";
import Direactree from "direactree/next";

export function FileExplorer() {
  const [structure, setStructure] = useState(initialStructure);

  return (
    <Direactree
      structure={structure}
      isAllExpanded
      showToolbox
      onSelectedNodeChange={(node) => console.log(node)}
      onSave={(change) => persistChange(change)}
      onNodeMove={(node, parent) => moveNode(node, parent)}
    />
  );
}`;

function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = node.children ? findNode(node.children, id) : undefined;
    if (nested) return nested;
  }
}

function removeNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  const index = nodes.findIndex((node) => node.id === id);
  if (index >= 0) return nodes.splice(index, 1)[0];

  for (const node of nodes) {
    if (!node.children) continue;
    const removed = removeNode(node.children, id);
    if (removed) return removed;
  }
}

export default function DireactreePlayground() {
  const [structure, setStructure] = useState<TreeNode[]>(cloneSampleTree);
  const [selectedNode, setSelectedNode] = useState<NodePath | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [showCode, setShowCode] = useState(false);

  const handleSelectedNodeChange = async (node: NodePath | null) => {
    setSelectedNode(node);

    if (node?.type !== "file") {
      setFileContent("");
      return;
    }

    setFileContent("Loading…");
    try {
      const response = await fetch(`/mock-data/${node.id}`);
      if (!response.ok) throw new Error("File not found");
      setFileContent(await response.text());
    } catch {
      setFileContent("Content is not available for this file.");
    }
  };

  const handleDelete = (node: NodePath) => {
    setStructure((current) => {
      const next = JSON.parse(JSON.stringify(current)) as TreeNode[];
      removeNode(next, node.id);
      return next;
    });

    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
      setFileContent("");
    }
  };

  const handleSave = (change: SaveProps) => {
    setStructure((current) => {
      const next = JSON.parse(JSON.stringify(current)) as TreeNode[];

      if (change.actionType === "edit" && change.selectedNode) {
        const node = findNode(next, change.selectedNode.id);
        if (node) node.name = change.newName;
        return next;
      }

      if (change.actionType === "create") {
        const newNode: TreeNode = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: change.newName,
          type: change.createType!,
          ...(change.createType === "folder" ? { children: [] } : {}),
        };
        const parent = change.selectedNode
          ? findNode(next, change.selectedNode.id)
          : undefined;

        if (parent?.type === "folder") {
          parent.children ??= [];
          parent.children.push(newNode);
        } else {
          next.push(newNode);
        }
      }

      return next;
    });
  };

  const handleNodeMove = (node: TreeNode, newParent: TreeNode | null) => {
    setStructure((current) => {
      const next = JSON.parse(JSON.stringify(current)) as TreeNode[];
      const movedNode = removeNode(next, node.id);
      if (!movedNode) return current;

      if (!newParent) {
        next.push(movedNode);
        return next;
      }

      const target = findNode(next, newParent.id);
      if (!target || target.type !== "folder") return current;
      target.children ??= [];
      target.children.push(movedNode);
      return next;
    });
  };

  return (
    <div className="demo-card">
      <div className="demo-card__header">
        <div>
          <span>LIVE PLAYGROUND</span>
          <strong>Editable file explorer</strong>
        </div>
        <button type="button" onClick={() => setStructure(cloneSampleTree())}>
          Reset tree
        </button>
      </div>

      <div className="explorer-demo">
        <section className="explorer-demo__tree">
          <Direactree
            structure={structure}
            indent={20}
            showToolbox
            toolboxSticky
            allowDragAndDrop
            isAllExpanded
            onSelectedNodeChange={handleSelectedNodeChange}
            onCreateFolder={() => undefined}
            onCreateFile={() => undefined}
            onRename={() => undefined}
            onDelete={handleDelete}
            onSave={handleSave}
            onNodeMove={handleNodeMove}
          />
        </section>

        <section className="explorer-demo__preview">
          <div className="preview-title">
            <span className="preview-title__dots" aria-hidden="true">•••</span>
            <strong>{selectedNode?.name ?? "Select a file"}</strong>
          </div>
          <pre>{fileContent || "Choose a file in the tree to preview its content."}</pre>
        </section>
      </div>

      <div className="demo-card__footer">
        <button type="button" onClick={() => setShowCode((current) => !current)}>
          {showCode ? "Hide minimal example" : "Show minimal example"}
        </button>
        <span>Changes stay in your browser and are not persisted.</span>
      </div>

      {showCode ? (
        <pre className="demo-source"><code>{minimalExample}</code></pre>
      ) : null}
    </div>
  );
}
