import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs/DocsShell";
import { loadDocContent } from "@/content/loader";
import {
  getAllDocParams,
  getPage,
  getProject,
} from "@/lib/docs/registry";
import type { DocRouteParams } from "@/lib/docs/types";

type PageProps = {
  params: Promise<DocRouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectSlug, pageSlug } = await params;
  const project = getProject(projectSlug);
  const page = project ? getPage(project, pageSlug) : undefined;

  if (!project || !page) {
    return { title: "Documentation not found" };
  }

  return {
    title: `${page.label} · ${project.name}`,
    description: page.description,
  };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { projectSlug, pageSlug } = await params;
  const project = getProject(projectSlug);
  const page = project ? getPage(project, pageSlug) : undefined;

  if (!project || !page) {
    notFound();
  }

  const content = await loadDocContent(project.slug, page.slug);

  if (!content) {
    notFound();
  }

  const Content = content.default;

  return (
    <DocsShell project={project} page={page}>
      <Content />
    </DocsShell>
  );
}
