import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { groupDocs, listDocs } from "@/features/docs/utils/docs";

export const metadata: Metadata = {
  title: "Documentation — Orazaka",
  description: "How Orazaka is built and how to run it: architecture, packs and Studios, the API, administration, the CLI.",
};

/** `/docs` — the hub of the documentation published from Orazaka's generated docs. */
export default function DocsHubPage() {
  const groups = groupDocs(listDocs());
  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <article className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-5 lg:py-24">
          <header className="max-w-2xl space-y-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">Documentation</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">Everything Orazaka does, as it is built.</h1>
            <p className="text-lg leading-relaxed text-fg-secondary">
              Generated from the code of the Orazaka repositories: module map, request pipeline, packs and Studios, the API, administration and the CLI.
            </p>
          </header>
          {groups.map((g) => (
            <section key={g.category} aria-labelledby={`cat-${g.category}`} className="space-y-4">
              <h2 id={`cat-${g.category}`} className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-secondary">
                {g.label}
              </h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {g.docs.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/docs/${d.slug}`} className="flex h-full flex-col gap-2 rounded-2xl border border-border-default bg-surface-1/85 p-5 transition-colors hover:border-border-strong">
                      <span className="font-semibold text-fg">{d.title}</span>
                      <span className="text-sm leading-relaxed text-fg-secondary">{d.intro}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      </main>
      <LandingFooter />
    </>
  );
}
