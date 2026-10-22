import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import {
  Callout,
  InstallCommand,
  ReferenceMeta,
} from "@/components/docs/ContentElements";

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }
  return "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function H2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 id={slugify(headingText(children))} {...props}>
      {children}
    </h2>
  );
}

function H3({ children, ...props }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3 id={slugify(headingText(children))} {...props}>
      {children}
    </h3>
  );
}

function Anchor({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: H2,
    h3: H3,
    a: Anchor,
    Callout,
    InstallCommand,
    ReferenceMeta,
    ...components,
  };
}
