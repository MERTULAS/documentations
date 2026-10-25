"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DireactreeHandle, NodePath, RevealOptions, TreeNode } from "direactree";
import { cloneProjectTree, type FileData } from "./sampleTree";
import {
  Choice,
  Demo,
  EventLog,
  JsonResult,
  SiteTree,
  Toggle,
  useEventLog,
} from "./DemoFrame";

const collapsedProject = (): TreeNode<FileData>[] => {
  const tree = cloneProjectTree();
  const close = (nodes: TreeNode<FileData>[]) => nodes.forEach((node) => {
    node.isExpanded = false;
    if (node.children) close(node.children);
  });
  close(tree);
  return tree;
};

/** Built-in field or your own input, filter or highlight, and a custom match. */
export function SearchDemo() {
  const [structure] = useState(collapsedProject);
  const [mode, setMode] = useState<"filter" | "highlight">("filter");
  const [builtIn, setBuiltIn] = useState(true);
  const [externalTerm, setExternalTerm] = useState("tsx");
  const [byExtension, setByExtension] = useState(false);
  const [lastTerm, setLastTerm] = useState("");
  const filterNode = useCallback(
    (node: TreeNode<FileData>, term: string) => (node.type === "file" && node.name.toLowerCase().endsWith(term.toLowerCase())),
    []
  );

  return (
    <Demo
      title="Search"
      description="Every folder starts closed. Folders that hold a match open on their own and close again when the search ends. Try tsx, use, or .css."
      controls={
        <div className="property-demo__control-stack">
          <Choice label="searchMode" options={["filter", "highlight"] as const} value={mode} onChange={setMode} />
          <Toggle checked={builtIn} label="showSearch" onChange={setBuiltIn} />
          <Toggle checked={byExtension} label="match file endings" onChange={setByExtension} />
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          {builtIn ? null : (
            <input
              className="demo-search-input"
              aria-label="Your own search field"
              value={externalTerm}
              onChange={(event) => setExternalTerm(event.target.value)}
              placeholder="Your own search field"
            />
          )}
          <SiteTree
            structure={structure}
            showToolbox={false}
            allowDragAndDrop={false}
            showSearch={builtIn}
            searchTerm={builtIn ? undefined : externalTerm}
            searchMode={mode}
            filterNode={byExtension ? filterNode : undefined}
            onSearchChange={setLastTerm}
          />
        </div>
        <JsonResult
          label="props in use"
          value={{
            showSearch: builtIn,
            searchTerm: builtIn ? `(built-in field: "${lastTerm}")` : externalTerm,
            searchMode: mode,
            filterNode: byExtension ? "(node, term) => node.name.endsWith(term)" : "default name match",
          }}
        />
      </div>
    </Demo>
  );
}

const revealTargets = [
  { id: "use-auth", label: "useAuth.ts" },
  { id: "robots", label: "robots.txt" },
  { id: "tooltip", label: "Tooltip.tsx" },
];

/** The ref handle: reveal, expand, collapse, focus. */
export function RevealDemo() {
  const [structure] = useState(collapsedProject);
  const ref = useRef<DireactreeHandle>(null);
  const [block, setBlock] = useState<NonNullable<RevealOptions["block"]>>("center");
  const [state, setState] = useState<{ selected: string[]; expanded: string[] }>({ selected: [], expanded: [] });

  const refresh = () => setState({
    selected: ref.current?.getSelectedIds() ?? [],
    expanded: ref.current?.getExpandedIds() ?? [],
  });

  return (
    <Demo
      title="Reveal a node from code"
      description="Each button calls ref.current.revealNode(id). The folders above it open, the row scrolls into view inside the small panel, and it gets selected."
      controls={<Choice label="block" options={["nearest", "center", "start"] as const} value={block} onChange={setBlock} />}
    >
      <div className="property-demo__stack">
        <div className="demo-button-row">
          {revealTargets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => {
                ref.current?.revealNode(target.id, { focus: true, block });
                setTimeout(refresh, 50);
              }}
            >
              revealNode(&quot;{target.id}&quot;)
            </button>
          ))}
          <button type="button" onClick={() => { ref.current?.expandAll(); setTimeout(refresh, 50); }}>expandAll()</button>
          <button type="button" onClick={() => { ref.current?.collapseAll(); setTimeout(refresh, 50); }}>collapseAll()</button>
          <button type="button" onClick={() => ref.current?.focus()}>focus()</button>
        </div>
        <div className="property-demo__split">
          <div className="property-demo__tree property-demo__tree--scroll">
            <SiteTree ref={ref} structure={structure} showToolbox={false} allowDragAndDrop={false} onSelectedNodeChange={() => setTimeout(refresh, 0)} />
          </div>
          <JsonResult label="getSelectedIds() / getExpandedIds()" value={state} />
        </div>
      </div>
    </Demo>
  );
}

