"use client";

import Link from "next/link";
import { ChatShowcase, Icon } from "@krizaka/orazaka-design-system";
import { Button } from "@krizaka/ui/button";
import { useTranslation } from "@/core/context/LocaleContext";

/**
 * The promise in one screen: who it is for, what it does, why it is safe — and the live sovereign
 * chat (the shared ChatShowcase motif) answering on the visitor's side of the fold.
 */
export function LandingHero() {
  const { t, locale } = useTranslation();
  const h = t.landing.hero;
  const chat = t.landing.chat;

  return (
    <section className="relative overflow-hidden border-b border-border-subtle ambient-grid">
      <article className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <header className="space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            {h.kicker}
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
            {h.title}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-fg-secondary">{h.lead}</p>
          <nav className="flex flex-wrap gap-3" aria-label={h.primaryCta}>
            <Button asChild variant="primary" size="lg" shape="pill">
              <Link href="/register">
                {h.primaryCta}
                <Icon name="arrowRight" size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" shape="pill" variant="secondary">
              <Link href="/login">{h.secondaryCta}</Link>
            </Button>
          </nav>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
            {h.trust.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Icon name="checkCircle" size={14} className="text-success" />
                {item}
              </li>
            ))}
          </ul>
        </header>

        <figure className="flex flex-col items-center gap-3">
          <ChatShowcase
            key={locale}
            className="w-full"
            labels={chat.labels}
            question={chat.question}
            answer={chat.answer}
            pipeline={chat.pipeline}
          />
          <figcaption className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            <Icon name="shield" size={12} className="text-accent" />
            {h.demoLabel}
          </figcaption>
        </figure>
      </article>
    </section>
  );
}
