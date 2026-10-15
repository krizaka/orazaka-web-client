"use client";

import type { ComponentType } from "react";
import { AgentIcon, AutomationIcon, ChatIcon, KnowledgeIcon, PackIcon, StudioIcon, type IconProps } from "@krizaka/icons";
import Link from "next/link";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { ProductCapture } from "@/features/landing/components/ProductCapture";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** Icons of the six capabilities, in the order of the copy. */
const ICONS: ComponentType<IconProps>[] = [ChatIcon, AgentIcon, KnowledgeIcon, StudioIcon, AutomationIcon, PackIcon];

/** Where each capability leads: the demo chapter, a guide, the Studios, the packs — always a real place. */
const HREFS = ["/#demo-chat", "/docs/tools", "/docs/architecture", "/#studios", "/docs/jobs", "/docs/packs"] as const;

/**
 * The platform: the real workspace in a window (sharp at the top, fading into the page — depth of field), then the
 * six capabilities a team gets in it, each with its signature icon.
 */
export function LandingPlatform() {
  const { t } = useTranslation();
  const p = t.landing.platform;

  return (
    <SectionBackdrop id="platform" dome={false} className="scroll-mt-16">
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />

        <figure data-reveal className="group relative overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-lg">
          <header className="flex items-center gap-1.5 border-b border-border-subtle bg-surface-2 px-4 py-2.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-fg-muted/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-fg-muted/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
            <span className="ml-3 h-5 w-48 rounded-md bg-surface-3" />
          </header>
          <section className="landing-capture-frame relative h-64 overflow-hidden sm:h-80 lg:h-[26rem]">
            <ProductCapture name="studios" alt={p.captureAlt} sizes="(min-width: 1152px) 1152px, 100vw" className="landing-card-capture h-auto w-full" />
          </section>
        </figure>

        <CardGrid columns={3} reveal>
          {p.items.map((item, i) => {
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
                cta={p.ctas[i]}
              />
            );
          })}
        </CardGrid>
      </article>
    </SectionBackdrop>
  );
}
