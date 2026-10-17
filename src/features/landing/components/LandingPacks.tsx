"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { ActionBar } from "@krizaka/ui/action-bar";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { packGroupsFor } from "@/features/landing/utils/showcase";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** The packs Orazaka ships, read from the generated architecture data (never a hand-written list). */
export function LandingPacks() {
  const { t, locale } = useTranslation();
  const p = t.landing.packs;
  const groups = packGroupsFor(locale);

  return (
    <SectionBackdrop id="packs" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        {groups.map((group) => (
          <div key={group.key} data-category={group.key} className="space-y-4">
            <header className="space-y-1">
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-fg">{group.label}</h3>
              {group.description && <p className="max-w-2xl text-sm text-fg-secondary">{group.description}</p>}
            </header>
            <CardGrid columns={3} reveal>
              {group.packs.map((pack) => (
                <LinkCard
                  key={pack.key}
                  href={`/docs/packs#${pack.anchor}`}
                  linkAs={Link}
                  footerAlign="bottom"
                  title={pack.label}
                  titleAs="h4"
                  description={pack.tagline}
                  meta={p.studios.replace("{count}", String(pack.studios))}
                  cta={p.cta}
                />
              ))}
            </CardGrid>
          </div>
        ))}
        <ActionBar actions={[{ href: "/docs/packs", label: p.more, icon: <ForwardIcon size={18} /> }]} size="sm" linkAs={Link} label={p.more} />
      </article>
    </SectionBackdrop>
  );
}
