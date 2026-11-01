import Link from "next/link";

import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-4xl">Page not found</h1>
        <p className="mt-4">We couldn&apos;t find the page you were looking for.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to home
        </Link>
      </section>
    </SiteShell>
  );
}
