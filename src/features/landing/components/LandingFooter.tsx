"use client";

import Link from "next/link";
import { KrizakaLogo, OrazakaLogo } from "@krizaka/ui";
import { useTranslation } from "@/core/context/LocaleContext";
import { FEATURE_IDS } from "@/features/landing/components/features";

/** The footer of the public pages: the mark and its promise, the feature pages, the legal pages, the Krizaka signature. */
export function LandingFooter() {
  const { t } = useTranslation();
  const f = t.landing.footer;

  return (
    <footer className="border-t border-border-subtle bg-surface-0">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-5 md:grid-cols-[1.4fr_1fr_1fr]">
        <header className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 text-fg">
            <OrazakaLogo size={28} animated={false} />
            <span className="font-display text-lg font-bold tracking-tight">Orazaka</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-fg-secondary">{f.tagline}</p>
        </header>
        <nav aria-label={f.product} className="space-y-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-secondary">{f.product}</h2>
          <ul className="space-y-2 text-sm">
            {FEATURE_IDS.map((id) => (
              <li key={id}>
                <Link href={`/features/${id}`} className="text-fg-secondary transition-colors hover:text-fg">
                  {t.features.pages[id].name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={f.legal} className="space-y-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-secondary">{f.legal}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="text-fg-secondary transition-colors hover:text-fg">{f.privacy}</Link></li>
            <li><Link href="/terms" className="text-fg-secondary transition-colors hover:text-fg">{f.terms}</Link></li>
            <li><Link href="/contact" className="text-fg-secondary transition-colors hover:text-fg">{f.contact}</Link></li>
          </ul>
        </nav>
      </section>
      <section className="border-t border-border-subtle">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-fg-secondary sm:px-5">
          <a href="https://www.krizaka.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
            <KrizakaLogo size={20} animated={false} />
            {f.by}
          </a>
          <span>{f.license}</span>
        </p>
      </section>
    </footer>
  );
}
