"use client";

import type { ReactNode, RefAttributes } from "react";
import { useCallback, useEffect, useState } from "react";
import Direactree from "direactree/next";
import type { DireactreeHandle, DireactreeProps, DireactreeTheme, TreeNode } from "direactree";
import { cloneSampleTree } from "./sampleTree";

/** Direactree with `theme` following the docs light or dark toggle. */
export function SiteTree<T>(props: DireactreeProps<T> & RefAttributes<DireactreeHandle>) {
  const theme = useSiteTheme();
  return <Direactree<T> theme={theme} {...props} />;
}

export function Demo({
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

export function JsonResult({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="property-demo__result" aria-live="polite">
      <span>{label}</span>
      <pre>{JSON.stringify(value, null, 2) ?? "null"}</pre>
    </div>
  );
}

export function CodeResult({ label, code }: { label: string; code: string }) {
  return (
    <div className="property-demo__result">
      <span>{label}</span>
      <pre>{code}</pre>
    </div>
  );
}

export function Toggle({
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

export function Choice<T extends string>({
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

export function Range({
  label,
  max,
  min,
  onChange,
  step = 1,
  suffix = "",
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  suffix?: string;
  value: number;
}) {
  return (
    <label className="demo-range">
      <span className="demo-range__label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <code>{value}{suffix}</code>
    </label>
  );
}

/** A short list of the latest callback calls, newest first. */
export function useEventLog(limit = 8) {
  const [entries, setEntries] = useState<{ id: number; text: string }[]>([]);
  const log = useCallback((text: string) => {
    setEntries((current) => [{ id: Date.now() + Math.random(), text }, ...current].slice(0, limit));
  }, [limit]);
  const clear = useCallback(() => setEntries([]), []);
  return { entries, log, clear };
}

export function EventLog({ entries, label = "callbacks" }: { entries: { id: number; text: string }[]; label?: string }) {
  return (
    <div className="property-demo__result" aria-live="polite">
      <span>{label}</span>
      <pre>{entries.length ? entries.map((entry) => entry.text).join("\n") : "Nothing yet. Use the tree."}</pre>
    </div>
  );
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** The docs light or dark mode, so the demos follow the site toggle instead of the OS. */
export function useSiteTheme(): DireactreeTheme {
  const [theme, setTheme] = useState<DireactreeTheme>("system");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const value = root.dataset.theme;
      setTheme(value === "dark" || value === "light" ? value : "system");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

export function useStableTree(): TreeNode[] {
  const [structure] = useState<TreeNode[]>(cloneSampleTree);
  return structure;
}

// Without onSave and onDelete the toolbox buttons are disabled. Demos about
// presentation pass these so the buttons stay usable; nothing is persisted.
export const noopHandlers = {
  onSave: () => undefined,
  onDelete: () => undefined,
};
