"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Direactree from "direactree/next";
import type { NodePath, SaveProps, TreeNode } from "direactree";
import { cloneSampleTree } from "./sampleTree";

function Demo({
  children,
  controls,
  description,
  title,
}: {
  children: ReactNode;
  controls?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="property-demo">
      <header className="property-demo__header">
        <div>
          <span>TRY IT</span>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        {controls ? <div className="property-demo__controls">{controls}</div> : null}
      </header>
      <div className="property-demo__body">{children}</div>
    </section>
  );
}

function JsonResult({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="property-demo__result" aria-live="polite">
      <span>{label}</span>
      <pre>{JSON.stringify(value, null, 2) ?? "null"}</pre>
    </div>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="demo-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function useStableTree() {
  const [structure] = useState<TreeNode[]>(cloneSampleTree);
  return structure;
}

export function StructureDemo() {
  const [structure, setStructure] = useState<TreeNode[]>(cloneSampleTree);

  const addExampleFile = () => {
    setStructure((current) => [
      ...current,
      {
        id: `example-${current.length}`,
        name: `new-file-${current.length}.ts`,
        type: "file",
      },
    ]);
  };

  return (
    <Demo
      title="Structure input"
      description="Change the TreeNode array and see the rendered hierarchy update."
      controls={
        <>
          <button type="button" onClick={addExampleFile}>Add root file</button>
          <button type="button" onClick={() => setStructure(cloneSampleTree())}>Reset</button>
        </>
      }
    >
      <div className="property-demo__split">
        <JsonResult label="structure" value={structure} />
        <div className="property-demo__tree">
          <Direactree
            structure={structure}
            showToolbox={false}
            allowDragAndDrop={false}
            isAllExpanded
          />
        </div>
      </div>
    </Demo>
  );
}

export function IndentDemo() {
  const structure = useStableTree();
  const [indent, setIndent] = useState(20);

  return (
    <Demo
      title="Indent spacing"
      description="Move the slider to compare compact and spacious hierarchy levels."
      controls={
        <label className="demo-range">
          <input
            type="range"
            min="8"
            max="50"
            value={indent}
            onChange={(event) => setIndent(Number(event.target.value))}
          />
          <code>{indent}px</code>
        </label>
      }
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          indent={indent}
          showToolbox={false}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export function ExpandedDemo() {
  const structure = useStableTree();
  const [expanded, setExpanded] = useState(true);

  return (
    <Demo
      title="Initial expansion"
      description="The tree remounts when the value changes because this prop controls the initial render."
      controls={<Toggle checked={expanded} label="isAllExpanded" onChange={setExpanded} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          key={String(expanded)}
          structure={structure}
          isAllExpanded={expanded}
          showToolbox={false}
          allowDragAndDrop={false}
        />
      </div>
    </Demo>
  );
}

export function DragAndDropDemo() {
  const structure = useStableTree();
  const [enabled, setEnabled] = useState(true);
  const [lastMove, setLastMove] = useState<{
    source: TreeNode;
    target: TreeNode;
  } | null>(null);

  return (
    <Demo
      title="Drag and drop"
      description="Toggle movement, then drag a node onto a folder."
      controls={<Toggle checked={enabled} label="allowDragAndDrop" onChange={setEnabled} />}
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <Direactree
            structure={structure}
            allowDragAndDrop={enabled}
            showToolbox={false}
            isAllExpanded
            onNodeMove={(source, target) => setLastMove({ source, target })}
          />
        </div>
        <JsonResult label="last valid move" value={lastMove} />
      </div>
    </Demo>
  );
}

export function ToolboxVisibilityDemo() {
  const structure = useStableTree();
  const [visible, setVisible] = useState(true);

  return (
    <Demo
      title="Toolbox visibility"
      description="Hide or reveal the built-in create, rename, and delete controls."
      controls={<Toggle checked={visible} label="showToolbox" onChange={setVisible} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          showToolbox={visible}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export function StickyToolboxDemo() {
  const structure = useStableTree();
  const [sticky, setSticky] = useState(true);

  return (
    <Demo
      title="Sticky toolbox"
      description="Scroll inside the constrained area and compare the toolbox position."
      controls={<Toggle checked={sticky} label="toolboxSticky" onChange={setSticky} />}
    >
      <div className="property-demo__tree property-demo__tree--scroll">
        <Direactree
          structure={structure}
          toolboxSticky={sticky}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export function ToolboxIconsDemo() {
  const structure = useStableTree();
  const [custom, setCustom] = useState(true);
  const toolboxIcons = custom
    ? {
        createFolder: <span aria-label="Create folder">[F+]</span>,
        createFile: <span aria-label="Create file">[+]</span>,
        rename: <span aria-label="Rename">[E]</span>,
        delete: <span aria-label="Delete">[X]</span>,
      }
    : undefined;

  return (
    <Demo
      title="Custom toolbox icons"
      description="Switch between Direactree defaults and custom React nodes."
      controls={<Toggle checked={custom} label="custom icons" onChange={setCustom} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          toolboxIcons={toolboxIcons}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export function ClassNameDemo() {
  const structure = useStableTree();
  const [framed, setFramed] = useState(true);

  return (
    <Demo
      title="Custom root class"
      description="Apply a presentation class without changing Direactree behavior."
      controls={<Toggle checked={framed} label="elegant frame" onChange={setFramed} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          className={framed ? "direactree-demo-highlight" : undefined}
          showToolbox={false}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export function SelectionCallbackDemo() {
  const structure = useStableTree();
  const [selectedNode, setSelectedNode] = useState<NodePath | null>(null);

  return (
    <Demo
      title="Selection callback"
      description="Select a file or folder to inspect the complete NodePath."
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <Direactree
            structure={structure}
            showToolbox={false}
            allowDragAndDrop={false}
            isAllExpanded
            onSelectedNodeChange={setSelectedNode}
          />
        </div>
        <JsonResult label="selectedNode" value={selectedNode} />
      </div>
    </Demo>
  );
}

export function NodeMoveCallbackDemo() {
  const structure = useStableTree();
  const [sourceNode, setSourceNode] = useState<TreeNode | null>(null);
  const [targetNode, setTargetNode] = useState<TreeNode | null>(null);

  return (
    <Demo
      title="Move callback"
      description="Drag a node onto a valid folder to inspect source and target payloads."
    >
      <div className="property-demo__stack">
        <div className="property-demo__tree property-demo__tree--solo">
          <Direactree
            structure={structure}
            showToolbox={false}
            isAllExpanded
            onNodeMove={(source, target) => {
              setSourceNode(source);
              setTargetNode(target);
            }}
          />
        </div>
        <div className="property-demo__results-row">
          <JsonResult label="sourceNode" value={sourceNode} />
          <JsonResult label="targetNode" value={targetNode} />
        </div>
      </div>
    </Demo>
  );
}

export function ToolboxCallbacksDemo() {
  const structure = useStableTree();
  const [lastAction, setLastAction] = useState<{
    callback: string;
    node: NodePath | null;
  } | null>(null);

  const capture = (callback: string, node: NodePath | null) => {
    setLastAction({ callback, node });
  };

  return (
    <Demo
      title="Toolbox action callbacks"
      description="Select a node and use a toolbox icon to inspect the action and NodePath."
      controls={
        <button type="button" onClick={() => setLastAction(null)}>Clear result</button>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <Direactree
            structure={structure}
            allowDragAndDrop={false}
            isAllExpanded
            onCreateFolder={(node) => capture("onCreateFolder", node)}
            onCreateFile={(node) => capture("onCreateFile", node)}
            onRename={(node) => capture("onRename", node)}
            onDelete={(node) => capture("onDelete", node)}
          />
        </div>
        <JsonResult label={lastAction?.callback ?? "last toolbox action"} value={lastAction?.node ?? null} />
      </div>
    </Demo>
  );
}

export function SaveCallbackDemo() {
  const structure = useStableTree();
  const [saveProps, setSaveProps] = useState<SaveProps | null>(null);

  return (
    <Demo
      title="Save callback"
      description="Start a create or rename action, enter a name, and confirm it."
      controls={
        <button type="button" onClick={() => setSaveProps(null)}>Clear result</button>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <Direactree
            structure={structure}
            allowDragAndDrop={false}
            isAllExpanded
            onSave={setSaveProps}
          />
        </div>
        <JsonResult label="saveProps" value={saveProps} />
      </div>
    </Demo>
  );
}
