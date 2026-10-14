"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { WhereBadge } from "@/features/landing/components/ModelBadges";
import { featured, filtersHref, formatCount, MODELS, providerCount } from "@/features/landing/utils/models";

/** The home page's Models section: six of the local models, read from the registry (never typed), and the way to all of them. */
export function LandingModels() {
  const { t, locale } = useTranslation();
  const h = t.models.home;
  const optional = providerCount();

  return (
    <SectionBackdrop id="models" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} lead={h.lead} />
        <CardGrid columns={3} reveal>
          {featured(MODELS, 6).map((m) => (
            <LinkCard
              key={m.id}
              href={filtersHref({ capabilities: [m.capabilities[0]], runsOn: "local" })}
              linkAs={Link}
              footerAlign="bottom"
              title={m.name}
              titleAs="h3"
              meta={`${m.vendor} · ${t.models.capabilities[m.capabilities[0]]}`}
              description={[m.licence.name, m.contextWindow ? t.models.context.tokens.replace("{count}", formatCount(m.contextWindow, locale)) : null].filter(Boolean).join(" · ")}
              extra={<WhereBadge runsOn={m.runsOn} />}
              cta={h.cta}
            />
          ))}
        </CardGrid>
        {optional > 0 && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-secondary">{h.providers.replace("{count}", String(optional))}</p>}
        <Button asChild variant="secondary" size="lg" shape="pill">
          <Link href="/models">
            {h.more}
            <ForwardIcon size={18} />
          </Link>
        </Button>
      </article>
    </SectionBackdrop>
  );
}
