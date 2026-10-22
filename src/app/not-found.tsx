import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="not-found">
        <span>404</span>
        <h1>This page is outside the tree.</h1>
        <p>The project or documentation page you requested does not exist.</p>
        <Link className="button button--primary" href="/">
          Return to projects
        </Link>
      </main>
    </>
  );
}
