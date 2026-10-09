"use client";

import Link from "next/link";
import { KrizakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { useTranslation } from "@/core/context/LocaleContext";

/** The last call to action and the footer (legal pages, licence, the Krizaka signature). */
export function LandingClosing() {
  const { t } = useTranslation();
  const c = t.landing.cta;
  const f = t.landing.footer;

  return (
    <>
      <section className="border-t border-border-subtle ambient-grid">
        <article className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 py-24 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{c.title}</h2>
          <p className="max-w-xl text-base leading-relaxed text-fg-secondary">{c.lead}</p>
          <nav className="flex flex-wrap justify-center gap-3" aria-label={c.primary}>
            <Button asChild variant="primary" size="lg" shape="pill">
              <Link href="/register">{c.primary}</Link>
            </Button>
            <Button asChild size="lg" shape="pill" variant="ghost">
              <Link href="/login">{c.secondary}</Link>
            </Button>
          </nav>
        </article>
      </section>

      <footer className="border-t border-border-subtle">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-8 text-sm text-fg-muted">
          <a href="https://www.krizaka.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
            <KrizakaLogo size={20} animated={false} />
            {f.by}
          </a>
          <span>{f.license}</span>
          <span className="ml-auto flex gap-5">
            <Link href="/privacy" className="hover:text-fg">{f.privacy}</Link>
            <Link href="/terms" className="hover:text-fg">{f.terms}</Link>
            <Link href="/contact" className="hover:text-fg">{f.contact}</Link>
          </span>
        </nav>
      </footer>
    </>
  );
}
