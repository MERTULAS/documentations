"use client";

import { useEffect, useRef, useState } from "react";
import Direactree from "direactree/next";
import type { DireactreeAppearance, DireactreeDensity, DireactreeStyle, DireactreeTheme } from "direactree";
import { cloneProjectTree } from "./sampleTree";
import {
  Choice,
  CodeResult,
  Demo,
  JsonResult,
  Range,
  SiteTree,
  Toggle,
  noopHandlers,
} from "./DemoFrame";

/** The package look with no docs palette: theme, appearance, density, indent, RTL. */
export function AppearanceDemo() {
  const [structure] = useState(cloneProjectTree);
  const [theme, setTheme] = useState<DireactreeTheme>("light");
  const [appearance, setAppearance] = useState<DireactreeAppearance>("plain");
  const [density, setDensity] = useState<DireactreeDensity>("comfortable");
  const [indent, setIndent] = useState(20);
  const [rtl, setRtl] = useState(false);

  const code = `<Direactree
  structure={structure}
  theme="${theme}"
  appearance="${appearance}"
  density="${density}"
  indent={${indent}}
/>${rtl ? '\n\n// inside <div dir="rtl">' : ""}`;

  return (
    <Demo
      native
      title="Theme, appearance, density"
      description="The package's own colors, without the docs palette. Select a row and hover others to see the selection and hover states."
      controls={
        <div className="property-demo__control-stack">
          <Choice label="theme" options={["system", "light", "dark"] as const} value={theme} onChange={setTheme} />
          <Choice label="appearance" options={["plain", "card"] as const} value={appearance} onChange={setAppearance} />
          <Choice label="density" options={["comfortable", "compact"] as const} value={density} onChange={setDensity} />
          <Range label="indent" min={8} max={50} value={indent} onChange={setIndent} suffix="px" />
          <Toggle checked={rtl} label='dir="rtl"' onChange={setRtl} />
        </div>
      }
    >
      <div className="property-demo__split">
        <div className="property-demo__tree demo-stage" dir={rtl ? "rtl" : "ltr"}>
          <Direactree
            structure={structure}
            {...noopHandlers}
            theme={theme}
            appearance={appearance}
            density={density}
            indent={indent}
            selectedId="modal"
            allowDragAndDrop={false}
          />
        </div>
        <CodeResult label="props" code={code} />
      </div>
    </Demo>
  );
}

/** Build a light-dark() token pair and see it on both themes at once. */
export function TokenPlaygroundDemo() {
  const [structure] = useState(cloneProjectTree);
  const [light, setLight] = useState("#ede9fe");
  const [dark, setDark] = useState("#4c1d95");
  const [lightText, setLightText] = useState("#4c1d95");
  const [darkText, setDarkText] = useState("#ede9fe");
  const [pair, setPair] = useState(true);

  const style: DireactreeStyle = pair
    ? {
        "--direactree-selected": `light-dark(${light}, ${dark})`,
        "--direactree-selected-fg": `light-dark(${lightText}, ${darkText})`,
        "--direactree-focus": `light-dark(${lightText}, ${darkText})`,
      }
    : { "--direactree-selected": light, "--direactree-selected-fg": lightText };

  const code = pair
    ? `style={{
  "--direactree-selected": "light-dark(${light}, ${dark})",
  "--direactree-selected-fg": "light-dark(${lightText}, ${darkText})",
}}`
    : `style={{
  "--direactree-selected": "${light}",
  "--direactree-selected-fg": "${lightText}",
}}`;

  return (
    <Demo
      native
      title="One color or two"
      description="Pick the selection colors. With light-dark() each theme gets its own pair. Turn it off to see the same light color fail on the dark theme."
      controls={
        <div className="property-demo__control-stack">
          <Toggle checked={pair} label="use light-dark()" onChange={setPair} />
          <label className="demo-color"><span>light bg</span><input type="color" value={light} onChange={(e) => setLight(e.target.value)} /></label>
          <label className="demo-color"><span>light text</span><input type="color" value={lightText} onChange={(e) => setLightText(e.target.value)} /></label>
          <label className="demo-color"><span>dark bg</span><input type="color" value={dark} onChange={(e) => setDark(e.target.value)} disabled={!pair} /></label>
          <label className="demo-color"><span>dark text</span><input type="color" value={darkText} onChange={(e) => setDarkText(e.target.value)} disabled={!pair} /></label>
        </div>
      }
    >
      <div className="property-demo__stack">
        <div className="demo-theme-pair">
          {(["light", "dark"] as const).map((theme) => (
            <div key={theme} className={`demo-stage demo-stage--${theme}`}>
              <span className="demo-stage__label">theme=&quot;{theme}&quot;</span>
              <Direactree structure={structure} theme={theme} selectedId="button" showToolbox={false} allowDragAndDrop={false} style={style} />
            </div>
          ))}
        </div>
        <CodeResult label="style" code={code} />
      </div>
    </Demo>
  );
}

/** The data attributes on the row you click. */
export function DataAttributesDemo() {
  const [structure] = useState(cloneProjectTree);
  const wrapper = useRef<HTMLDivElement>(null);
  const [attributes, setAttributes] = useState<Record<string, string> | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>("button");

  useEffect(() => {
    const id = selectedId;
    if (!id || !wrapper.current) {
      setAttributes(null);
      return;
    }
    const row = wrapper.current.querySelector(`[data-node-id="${CSS.escape(id)}"]`)?.closest("li");
    if (!row) return;
    const found: Record<string, string> = { class: row.className };
    Array.from(row.attributes)
      .filter((attribute) => attribute.name.startsWith("data-"))
      .forEach((attribute) => { found[attribute.name] = attribute.value === "" ? "(present)" : attribute.value; });
    found.style = row.getAttribute("style") ?? "";
    setAttributes(found);
  }, [selectedId]);

  return (
    <Demo
      title="State attributes"
      description="Click a row to read the attributes on its <li>. Style with these instead of the markup depth, for example .direactree-row[data-type='folder']."
    >
      <div className="property-demo__split">
        <div className="property-demo__tree" ref={wrapper}>
          <SiteTree
            structure={structure}
            showToolbox={false}
            allowDragAndDrop={false}
            selectedId={selectedId}
            onSelectedNodeChange={(node) => setSelectedId(node?.id ?? null)}
            className="demo-attribute-tree"
          />
        </div>
        <JsonResult label="<li> attributes" value={attributes} />
      </div>
    </Demo>
  );
}

/** classNames slots, here with the docs utility classes. */
export function ClassNamesDemo() {
  const [structure] = useState(cloneProjectTree);
  const [on, setOn] = useState(true);
  const classNames = on
    ? { root: "demo-cn-root", row: "demo-cn-row", item: "demo-cn-item", label: "demo-cn-label", toolbox: "demo-cn-toolbox", toolboxButton: "demo-cn-button" }
    : undefined;

  return (
    <Demo
      title="classNames"
      description="Each slot adds a class to one part of the tree. Turn it on to apply a few demo classes; with Tailwind you would pass utility classes the same way."
      controls={<Toggle checked={on} label="classNames" onChange={setOn} />}
    >
      <div className="property-demo__split">
        <div className="property-demo__tree">
          <SiteTree structure={structure} {...noopHandlers} allowDragAndDrop={false} classNames={classNames} />
        </div>
        <JsonResult label="classNames" value={classNames ?? null} />
      </div>
    </Demo>
  );
}
