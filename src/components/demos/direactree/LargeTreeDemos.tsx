"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDireactree } from "direactree/next";
import type { DireactreeHandle, TreeNode } from "direactree";
import { countNodes, makeLargeTree, remoteTree } from "./sampleTree";
import {
  Choice,
  Demo,
  EventLog,
  JsonResult,
  Range,
  SiteTree,
  Toggle,
  useEventLog,
  wait,
} from "./DemoFrame";

let loadCount = 0;

/** Children arrive from a fake API the first time a folder opens. */
export function LazyLoadingDemo() {
  const tree = useDireactree(remoteTree);
  const [latency, setLatency] = useState(800);
  const [failNext, setFailNext] = useState(false);
  const { entries, log, clear } = useEventLog();
  // A new key on Reset forgets which folders were already requested.
  const [generation, setGeneration] = useState(0);

  const listFolder = async (folder: TreeNode): Promise<TreeNode[]> => {
    log(`→ api.list("${folder.id}")`);
    await wait(latency);
    if (failNext) {
      setFailNext(false);
      log(`✕ ${folder.name}: network error`);
      throw new Error("Network error. Press Retry.");
    }
    loadCount += 1;
    const children: TreeNode[] = [
      { id: `${folder.id}/images-${loadCount}`, name: "images", type: "folder", hasChildren: true },
      { id: `${folder.id}/docs-${loadCount}`, name: "docs", type: "folder", hasChildren: true },
      { id: `${folder.id}/readme-${loadCount}`, name: "README.md", type: "file" },
      { id: `${folder.id}/data-${loadCount}`, name: "data.json", type: "file" },
    ];
    log(`✓ ${folder.name}: ${children.length} items`);
    return children;
  };

  return (
    <Demo
      title="Lazy loading"
      description="Open a folder. The first open calls onLoadChildren, shows a loading row, and stores the result with tree.loadChildren. Turn on 'fail next request' to see the error row and Retry."
      controls={
        <div className="property-demo__control-stack">
          <Range label="latency" min={0} max={2500} step={100} value={latency} onChange={setLatency} suffix=" ms" />
          <Toggle checked={failNext} label="fail next request" onChange={setFailNext} />
          <button type="button" onClick={() => { tree.reset(); clear(); setGeneration((value) => value + 1); }}>Reset</button>
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            key={generation}
            structure={tree.structure}
            showToolbox={false}
            allowDragAndDrop={false}
            onLoadChildren={(node) => tree.loadChildren(node, listFolder)}
            onActionError={(_error, action) => log(`onActionError(…, "${action}")`)}
          />
        </div>
        <EventLog entries={entries} label="requests" />
      </div>
    </Demo>
  );
}

const sizes = { "1,000": [10, 99], "10,000": [100, 99], "50,000": [250, 199] } as const;
type Size = keyof typeof sizes;

/** Only the rows in view are in the DOM. */
export function VirtualizationDemo() {
  const [size, setSize] = useState<Size>("10,000");
  const [virtual, setVirtual] = useState(true);
  const structure = useMemo(() => makeLargeTree(sizes[size][0], sizes[size][1]), [size]);
  const total = useMemo(() => countNodes(structure), [structure]);
  const ref = useRef<DireactreeHandle>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(0);

  useEffect(() => {
    const element = wrapper.current;
    if (!element) return undefined;
    const count = () => setRendered(element.querySelectorAll('[role="treeitem"]').length);
    count();
    const observer = new MutationObserver(count);
    observer.observe(element, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [virtual, size]);

  const blocked = !virtual && size !== "1,000";
  const last = sizes[size][0] - 1;

  return (
    <Demo
      title="Virtualization"
      description="Use the arrow keys, Home, End, or the buttons. The counter shows how many rows are in the page right now. Without virtualized, the larger trees are left off so the page stays responsive."
      controls={
        <div className="property-demo__control-stack">
          <Choice label="nodes" options={Object.keys(sizes) as Size[]} value={size} onChange={setSize} />
          <Toggle checked={virtual} label="virtualized" onChange={setVirtual} />
        </div>
      }
    >
      <div className="property-demo__stack">
        <div className="demo-button-row">
          <button type="button" onClick={() => ref.current?.expandAll()}>expandAll()</button>
          <button type="button" onClick={() => ref.current?.collapseAll()}>collapseAll()</button>
          <button type="button" onClick={() => ref.current?.revealNode(`pkg-${last}-file-42`, { block: "center", focus: true })}>
            revealNode(&quot;pkg-{last}-file-42&quot;)
          </button>
        </div>
        <div className="property-demo__split">
          <div className="property-demo__tree" ref={wrapper}>
            {blocked ? (
              <p className="demo-note">Turn virtualized back on, or pick 1,000 nodes.</p>
            ) : (
              <SiteTree
                key={`${size}-${virtual}`}
                ref={ref}
                structure={structure}
                showToolbox={false}
                allowDragAndDrop={false}
                showSearch
                virtualized={virtual ? { height: 340 } : false}
              />
            )}
          </div>
          <JsonResult label="live numbers" value={{ nodesInTree: total, rowsInDom: rendered, virtualized: virtual }} />
        </div>
      </div>
    </Demo>
  );
}
