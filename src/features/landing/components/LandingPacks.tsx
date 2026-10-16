"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { ActionBar } from "@krizaka/ui/action-bar";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { packsFor } from "@/features/landing/utils/showcase";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** The packs Orazaka ships, read from the generated architecture data (never a hand-written list). */
export function LandingPacks() {
  const { t, locale } = useTranslation();
  const p = t.landing.packs;
  const packs = packsFor(locale);

  return (
    <SectionBackdrop id="packs" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <CardGrid columns={3} reveal>
          {packs.map((pack) => (
            <LinkCard
              key={pack.key}
              href={`/docs/packs#${pack.anchor}`}
              linkAs={Link}
              footerAlign="bottom"
              title={pack.label}
              titleAs="h3"
              description={pack.tagline}
              meta={p.studios.replace("{count}", String(pack.studios))}
              cta={p.cta}
            />
          ))}
        </CardGrid>
        <ActionBar actions={[{ href: "/docs/packs", label: p.more, icon: <ForwardIcon size={18} /> }]} size="sm" linkAs={Link} label={p.more} />
      </article>
    </SectionBackdrop>
  );
}
