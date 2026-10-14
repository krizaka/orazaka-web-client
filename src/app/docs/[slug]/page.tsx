import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { DocMarkdown } from "@/features/docs/components/DocMarkdown";
import { CATEGORY_LABELS, listDocs, readDoc } from "@/features/docs/utils/docs";

export const dynamicParams = false;

export function generateStaticParams() {
  return listDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const doc = readDoc((await params).slug);
  return doc ? { title: `${doc.entry.title} — Orazaka docs`, description: doc.entry.intro } : {};
}

/** `/docs/<slug>` — one published doc. */
export default async function DocPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const doc = readDoc((await params).slug);
  if (!doc) notFound();
  const published = new Set(listDocs().map((d) => d.slug));
  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-5 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs uppercase tracking-[0.14em] text-fg-secondary">
            <Link href="/docs" className="hover:text-fg">
              Docs
            </Link>{" "}
            / {CATEGORY_LABELS[doc.entry.category] ?? doc.entry.category}
          </nav>
          <p className="mb-8 rounded-xl border border-border-default bg-surface-1 p-4 text-sm leading-relaxed text-fg-secondary">{doc.entry.intro}</p>
          <DocMarkdown body={doc.body} published={published} />
        </article>
      </main>
      <LandingFooter />
    </>
  );
}
