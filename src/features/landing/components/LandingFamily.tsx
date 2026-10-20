"use client";

import { ProductLogo } from "@krizaka/ui";
import { Section } from "@krizaka/ui/page";
import { familyLabels, sites } from "@krizaka/ui/sites";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";

/** The products that run on the engine, in the family's order; `planned`: the product states the intention, nothing is wired yet. */
const POWERED = [
  { id: "orochia" },
  { id: "yomizaka" },
  { id: "kachizaka" },
  { id: "akinaza", planned: true },
  { id: "yasakia", planned: true },
  { id: "yororis", planned: true },
] as const;

/**
 * The engine's story: the family's products with their marks, each saying what it uses Orazaka for — « planned » where it
 * is not wired yet (the same lines as krizaka.com's engine card). Names, addresses, marks and statuses are the family's
 * (`@krizaka/ui/sites`), never copied here.
 */
export function LandingFamily() {
  const { t, locale } = useTranslation();
  const f = t.landing.family;
  const labels = familyLabels[locale];
  return (
    <Section id="engine" eyebrow={f.eyebrow} title={f.title} lead={f.lead} reveal divider>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {POWERED.map((p) => {
          const site = sites.find((s) => s.id === p.id);
          if (!site) return null;
          const status = "planned" in p ? f.planned : (labels.status as Record<string, string>)[site.status] ?? null;
          return (
            <li key={p.id} data-reveal>
              <a href={site.url} className="group flex items-start gap-4 text-fg outline-offset-4" aria-label={fill(f.visit, { name: site.name })}>
                <ProductLogo id={site.mark as "orochia"} size={40} className="shrink-0" />
                <span className="flex flex-col gap-0.5">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display font-bold group-hover:underline">{site.name}</span>
                    {status && <span className="font-mono text-xs text-fg-secondary">{status}</span>}
                  </span>
                  <span className="text-sm text-fg-secondary">{f.uses[p.id]}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
