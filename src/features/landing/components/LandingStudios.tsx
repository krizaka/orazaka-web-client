"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ForwardIcon, ImageIcon, KnowledgeIcon, SearchIcon, VideoIcon, type IconProps } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { ProductCapture } from "@/features/landing/components/ProductCapture";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** Icons of the studio examples, in the order of the copy. */
const ICONS: ComponentType<IconProps>[] = [KnowledgeIcon, VideoIcon, SearchIcon, ImageIcon];

/**
 * The Studios — ready-made workflows that turn the engine into business results — over the real catalogue,
 * blurred behind the cards (depth of field).
 */
export function LandingStudios() {
  const { t } = useTranslation();
  const st = t.landing.studios;

  return (
    <SectionBackdrop
      id="studios"
      direction="up"
      dome={false}
      media={<ProductCapture name="packs" className="h-full w-full object-cover object-top" />}
      className="scroll-mt-16"
    >
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={st.eyebrow} title={st.title} lead={st.lead} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {st.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={item.title}
                data-reveal
                className="kz-spotlight kz-lift flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-1/85 p-6 backdrop-blur-md"
              >
                <Icon size={24} className="relative text-fg-accent" nodeColor="var(--kz-accent)" />
                <h3 className="relative font-semibold text-fg">{item.title}</h3>
                <p className="relative text-sm leading-relaxed text-fg-secondary">{item.body}</p>
              </li>
            );
          })}
        </ul>
        <Button asChild variant="secondary" size="lg" shape="pill">
          <Link href="/register">
            {st.cta}
            <ForwardIcon size={18} />
          </Link>
        </Button>
      </article>
    </SectionBackdrop>
  );
}
