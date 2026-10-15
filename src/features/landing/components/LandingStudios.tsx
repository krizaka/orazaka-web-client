"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ForwardIcon, ImageIcon, KnowledgeIcon, SearchIcon, VideoIcon, type IconProps } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { useEntries } from "@/features/landing/components/useEntries";
import { ProductCapture } from "@/features/landing/components/ProductCapture";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** Icons of the studio examples, in the order of the copy. */
const ICONS: ComponentType<IconProps>[] = [KnowledgeIcon, VideoIcon, SearchIcon, ImageIcon];

/** The real place behind each example: its own recording, the "Made here" gallery, its pack in the documentation. */
const HREFS = ["/gallery#demo-documents", "/gallery", "/docs/packs#outbound-prospecting", "/docs/packs#trade-showcase"] as const;

/**
 * The Studios — ready-made workflows that turn the engine into business results — over the real catalogue,
 * blurred behind the cards (depth of field).
 */
export function LandingStudios() {
  const { t } = useTranslation();
  const st = t.landing.studios;
  const primary = useEntries().primary(st.cta);

  return (
    <SectionBackdrop
      id="studios"
      direction="up"
      dome={false}
      media={<ProductCapture name="studios" className="h-full w-full object-cover object-top" />}
      className="scroll-mt-16"
    >
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={st.eyebrow} title={st.title} lead={st.lead} />
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
                icon={<Icon size={24} nodeColor="var(--kz-accent)" />}
                title={item.title}
                titleAs="h3"
                description={item.body}
                cta={st.ctas[i]}
              />
            );
          })}
        </CardGrid>
        <Button asChild variant="secondary" size="lg" shape="pill">
          <Link href={primary.href}>
            {primary.label}
            <ForwardIcon size={18} />
          </Link>
        </Button>
      </article>
    </SectionBackdrop>
  );
}
