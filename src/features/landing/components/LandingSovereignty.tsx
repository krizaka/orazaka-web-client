"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { AgentIcon, CreditsIcon, ForwardIcon, ShieldIcon, type IconProps } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { IsoScene } from "@/features/landing/iso/IsoScene";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** Each pillar opens the feature page that proves it; icons follow the order of the copy. */
const PILLARS: { icon: ComponentType<IconProps>; href: string }[] = [
  { icon: ShieldIcon, href: "/features/absolute-privacy" },
  { icon: CreditsIcon, href: "/features/unified-engine" },
  { icon: AgentIcon, href: "/features/infinite-reach" },
];

/**
 * Why Orazaka: the sovereign stack under its dome (an original isometric illustration on the perspective grid) and
 * the three things that follow from it — privacy, cost, control — each linked to the page that shows how.
 */
export function LandingSovereignty() {
  const { t } = useTranslation();
  const s = t.landing.sovereignty;

  return (
    <SectionBackdrop id="sovereignty" direction="up" dome={false} grid className="scroll-mt-16">
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <figure data-reveal className="mx-auto w-full max-w-xl lg:max-w-none">
            <IsoScene scene="home" />
          </figure>
          <ul className="flex flex-col gap-4">
            {s.pillars.map((pillar, i) => {
              const { icon: Icon, href } = PILLARS[i];
              return (
                <li key={pillar.title} data-reveal>
                  <Link
                    href={href}
                    className="kz-spotlight kz-lift group flex gap-4 rounded-2xl border border-border-subtle bg-surface-1/70 p-5 backdrop-blur-sm transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent-soft text-fg-accent">
                      <Icon size={22} nodeColor="var(--kz-accent)" />
                    </span>
                    <span className="relative flex flex-col gap-1.5">
                      <span className="text-lg font-semibold text-fg">{pillar.title}</span>
                      <span className="text-sm leading-relaxed text-fg-secondary">{pillar.body}</span>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-fg-accent">
                        {s.more}
                        <ForwardIcon size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </article>
    </SectionBackdrop>
  );
}
