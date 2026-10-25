"use client";

import { useRef, useState } from "react";
import { useDireactree } from "direactree/next";
import type { ContextMenuEntry, DireactreeHandle, NodePath, TreeNode } from "direactree";
import { cloneProjectTree, type FileData } from "./sampleTree";
import {
  Choice,
  CodeResult,
  Demo,
  EventLog,
  SiteTree,
  Toggle,
  useEventLog,
} from "./DemoFrame";

const extensionColors: Record<string, string> = {
  tsx: "#3178c6",
  ts: "#3178c6",
  css: "#a855f7",
  json: "#ca8a04",
  md: "#0f766e",
  svg: "#ea580c",
  txt: "#64748b",
};

export function FileIcon({ node, expanded }: { node: TreeNode; expanded: boolean }) {
  if (node.type === "folder") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d={expanded ? "M1.5 4.5v8h11l2-6h-11l-2 6" : "M1.5 3.5h4l1.5 1.5h7.5v8h-13z"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  const extension = node.name.split(".").pop() ?? "";
  return (
    <span className="demo-file-icon" style={{ background: extensionColors[extension] ?? "#64748b" }}>
      {extension.slice(0, 2).toUpperCase()}
    </span>
  );
}

const gitLabels = { M: "modified", A: "added", D: "deleted", U: "untracked" } as const;

export function FileBadges({ node }: { node: TreeNode<FileData> }) {
  if (!node.data?.errors && !node.data?.git) return null;
  return (
    <>
      {node.data.errors ? <span className="demo-badge demo-badge--error" title={`${node.data.errors} errors`}>{node.data.errors}</span> : null}
      {node.data.git ? <span className={`demo-git demo-git--${node.data.git}`} title={gitLabels[node.data.git]}>{node.data.git}</span> : null}
    </>
  );
}

/** renderIcon, renderBadge, renderLabel, and getRowClassName. */
export function RowSlotsDemo() {
  const tree = useDireactree(cloneProjectTree);
  const [icons, setIcons] = useState(true);
  const [badges, setBadges] = useState(true);
  const [labels, setLabels] = useState(true);
  const [rowClass, setRowClass] = useState(true);

  const code = [
    "<Direactree<FileData>",
    "  structure={structure}",
    icons ? "  renderIcon={(node, { expanded }) => <FileIcon node={node} expanded={expanded} />}" : null,
    badges ? "  renderBadge={(node) => <FileBadges node={node} />}" : null,
    labels ? "  renderLabel={(node, { highlighted }) => <>{highlighted}<small>{node.data?.size}</small></>}" : null,
    rowClass ? '  getRowClassName={(node) => node.data?.git === "M" ? "row-modified" : undefined}' : null,
    "/>",
  ].filter(Boolean).join("\n");

  return (
    <Demo
      title="Icons, badges, labels, row classes"
      description="Your fields live in TreeNode.data. Turn each slot on and off to see what it controls."
      controls={
        <div className="property-demo__control-stack">
          <Toggle checked={icons} label="renderIcon" onChange={setIcons} />
          <Toggle checked={badges} label="renderBadge" onChange={setBadges} />
          <Toggle checked={labels} label="renderLabel" onChange={setLabels} />
          <Toggle checked={rowClass} label="getRowClassName" onChange={setRowClass} />
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree<FileData>
            structure={tree.structure}
            onSave={tree.save}
            onDelete={tree.remove}
            onNodeMove={tree.move}
            showSearch
            renderIcon={icons ? (node, { expanded }) => <FileIcon node={node} expanded={expanded} /> : undefined}
            renderBadge={badges ? (node) => <FileBadges node={node} /> : undefined}
            renderLabel={labels ? (node, { highlighted }) => (
              <>
                {highlighted}
                {node.data?.size ? <small className="demo-size">{node.data.size}</small> : null}
              </>
            ) : undefined}
            getRowClassName={rowClass ? (node) => (node.data?.git === "M" ? "demo-row-modified" : undefined) : undefined}
          />
        </div>
        <CodeResult label="props" code={code} />
      </div>
    </Demo>
  );
}

/** Built-in and custom context menu items. */
export function ContextMenuDemo() {
  const tree = useDireactree(cloneProjectTree);
  const [mode, setMode] = useState<"off" | "built-in" | "custom">("custom");
  const { entries, log, clear } = useEventLog();

  const pathOf = (path: NodePath) => {
    const parts: string[] = [];
    let current: NodePath | null = path;
    while (current) {
      parts.unshift(current.name);
      current = current.parent;
    }
    return parts.join("/");
  };

  const custom = (node: TreeNode<FileData>, defaults: ContextMenuEntry<FileData>[]): ContextMenuEntry<FileData>[] => [
    ...defaults,
    "separator",
    {
      id: "copy-path",
      label: "Copy path",
      icon: "⧉",
      onSelect: (_target, path) => {
        navigator.clipboard?.writeText(pathOf(path)).catch(() => undefined);
        log(`Copy path → ${pathOf(path)}`);
      },
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: "⎘",
      disabled: node.type === "folder",
      onSelect: (target, path) => {
        const copy = { ...target, id: `${target.id}-copy-${Date.now()}`, name: target.name.replace(/(\.\w+)?$/, " copy$1") };
        tree.insert(path.parent?.id ?? null, copy);
        log(`Duplicate → ${copy.name}`);
      },
    },
  ];

  return (
    <Demo
      title="Context menu"
      description="Right-click a row, or focus it and press Shift+F10 or the menu key. Arrow keys move through the items and Escape closes the menu."
      controls={
        <div className="property-demo__control-stack">
          <Choice label="contextMenu" options={["off", "built-in", "custom"] as const} value={mode} onChange={setMode} />
          <button type="button" onClick={() => { tree.reset(); clear(); }}>Reset</button>
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree<FileData>
            structure={tree.structure}
            onSave={tree.save}
            onDelete={tree.remove}
            confirmDelete
            allowDragAndDrop={false}
            contextMenu={mode === "off" ? false : mode === "built-in" ? true : custom}
          />
        </div>
        <EventLog entries={entries} label="custom items" />
      </div>
    </Demo>
  );
}

/** Extra toolbox buttons that read the selection. */
export function ToolboxActionsDemo() {
  const tree = useDireactree(cloneProjectTree);
  const ref = useRef<DireactreeHandle>(null);
  const { entries, log, clear } = useEventLog();

  return (
    <Demo
      title="Toolbox actions"
      description="Four extra buttons after the built-in ones. Each receives the focused node and every selected id. Ctrl/Cmd+click to select several files, then delete them at once."
      controls={<button type="button" onClick={() => { tree.reset(); clear(); }}>Reset</button>}
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree<FileData>
            ref={ref}
            structure={tree.structure}
            onSave={tree.save}
            onDelete={tree.remove}
            allowDragAndDrop={false}
            selectionMode="multiple"
            toolboxActions={[
              { id: "expand", label: "Expand all", icon: "⊞", onClick: () => { ref.current?.expandAll(); log("Expand all"); } },
              { id: "collapse", label: "Collapse all", icon: "⊟", onClick: () => { ref.current?.collapseAll(); log("Collapse all"); } },
              {
                id: "delete-selected",
                label: "Delete selected",
                icon: "✕",
                disabled: (_node, ids) => ids.length < 2,
                onClick: (_node, ids) => {
                  ids.forEach((id) => tree.remove({ id }));
                  log(`Delete selected → ${ids.length} nodes`);
                },
              },
              {
                id: "info",
                label: "Show info",
                icon: "ⓘ",
                disabled: (node) => node === null,
                onClick: (node, ids) => log(`Show info → focused ${node?.name}, ${ids.length} selected`),
              },
            ]}
          />
        </div>
        <EventLog entries={entries} label="toolboxActions" />
      </div>
    </Demo>
  );
}
