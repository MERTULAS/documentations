"use client";

import { useRef, useState } from "react";
import { useDireactree } from "direactree/next";
import type { DireactreeHandle, NodePath, TreeNode } from "direactree";
import { cloneSampleTree } from "./sampleTree";
import { FileIcon } from "./CustomizationDemos";
import { SiteTree } from "./DemoFrame";

const minimalExample = `"use client";

import Direactree, { useDireactree } from "direactree/next";
import "direactree/direactree.css"; // once, for example in layout.tsx

export function FileExplorer({ initialStructure }) {
  const tree = useDireactree(initialStructure, { sort: "foldersFirst" });

  return (
    <Direactree
      structure={tree.structure}
      onSave={tree.save}
      onDelete={tree.remove}
      onNodeMove={tree.move}
      allowReorder
      confirmDelete
      showSearch
      contextMenu
      renderIcon={(node, { expanded }) => <FileIcon node={node} expanded={expanded} />}
      getNodePermissions={(node, path) =>
        path.parent === null ? { rename: false, delete: false, move: false } : {}
      }
      onNodeActivate={(node) => openFile(node.id)}
    />
  );
}`;

export default function DireactreePlayground() {
  const tree = useDireactree(cloneSampleTree, { sort: "foldersFirst" });
  const ref = useRef<DireactreeHandle>(null);
  const [preview, setPreview] = useState<{ name: string; content: string } | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [generation, setGeneration] = useState(0);

  const openFile = async (node: TreeNode) => {
    if (node.type !== "file") return;
    setPreview({ name: node.name, content: "Loading…" });
    try {
      const response = await fetch(`/mock-data/${node.id}`);
      if (!response.ok) throw new Error("File not found");
      setPreview({ name: node.name, content: await response.text() });
    } catch {
      setPreview({ name: node.name, content: "Content is not available for this file." });
    }
  };

  // When the previewed file leaves `structure`, Direactree clears the selection;
  // the preview follows the selection here.
  const handleSelectedNodeChange = (node: NodePath | null) => {
    if (!node) setPreview(null);
  };

  return (
    <div className="demo-card">
      <div className="demo-card__header">
        <div>
          <span>LIVE PLAYGROUND</span>
          <strong>Editable file explorer</strong>
        </div>
        <button
          type="button"
          onClick={() => {
            tree.reset();
            setPreview(null);
            setGeneration((value) => value + 1);
          }}
        >
          Reset tree
        </button>
      </div>

      <div className="explorer-demo">
        <section className="explorer-demo__tree">
          <SiteTree
            key={generation}
            ref={ref}
            structure={tree.structure}
            defaultExpandedIds={["0", "1", "1.1", "2"]}
            toolboxSticky
            allowReorder
            confirmDelete
            showSearch
            contextMenu={(node, defaults) => (node.type === "file"
              ? [{ id: "open", label: "Open preview", onSelect: (target) => openFile(target) }, "separator", ...defaults]
              : defaults)}
            renderIcon={(node, { expanded }) => <FileIcon node={node} expanded={expanded} />}
            getNodePermissions={(_node, path) => (path.parent === null ? { rename: false, delete: false, move: false } : {})}
            toolboxActions={[
              { id: "expand", label: "Expand all", icon: "⊞", onClick: () => ref.current?.expandAll() },
              { id: "collapse", label: "Collapse all", icon: "⊟", onClick: () => ref.current?.collapseAll() },
            ]}
            onSelectedNodeChange={handleSelectedNodeChange}
            onNodeActivate={openFile}
            onSave={tree.save}
            onDelete={tree.remove}
            onNodeMove={tree.move}
          />
        </section>

        <section className="explorer-demo__preview">
          <div className="preview-title">
            <span className="preview-title__dots" aria-hidden="true">•••</span>
            <strong>{preview?.name ?? "Double click a file"}</strong>
          </div>
          <pre>{preview?.content ?? "Double click a file, press Enter on it, or right-click and choose Open preview."}</pre>
        </section>
      </div>

      <div className="demo-card__footer">
        <button type="button" onClick={() => setShowCode((current) => !current)}>
          {showCode ? "Hide the code" : "Show the code"}
        </button>
        <span>Changes stay in your browser and are not persisted.</span>
      </div>

      {showCode ? (
        <pre className="demo-source"><code>{minimalExample}</code></pre>
      ) : null}
    </div>
  );
}