/** Multiple selection, onNodeActivate, and type-ahead. */
export function SelectionDemo() {
  const [structure] = useState(cloneProjectTree);
  const [mode, setMode] = useState<"single" | "multiple">("multiple");
  const [ids, setIds] = useState<string[]>([]);
  const { entries, log, clear } = useEventLog(6);

  return (
    <Demo
      title="Selection, opening, and type-ahead"
      description="Ctrl/Cmd+click, Shift+click, Shift+arrows, and Ctrl/Cmd+A select several rows. Double click or press Enter to open a file. Type letters to jump."
      controls={
        <div className="property-demo__control-stack">
          <Choice label="selectionMode" options={["single", "multiple"] as const} value={mode} onChange={(value) => { setMode(value); setIds([]); }} />
          <button type="button" onClick={clear}>Clear log</button>
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            key={mode}
            structure={structure}
            selectionMode={mode}
            showToolbox={false}
            allowDragAndDrop={false}
            onSelectionChange={(next) => setIds(next)}
            onSelectedNodeChange={(node) => { if (mode === "single") setIds(node ? [node.id] : []); }}
            onNodeActivate={(node, path) => log(`onNodeActivate → ${pathText(path)}${node.type === "folder" ? " (folder toggled)" : ""}`)}
          />
        </div>
        <div className="property-demo__stack">
          <JsonResult label={mode === "multiple" ? "onSelectionChange ids" : "selected id"} value={ids} />
          <EventLog entries={entries} label="onNodeActivate" />
        </div>
      </div>
    </Demo>
  );
}

function pathText(path: NodePath): string {
  const parts: string[] = [];
  let current: NodePath | null = path;
  while (current) {
    parts.unshift(current.name);
    current = current.parent;
  }
  return parts.join("/");
}

const STORAGE_KEY = "direactree-docs-open-folders";

/** Controlled open folders, remembered between visits. */
export function ExpandedStateDemo() {
  const [structure] = useState(collapsedProject);
  const [expanded, setExpanded] = useState<string[]>(["app"]);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Storage exists only in the browser, so it is read after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setExpanded(JSON.parse(saved) as string[]);
    } catch {
      // Storage can be blocked; the tree still works.
    }
  }, []);

  const change = (ids: string[]) => {
    setExpanded(ids);
    if (!remember) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Ignore blocked storage.
    }
  };

  return (
    <Demo
      title="Controlled open folders"
      description="Open and close folders, then reload the page. With remember on, expandedIds comes back from localStorage."
      controls={
        <div className="property-demo__control-stack">
          <Toggle checked={remember} label="remember in localStorage" onChange={setRemember} />
          <button type="button" onClick={() => change([])}>Close all</button>
          <button type="button" onClick={() => change(["app", "src", "components", "hooks", "public"])}>Open all</button>
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            structure={structure}
            showToolbox={false}
            allowDragAndDrop={false}
            expandedIds={expanded}
            onExpandedChange={change}
          />
        </div>
        <JsonResult label="expandedIds" value={expanded} />
      </div>
    </Demo>
  );
}
