"use client";

import { useState } from "react";
import {
  applySave,
  compareFoldersFirst,
  insertNode,
  moveNode,
  removeNode,
  renameNode,
  sortChildren,
  updateNode,
  useDireactree,
} from "direactree/next";
import type { NodePath, SaveProps, TreeNode } from "direactree";
import { cloneSampleTree } from "./sampleTree";
import {
  Choice,
  CodeResult,
  Demo,
  EventLog,
  JsonResult,
  SiteTree,
  Toggle,
  useEventLog,
  wait,
} from "./DemoFrame";

/** The whole explorer with three props and no helper code. */
export function HookBasicsDemo() {
  const [sort, setSort] = useState<"none" | "foldersFirst">("none");
  const tree = useDireactree(cloneSampleTree, { sort });

  return (
    <Demo
      title="useDireactree, wired straight in"
      description="Create, rename, delete, and drag nodes. The JSON on the right is tree.structure. Try sort: foldersFirst, then create a file and a folder."
      controls={
        <>
          <Choice label="sort" options={["none", "foldersFirst"] as const} value={sort} onChange={setSort} />
          <button type="button" onClick={() => tree.reset()}>Reset</button>
        </>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            structure={tree.structure}
            onSave={tree.save}
            onDelete={tree.remove}
            onNodeMove={tree.move}
            allowReorder
            isAllExpanded
          />
        </div>
        <JsonResult label="tree.structure" value={tree.structure} />
      </div>
    </Demo>
  );
}

const fakeServer = {
  nextId: 100,
  async create(change: SaveProps) {
    await wait(700);
    return { id: `server-${(this.nextId += 1)}`, name: change.newName };
  },
};

/** The backend answers first; the hook applies the change afterwards. */
export function HookBackendDemo() {
  const tree = useDireactree(cloneSampleTree);
  const [fail, setFail] = useState(false);
  const { entries, log, clear } = useEventLog();

  const handleSave = async (change: SaveProps) => {
    log(`→ api.${change.actionType === "create" ? "create" : "rename"}("${change.newName}")`);
    await wait(700);
    if (fail) {
      log("✕ server error, the editor stays open");
      throw new Error("The server is unavailable.");
    }
    if (change.actionType === "create") {
      const saved = await fakeServer.create(change);
      tree.save(change, { id: saved.id });
      log(`✓ created with id ${saved.id}`);
    } else {
      tree.save(change);
      log("✓ renamed");
    }
  };

  const handleDelete = async (node: NodePath) => {
    log(`→ api.delete("${node.id}")`);
    await wait(700);
    if (fail) {
      log("✕ server error, nothing was removed");
      throw new Error("The server is unavailable.");
    }
    tree.remove(node);
    log("✓ removed");
  };

  return (
    <Demo
      title="Wait for the backend, then update"
      description="Each request takes 0.7 s. The tree changes only after the fake API answers, and a new node gets the id the server returned."
      controls={
        <>
          <Toggle checked={fail} label="server fails" onChange={setFail} />
          <button type="button" onClick={() => { tree.reset(); clear(); }}>Reset</button>
        </>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            structure={tree.structure}
            onSave={handleSave}
            onDelete={handleDelete}
            onNodeMove={tree.move}
            confirmDelete
            isAllExpanded
          />
        </div>
        <EventLog entries={entries} label="requests" />
      </div>
    </Demo>
  );
}

type HelperName = "insertNode" | "renameNode" | "updateNode" | "moveNode" | "removeNode" | "sortChildren" | "applySave";

const helperCalls: Record<HelperName, { code: string; run: (nodes: TreeNode[]) => TreeNode[] }> = {
  insertNode: {
    code: 'insertNode(nodes, "2", { id: "notes", name: "notes.md", type: "file" })',
    run: (nodes) => insertNode(nodes, "2", { id: `notes-${Date.now()}`, name: "notes.md", type: "file" }),
  },
  renameNode: {
    code: 'renameNode(nodes, "sample.ts", "helpers.ts")',
    run: (nodes) => renameNode(nodes, "sample.ts", "helpers.ts"),
  },
  updateNode: {
    code: 'updateNode(nodes, "2", { isExpanded: true, locked: true })',
    run: (nodes) => updateNode(nodes, "2", { isExpanded: true, locked: true }),
  },
  moveNode: {
    code: 'moveNode(nodes, "REST-API.md", "1.1", 0)',
    run: (nodes) => moveNode(nodes, "REST-API.md", "1.1", 0),
  },
  removeNode: {
    code: 'removeNode(nodes, "example.json")',
    run: (nodes) => removeNode(nodes, "example.json"),
  },
  sortChildren: {
    code: 'sortChildren(nodes, "0", compareFoldersFirst)',
    run: (nodes) => sortChildren(nodes, "0", compareFoldersFirst),
  },
  applySave: {
    code: 'applySave(nodes, { actionType: "create", createType: "folder", newName: "assets", selectedNode: null })',
    run: (nodes) => applySave(nodes, { actionType: "create", createType: "folder", newName: "assets", selectedNode: null }),
  },
};

/** The pure helpers behind the hook, for Redux, Zustand, or your own state. */
export function PureHelpersDemo() {
  const [nodes, setNodes] = useState<TreeNode[]>(cloneSampleTree);
  const [last, setLast] = useState<{ code: string; changed: boolean } | null>(null);

  const run = (name: HelperName) => {
    const call = helperCalls[name];
    const next = call.run(nodes);
    setLast({ code: call.code, changed: next !== nodes });
    setNodes(next);
  };

  return (
    <Demo
      title="Pure tree helpers"
      description="Each button calls one exported helper on the current tree. A helper returns the same array when nothing changes, so running one twice shows changed: false."
      controls={<button type="button" onClick={() => { setNodes(cloneSampleTree()); setLast(null); }}>Reset</button>}
    >
      <div className="property-demo__stack">
        <div className="demo-button-row">
          {(Object.keys(helperCalls) as HelperName[]).map((name) => (
            <button key={name} type="button" onClick={() => run(name)}>{name}</button>
          ))}
        </div>
        <div className="property-demo__split">
          <div className="property-demo__tree">
            <SiteTree structure={nodes} showToolbox={false} allowDragAndDrop={false} isAllExpanded />
          </div>
          <CodeResult
            label="last call"
            code={last ? `${last.code}\n\n// returned a new array: ${last.changed}` : "Pick a helper above."}
          />
        </div>
      </div>
    </Demo>
  );
}
