"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ClockIcon, KnowledgeIcon, LinkIcon, type IconProps } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** Where each proof lives: the code, the measured runs, the documentation. */
const PROOFS: { href: string; Icon: ComponentType<IconProps> }[] = [
  { href: "https://github.com/krizaka/orazaka", Icon: LinkIcon },
  { href: "/docs/measured-runs", Icon: ClockIcon },
  { href: "/docs", Icon: KnowledgeIcon },
];

/** Trust in one compact row: open source, measured runs and costs, the documentation — each a way to check. */
export function LandingTrust() {
  const { t } = useTranslation();
  const tr = t.landing.trust;
  return (
    <SectionBackdrop id="trust" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-8 px-4 py-16 sm:px-5 lg:py-20">
        <SectionHeading eyebrow={tr.eyebrow} title={tr.title} />
        <CardGrid columns={3} reveal>
          {tr.items.map((item, i) => {
            const { href, Icon } = PROOFS[i];
            return (
              <LinkCard
                key={item.title}
                href={href}
                linkAs={href.startsWith("/") ? Link : undefined}
                footerAlign="bottom"
                icon={<Icon size={22} nodeColor="var(--kz-accent)" />}
                title={item.title}
                titleAs="h3"
                description={item.body}
                cta={item.cta}
              />
            );
          })}
        </CardGrid>
      </article>
    </SectionBackdrop>
  );
}
