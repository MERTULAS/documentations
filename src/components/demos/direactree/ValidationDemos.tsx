"use client";

import { useMemo, useState } from "react";
import { useDireactree, validateName } from "direactree/next";
import type { NodePath, NodePermissions, TreeNode } from "direactree";
import { cloneSampleTree } from "./sampleTree";
import {
  Demo,
  EventLog,
  JsonResult,
  Range,
  SiteTree,
  Toggle,
  useEventLog,
} from "./DemoFrame";

/** The editor checks names as you type. */
export function NameRulesDemo() {
  const tree = useDireactree(cloneSampleTree);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [maxLength, setMaxLength] = useState(40);
  const [needExtension, setNeedExtension] = useState(true);
  const [checksOn, setChecksOn] = useState(true);

  return (
    <Demo
      title="Name checks in the editor"
      description='Select "Web Applications", create a file, and try "   ", "a/b", "..", "Config.JSON", or "notes". Save stays disabled while the name is invalid.'
      controls={
        <div className="property-demo__control-stack">
          <Toggle checked={checksOn} label="checks on" onChange={setChecksOn} />
          <Toggle checked={caseSensitive} label="caseSensitive" onChange={setCaseSensitive} />
          <Toggle checked={needExtension} label="files need an extension" onChange={setNeedExtension} />
          <Range label="maxLength" min={5} max={60} value={maxLength} onChange={setMaxLength} />
        </div>
      }
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <SiteTree
          structure={tree.structure}
          onSave={tree.save}
          onDelete={tree.remove}
          isAllExpanded
          allowDragAndDrop={false}
          nameRules={{ caseSensitive, maxLength }}
          validateName={checksOn
            ? (name, { type }) => (needExtension && type === "file" && !/\.\w+$/.test(name) ? "Add a file extension, such as .ts" : null)
            : false}
        />
      </div>
    </Demo>
  );
}

const siblings: TreeNode[] = [
  { id: "a", name: "README.md", type: "file" },
  { id: "b", name: "src", type: "folder", children: [] },
];

/** The same check as a plain function, for your own forms and your API. */
export function ValidateNameDemo() {
  const [name, setName] = useState("readme.md");
  const [invalidChars, setInvalidChars] = useState("");
  const result = useMemo(
    () => validateName(name, {
      siblings,
      rules: invalidChars ? { invalidChars } : undefined,
    }),
    [name, invalidChars]
  );

  return (
    <Demo
      title="validateName()"
      description="Type a name. The folder already holds README.md and src. Add your own forbidden characters to replace the default set."
    >
      <div className="property-demo__split">
        <div className="property-demo__tree demo-form">
          <label>
            <span>name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>rules.invalidChars (leave empty for the default)</span>
            <input value={invalidChars} placeholder={'/ \\ : * ? " < > |'} onChange={(event) => setInvalidChars(event.target.value)} />
          </label>
          <code className="demo-form__call">
            {`validateName(${JSON.stringify(name)}, { siblings${invalidChars ? `, rules: { invalidChars: ${JSON.stringify(invalidChars)} }` : ""} })`}
          </code>
        </div>
        <JsonResult label="result" value={result} />
      </div>
    </Demo>
  );
}

const conflictTree: TreeNode[] = [
  {
    id: "drafts",
    name: "drafts",
    type: "folder",
    children: [
      { id: "draft-notes", name: "notes.md", type: "file" },
      { id: "draft-plan", name: "plan.md", type: "file" },
    ],
  },
  {
    id: "published",
    name: "published",
    type: "folder",
    children: [{ id: "pub-notes", name: "Notes.md", type: "file" }],
  },
];

/** A drop that would create two items with the same name is refused. */
export function MoveConflictDemo() {
  const tree = useDireactree(conflictTree);
  const { entries, log, clear } = useEventLog();

  return (
    <Demo
      title="Move conflicts"
      description='Drag drafts/notes.md into "published". It already holds Notes.md, so the drop is refused and onNodeMove never runs. plan.md moves fine.'
      controls={<button type="button" onClick={() => { tree.reset(); clear(); }}>Reset</button>}
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            structure={tree.structure}
            isAllExpanded
            allowReorder
            showToolbox={false}
            onNodeMove={(node, target, info) => {
              log(`onNodeMove(${node.name} → ${info.parentId ?? "root"}, ${info.position}, index ${info.index})`);
              tree.move(node, target, info);
            }}
          />
        </div>
        <EventLog entries={entries} label="onNodeMove calls" />
      </div>
    </Demo>
  );
}

const permissionTree: TreeNode[] = [
  {
    id: "workspace",
    name: "workspace",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "shared",
        name: "shared (read-only)",
        type: "folder",
        isExpanded: true,
        children: [{ id: "policy", name: "policy.pdf", type: "file" }],
      },
      {
        id: "mine",
        name: "my files",
        type: "folder",
        isExpanded: true,
        children: [
          { id: "draft", name: "draft.docx", type: "file" },
          { id: "env", name: ".env", type: "file" },
        ],
      },
      { id: "vendor", name: "vendor", type: "folder", locked: true, children: [{ id: "lib", name: "lib.js", type: "file" }] },
    ],
  },
];

/** Locked nodes, per-node permissions, and a rule function. */
export function PermissionsDemo() {
  const tree = useDireactree(permissionTree);
  const [protectRoot, setProtectRoot] = useState(true);
  const [readOnlyShared, setReadOnlyShared] = useState(true);
  const [pinDotFiles, setPinDotFiles] = useState(true);
  const [selected, setSelected] = useState<NodePath | null>(null);

  const getNodePermissions = (node: TreeNode, path: NodePath): Partial<NodePermissions> => {
    if (protectRoot && path.parent === null) {
      return { rename: false, delete: false, move: false };
    }
    if (readOnlyShared && (node.id === "shared" || path.parent?.id === "shared")) {
      return { rename: false, delete: false, move: false, drop: false, createChild: false };
    }
    if (pinDotFiles && node.name.startsWith(".")) {
      return { move: false, delete: false };
    }
    return {};
  };

  const resolved = selected ? (() => {
    const node = tree.find(selected.id);
    if (!node) return null;
    const base = node.locked
      ? { rename: false, delete: false, move: false, drop: false, createChild: false }
      : { rename: true, delete: true, move: true, drop: true, createChild: true };
    return { id: node.id, locked: Boolean(node.locked), permissions: { ...base, ...node.permissions, ...getNodePermissions(node, selected) } };
  })() : null;

  return (
    <Demo
      title="Permissions"
      description="Select rows and watch the toolbox, dragging, Delete, and F2 follow the rules. vendor is locked with locked: true."
      controls={
        <div className="property-demo__control-stack">
          <Toggle checked={protectRoot} label="protect the root" onChange={setProtectRoot} />
          <Toggle checked={readOnlyShared} label="shared is read-only" onChange={setReadOnlyShared} />
          <Toggle checked={pinDotFiles} label="pin dotfiles" onChange={setPinDotFiles} />
          <button type="button" onClick={() => tree.reset()}>Reset</button>
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            structure={tree.structure}
            onSave={tree.save}
            onDelete={tree.remove}
            onNodeMove={tree.move}
            onSelectedNodeChange={setSelected}
            getNodePermissions={getNodePermissions}
            contextMenu
            allowReorder
          />
        </div>
        <JsonResult label="selected node permissions" value={resolved} />
      </div>
    </Demo>
  );
}
