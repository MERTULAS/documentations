import type { Metadata } from "next";
import "./globals.css";

const themeInitScript = `
  try {
    const storedTheme = localStorage.getItem("docs-theme");
    const systemTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = storedTheme || systemTheme;
  } catch {}
`;

export const metadata: Metadata = {
  title: {
    default: "Mert Ulas Docs",
    template: "%s · Mert Ulas Docs",
  },
  description: "Documentation, guides, examples, and API references for open-source projects by Mert Ulas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
