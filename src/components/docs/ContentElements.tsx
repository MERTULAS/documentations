import type { ReactNode } from "react";

export function Callout({
  children,
  tone = "info",
  title,
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning";
  title?: string;
}) {
  return (
    <aside className={`callout callout--${tone}`}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </aside>
  );
}

export function InstallCommand({ command }: { command: string }) {
  return (
    <div className="install-command">
      <span aria-hidden="true">$</span>
      <code>{command}</code>
    </div>
  );
}

export function ReferenceMeta({
  defaultValue,
  required = false,
  type,
}: {
  defaultValue?: string;
  required?: boolean;
  type: string;
}) {
  return (
    <dl className="reference-meta">
      <div>
        <dt>Type</dt>
        <dd><code>{type}</code></dd>
      </div>
      <div>
        <dt>Required</dt>
        <dd>{required ? "Yes" : "No"}</dd>
      </div>
      {defaultValue ? (
        <div>
          <dt>Default</dt>
          <dd><code>{defaultValue}</code></dd>
        </div>
      ) : null}
    </dl>
  );
}
