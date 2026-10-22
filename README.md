# Mert Ulas Docs Hub

A statically generated documentation portal for multiple projects. The site is built with Next.js App Router, React, TypeScript, and MDX.

## Features

- Project catalog and project-aware documentation navigation
- Registry-driven static routes
- Responsive sidebar and mobile drawer
- Documentation search and theme selection
- MDX content with interactive React examples
- Page table of contents, breadcrumbs, and previous/next navigation
- Static HTML export for serverless hosting

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` writes the static site to `out/`.

## Content architecture

Project and page metadata live in `src/lib/docs/registry.ts`. MDX documents live in `src/content/<project>/`, and their explicit import mapping lives in `src/content/loader.ts`.

To add a project:

1. Add its MDX documents under `src/content/<project>/`.
2. Add the project and page definitions to the registry.
3. Add each MDX module to the content loader map.
4. Run the validation commands above.

The same registry powers static route generation, project cards, sidebar navigation, search, breadcrumbs, and pagination.

## Routes

```text
/docs/direactree
/docs/direactree/getting-started
/docs/direactree/examples
/docs/direactree/api-reference
/docs/docs-hub
/docs/docs-hub/adding-a-project
```
