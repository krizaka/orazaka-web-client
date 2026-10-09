"use client";

import Link from "next/link";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";

/** Each benefit opens the feature page that proves it; icons follow the same order as the copy. */
const BENEFITS: { icon: IconName; href: string }[] = [
  { icon: "shield", href: "/features/absolute-privacy" },
  { icon: "layers", href: "/features/unified-engine" },
  { icon: "mcp", href: "/features/infinite-reach" },
];

/** Shared heading of a landing section: a mono eyebrow, the title, an optional lead. */
export function SectionHeading({ eyebrow, title, lead }: Readonly<{ eyebrow: string; title: string; lead?: string }>) {
  return (
    <header className="max-w-2xl space-y-3">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
      {lead && <p className="text-base leading-relaxed text-fg-secondary">{lead}</p>}
    </header>
  );
}

/**
 * The proof strip (four facts that are true of every install) and the three benefits, each linked
 * to the feature page that explains it.
 */
export function LandingValue() {
  const { t } = useTranslation();
  const b = t.landing.benefits;

  return (
    <>
      <section aria-label={b.eyebrow} className="border-b border-border-subtle bg-surface-1">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 lg:grid-cols-4">
          {t.landing.proof.map((p) => (
            <article key={p.label} className="space-y-1 py-8 pr-6">
              <dt className="font-display text-3xl font-bold tracking-tight text-fg">{p.value}</dt>
              <dd className="text-sm leading-snug text-fg-secondary">{p.label}</dd>
            </article>
          ))}
        </dl>
      </section>

      <section id="benefits" className="mx-auto max-w-6xl scroll-mt-20 space-y-10 px-5 py-24">
        <SectionHeading eyebrow={b.eyebrow} title={b.title} lead={b.lead} />
        <ul className="grid gap-4 md:grid-cols-3">
          {b.items.map((item, i) => (
            <li key={item.title}>
              <Link
                href={BENEFITS[i].href}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-1 p-6 transition-colors hover:border-accent/50"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon name={BENEFITS[i].icon} size={20} />
                </span>
                <h3 className="text-lg font-semibold text-fg">{item.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-fg-secondary">{item.body}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {b.more}
                  <Icon name="arrowRight" size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
