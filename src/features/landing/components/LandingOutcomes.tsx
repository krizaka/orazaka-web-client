"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ImageIcon, KnowledgeIcon, PackIcon, SearchIcon, VideoIcon, type IconProps } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { packsFor } from "@/features/landing/utils/showcase";

/** Icons of the Studio outcomes, in the order of the copy. */
const ICONS: ComponentType<IconProps>[] = [KnowledgeIcon, VideoIcon, SearchIcon, ImageIcon];
/** The real place behind each outcome: its recording, the gallery, its pack in the documentation. */
const HREFS = ["/gallery#demo-documents", "/gallery", "/docs/packs#outbound-prospecting", "/docs/packs#trade-showcase"] as const;

/**
 * What you can do, as outcomes (under the prompt → image → video showcase): four Studios as cards (`#studios`), then
 * one line for the packs (`#packs`) — their count read from the generated data — towards the catalogue in the docs.
 * A few outcomes, not a catalogue.
 */
export function LandingOutcomes() {
  const { t, locale } = useTranslation();
  const st = t.landing.studios;
  const w = t.landing.what;
  const count = packsFor(locale).length;
  return (
    <div className="space-y-6">
      <div id="studios" className="scroll-mt-20">
        <CardGrid columns={4} reveal>
          {st.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <LinkCard
                key={item.title}
                href={HREFS[i]}
                linkAs={Link}
                layout="stack"
                footerAlign="bottom"
                icon={<Icon size={22} nodeColor="var(--kz-accent)" />}
                title={item.title}
                titleAs="h3"
                description={item.body}
                cta={st.ctas[i]}
              />
            );
          })}
        </CardGrid>
      </div>
      <p id="packs" className="flex scroll-mt-20 flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-border-subtle bg-surface-1/70 px-4 py-3 text-sm text-fg-secondary">
        <PackIcon size={18} className="text-fg-accent" />
        <span className="font-semibold text-fg">{w.packs}</span>
        <span>{fill(w.packsLine, { count })}</span>
        <Link href="/docs/packs" className="ml-auto font-medium text-fg-accent hover:underline">
          {w.packsCta} →
        </Link>
      </p>
    </div>
  );
}
