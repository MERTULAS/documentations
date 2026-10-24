"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Direactree from "direactree/next";
import type {
  DireactreeMessages,
  DireactreeMutation,
  DireactreeTheme,
  NodePath,
  SaveProps,
  TreeNode,
} from "direactree";
import { cloneSampleTree } from "./sampleTree";
import { applySave, removeNode } from "./treeOps";

function Demo({
  children,
  controls,
  description,
  native = false,
  title,
}: {
  children: ReactNode;
  controls?: ReactNode;
  description: string;
  /** Skip the docs palette so the package's own theme is shown. */
  native?: boolean;
  title: string;
}) {
  return (
    <section className={native ? "property-demo property-demo--native" : "property-demo"}>
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

function Choice<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
}) {
  return (
    <div role="group" aria-label={label} className="demo-choice">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// Without onSave and onDelete the toolbox buttons are disabled. Demos about
// presentation pass these so the buttons stay usable; nothing is persisted.
const noopHandlers = {
  onSave: () => undefined,
  onDelete: () => undefined,
};

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
      description="While true, every folder stays open. Switching back to false closes every folder."
      controls={<Toggle checked={expanded} label="isAllExpanded" onChange={setExpanded} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
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
      description="Toggle movement, then drag a node onto a folder. The tree does not change because this demo only records the move."
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
          {...noopHandlers}
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
          {...noopHandlers}
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
          {...noopHandlers}
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
      description="Drag a node onto a valid folder to inspect source and target payloads. Applying the move is the parent's job, so the tree does not change here."
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
    payload: NodePath | SaveProps | null;
  } | null>(null);

  const capture = (callback: string, payload: NodePath | SaveProps | null) => {
    setLastAction({ callback, payload });
  };

  return (
    <Demo
      title="Toolbox action callbacks"
      description="Select a node and use a toolbox icon. Create and rename report that the editor opened; onSave reports the confirmed name."
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
            onSave={(change) => capture("onSave", change)}
          />
        </div>
        <JsonResult label={lastAction?.callback ?? "last toolbox action"} value={lastAction?.payload ?? null} />
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

export function ThemeDemo() {
  const structure = useStableTree();
  const [theme, setTheme] = useState<DireactreeTheme>("dark");

  return (
    <Demo
      native
      title="Built-in themes"
      description="This demo skips the documentation palette to show the package colors. system follows the operating system setting."
      controls={
        <Choice
          label="theme"
          options={["system", "light", "dark"] as const}
          value={theme}
          onChange={setTheme}
        />
      }
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          {...noopHandlers}
          theme={theme}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

const turkishMessages: Partial<DireactreeMessages> = {
  directoryTree: "Dizin ağacı",
  createFolder: "Klasör oluştur",
  createFile: "Dosya oluştur",
  rename: "Yeniden adlandır",
  delete: "Sil",
  save: "Kaydet",
  cancel: "Vazgeç",
  newFolderName: "Yeni klasör adı",
  newFileName: "Yeni dosya adı",
  newItemName: "Yeni öğe adı",
  deleteTitle: "{name} silinsin mi?",
  deleteFolderDescription: "Bu klasör ve içindekiler silinecek.",
  deleteFileDescription: "Bu dosya silinecek.",
  deleting: "Siliniyor…",
  confirmDelete: "Silmeyi onayla",
  actionFailed: "Bir şeyler ters gitti.",
};

export function MessagesDemo() {
  const structure = useStableTree();
  const [translated, setTranslated] = useState(true);

  return (
    <Demo
      title="Custom messages"
      description="Hover a toolbox button, start a rename, or delete a node to see the replaced copy."
      controls={<Toggle checked={translated} label="Türkçe" onChange={setTranslated} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          {...noopHandlers}
          confirmDelete
          messages={translated ? turkishMessages : undefined}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export function ConfirmDeleteDemo() {
  const [structure, setStructure] = useState<TreeNode[]>(cloneSampleTree);
  const [confirm, setConfirm] = useState(true);

  return (
    <Demo
      title="Delete confirmation"
      description="Select a node and press delete. With confirmDelete, onDelete runs only after the user confirms."
      controls={
        <>
          <Toggle checked={confirm} label="confirmDelete" onChange={setConfirm} />
          <button type="button" onClick={() => setStructure(cloneSampleTree())}>Reset</button>
        </>
      }
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          confirmDelete={confirm}
          allowDragAndDrop={false}
          isAllExpanded
          onDelete={(node) => setStructure((current) => removeNode(current, node.id))}
        />
      </div>
    </Demo>
  );
}

export function AsyncCallbacksDemo() {
  const [structure, setStructure] = useState<TreeNode[]>(cloneSampleTree);
  const [fail, setFail] = useState(false);
  const [lastError, setLastError] = useState<{
    action: DireactreeMutation;
    message: string;
  } | null>(null);

  const handleSave = async (change: SaveProps) => {
    await wait(900);
    if (fail) throw new Error("The server rejected this name.");
    setStructure((current) => applySave(current, change));
  };

  const handleDelete = async (node: NodePath) => {
    await wait(900);
    if (fail) throw new Error("The server could not delete this node.");
    setStructure((current) => removeNode(current, node.id));
  };

  return (
    <Demo
      title="Async callbacks"
      description="Each request takes about a second and the controls stay disabled until it settles. A rejected request keeps the editor or confirmation open and shows the error."
      controls={
        <>
          <Toggle checked={fail} label="reject requests" onChange={setFail} />
          <button
            type="button"
            onClick={() => {
              setStructure(cloneSampleTree());
              setLastError(null);
            }}
          >
            Reset
          </button>
        </>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <Direactree
            structure={structure}
            confirmDelete
            allowDragAndDrop={false}
            isAllExpanded
            onSave={handleSave}
            onDelete={handleDelete}
            onActionError={(error, action) => {
              setLastError({
                action,
                message: error instanceof Error ? error.message : String(error),
              });
            }}
          />
        </div>
        <JsonResult label="onActionError" value={lastError} />
      </div>
    </Demo>
  );
}
