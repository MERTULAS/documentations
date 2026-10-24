"use client";

import { useState } from "react";
import Direactree from "direactree/next";
import type { NodePath, SaveProps, TreeNode } from "direactree";
import { cloneSampleTree } from "./sampleTree";
import { applySave, moveNode, removeNode } from "./treeOps";

const minimalExample = `"use client";

import { useState } from "react";
import Direactree from "direactree/next";

export function FileExplorer() {
  // Direactree only reports intent. The tree changes when this state changes.
  const [structure, setStructure] = useState(initialStructure);

  return (
    <Direactree
      structure={structure}
      isAllExpanded
      confirmDelete
      onSelectedNodeChange={(node) => console.log(node)}
      onSave={async (change) => {
        await api.save(change);
        setStructure(await api.fetchTree());
      }}
      onDelete={async (node) => {
        await api.remove(node.id);
        setStructure(await api.fetchTree());
      }}
      onNodeMove={async (node, target) => {
        await api.move(node.id, target.id);
        setStructure(await api.fetchTree());
      }}
    />
  );
}`;

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

  // When the selected node leaves `structure`, Direactree clears the selection
  // and calls onSelectedNodeChange(null), which also clears the preview.
  const handleDelete = (node: NodePath) => {
    setStructure((current) => removeNode(current, node.id));
  };

  const handleSave = (change: SaveProps) => {
    setStructure((current) => applySave(current, change));
  };

  const handleNodeMove = (node: TreeNode, target: TreeNode) => {
    setStructure((current) => moveNode(current, node.id, target.id));
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
            confirmDelete
            onSelectedNodeChange={handleSelectedNodeChange}
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
