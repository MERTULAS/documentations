"use client";

import { useState } from "react";
import Direactree, { useDireactree } from "direactree/next";
import type {
  DireactreeAppearance,
  DireactreeDensity,
  DireactreeMessages,
  DireactreeMutation,
  DireactreeTheme,
  MoveInfo,
  NodePath,
  SaveProps,
  TreeNode,
} from "direactree";
import { cloneSampleTree } from "./sampleTree";
import {
  Choice,
  Demo,
  JsonResult,
  SiteTree,
  Toggle,
  noopHandlers,
  useStableTree,
  wait,
} from "./DemoFrame";

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
          <SiteTree
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
      description="Move the slider to compare compact and spacious hierarchy levels. The value is the full space added per level."
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
        <SiteTree
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
      title="Expand every folder"
      description="While true, every folder stays open. Switching back to false closes every folder."
      controls={<Toggle checked={expanded} label="isAllExpanded" onChange={setExpanded} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <SiteTree
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
  const tree = useDireactree(cloneSampleTree);
  const [enabled, setEnabled] = useState(true);
  const [reorder, setReorder] = useState(true);
  const [lastMove, setLastMove] = useState<{ node: string; target: string; info: MoveInfo } | null>(null);

  return (
    <Demo
      title="Drag and drop"
      description="Drag a node onto a folder, or between rows when allowReorder is on. The move is applied with useDireactree().move."
      controls={
        <>
          <Toggle checked={enabled} label="allowDragAndDrop" onChange={setEnabled} />
          <Toggle checked={reorder} label="allowReorder" onChange={setReorder} />
          <button type="button" onClick={() => tree.reset()}>Reset</button>
        </>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
            structure={tree.structure}
            allowDragAndDrop={enabled}
            allowReorder={reorder}
            showToolbox={false}
            isAllExpanded
            onNodeMove={(node, target, info) => {
              setLastMove({ node: node.name, target: target.name, info });
              tree.move(node, target, info);
            }}
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
        <SiteTree
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
        <SiteTree
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
        createFolder: <span>F+</span>,
        createFile: <span>+</span>,
        rename: <span>Aa</span>,
        delete: <span>✕</span>,
      }
    : undefined;

  return (
    <Demo
      title="Custom toolbox icons"
      description="Switch between the built-in SVG icons and your own React nodes."
      controls={<Toggle checked={custom} label="custom icons" onChange={setCustom} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <SiteTree
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
        <SiteTree
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
          <SiteTree
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
  const [payload, setPayload] = useState<{ node: TreeNode; target: TreeNode; info: MoveInfo } | null>(null);

  return (
    <Demo
      title="Move callback"
      description="Drag a node onto a folder, or between rows. The three arguments appear below. The tree does not change because this demo only records the request."
    >
      <div className="property-demo__stack">
        <div className="property-demo__tree property-demo__tree--solo">
          <SiteTree
            structure={structure}
            showToolbox={false}
            allowReorder
            isAllExpanded
            onNodeMove={(node, target, info) => setPayload({ node, target, info })}
          />
        </div>
        <div className="property-demo__results-row property-demo__results-row--three">
          <JsonResult label="node" value={payload?.node ?? null} />
          <JsonResult label="target" value={payload?.target ?? null} />
          <JsonResult label="info" value={payload?.info ?? null} />
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
          <SiteTree
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
      description="Start a create or rename action, type a name, and confirm it. Names that are blank or already used in the folder cannot be saved."
      controls={
        <button type="button" onClick={() => setSaveProps(null)}>Clear result</button>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree
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
  const [appearance, setAppearance] = useState<DireactreeAppearance>("plain");
  const [density, setDensity] = useState<DireactreeDensity>("comfortable");

  return (
    <Demo
      native
      title="Theme, appearance, and density"
      description="This demo skips the documentation palette to show the package's own colors. system follows the operating system."
      controls={
        <div className="property-demo__control-stack">
          <Choice label="theme" options={["system", "light", "dark"] as const} value={theme} onChange={setTheme} />
          <Choice label="appearance" options={["plain", "card"] as const} value={appearance} onChange={setAppearance} />
          <Choice label="density" options={["comfortable", "compact"] as const} value={density} onChange={setDensity} />
        </div>
      }
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <Direactree
          structure={structure}
          {...noopHandlers}
          theme={theme}
          appearance={appearance}
          density={density}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export const turkishMessages: DireactreeMessages = {
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
  nameEmpty: "Bir ad girin.",
  nameInvalidChars: "Ad “{char}” içeremez.",
  nameReserved: "“{name}” ad olarak kullanılamaz.",
  nameTooLong: "Ad en fazla {max} karakter olabilir.",
  nameDuplicate: "“{name}” bu klasörde zaten var.",
  moveConflict: "“{name}”, {target} içinde zaten var.",
  search: "Ara",
  searchPlaceholder: "Ara…",
  noResults: "Eşleşen öğe yok.",
  loading: "Yükleniyor…",
  loadFailed: "Bu klasör yüklenemedi.",
  retry: "Tekrar dene",
  contextMenu: "{name} için işlemler",
};

export function MessagesDemo() {
  const tree = useDireactree(cloneSampleTree);
  const [translated, setTranslated] = useState(true);

  return (
    <Demo
      title="Custom messages"
      description="Search, hover a toolbox button, type a blank or duplicate name, right-click a row, or delete a node to see the replaced copy."
      controls={<Toggle checked={translated} label="Türkçe" onChange={setTranslated} />}
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <SiteTree
          structure={tree.structure}
          onSave={tree.save}
          onDelete={tree.remove}
          confirmDelete
          showSearch
          contextMenu
          messages={translated ? turkishMessages : undefined}
          allowDragAndDrop={false}
          isAllExpanded
        />
      </div>
    </Demo>
  );
}

export function ConfirmDeleteDemo() {
  const tree = useDireactree(cloneSampleTree);
  const [confirm, setConfirm] = useState(true);

  return (
    <Demo
      title="Delete confirmation"
      description="Select a node and press delete. With confirmDelete, onDelete runs only after the user confirms."
      controls={
        <>
          <Toggle checked={confirm} label="confirmDelete" onChange={setConfirm} />
          <button type="button" onClick={() => tree.reset()}>Reset</button>
        </>
      }
    >
      <div className="property-demo__tree property-demo__tree--solo">
        <SiteTree
          structure={tree.structure}
          confirmDelete={confirm}
          allowDragAndDrop={false}
          isAllExpanded
          onDelete={tree.remove}
        />
      </div>
    </Demo>
  );
}

export function AsyncCallbacksDemo() {
  const tree = useDireactree(cloneSampleTree);
  const [fail, setFail] = useState(false);
  const [lastError, setLastError] = useState<{
    action: DireactreeMutation;
    message: string;
  } | null>(null);

  const handleSave = async (change: SaveProps) => {
    await wait(900);
    if (fail) throw new Error("The server rejected this name.");
    tree.save(change);
  };

  const handleDelete = async (node: NodePath) => {
    await wait(900);
    if (fail) throw new Error("The server could not delete this node.");
    tree.remove(node);
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
              tree.reset();
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
          <SiteTree
            structure={tree.structure}
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
