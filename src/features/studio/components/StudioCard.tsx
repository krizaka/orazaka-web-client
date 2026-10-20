"use client";

import Link from "next/link";
import { ForwardIcon, LockIcon } from "@krizaka/icons";
import { Badge } from "@krizaka/ui/badge";
import { Card } from "@krizaka/ui/card";
import type { LockReason, StudioPricing, StudioSummary } from "@krizaka/orazaka-shared";
import { CatalogueIcon } from "@/components/icons/CatalogueIcon";
import { useTranslation } from "@/core/context/LocaleContext";
import { usePricingLabel } from "@/features/studio/hooks/usePricingLabel";

interface StudioCardProps {
  studio: StudioSummary;
  /** Its place in the grid: the cards arrive one after the other (`data-reveal`, still under reduced motion). */
  index?: number;
}

/** The tone of each pricing model: free and included read as good news, paid stays neutral. */
const PRICING_TONE: Record<StudioPricing, "success" | "accent" | "neutral"> = {
  FREE: "success",
  INCLUDED: "accent",
  PAID: "neutral",
};

/**
 * One catalogue card, on the @krizaka/ui card (interactive: spotlight and lift).
 *
 * A locked card is dimmed but never hidden and never disabled: it still links to
 * its detail page, because the upsell lives there and a product the user cannot
 * open is a product they cannot buy (ADR-034 §4).
 */
export function StudioCard({ studio, index }: Readonly<StudioCardProps>) {
  const { t } = useTranslation();
  const pricingLabel = usePricingLabel();

  const lockLabel: Record<LockReason, string> = {
    NONE: "",
    REQUIRES_PURCHASE: t.studio.lockedPurchase,
    REQUIRES_PLAN: t.studio.lockedPlan,
    UNKNOWN: t.studio.lockedUnknown,
  };

  return (
    <Card.Root asChild interactive reveal={index} className={studio.locked ? "opacity-75" : undefined}>
      <Link href={`/studios/${studio.studioKey}`}>
        <Card.Body className="gap-4">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-fg-accent ring-1 ring-inset ring-accent/25">
              <CatalogueIcon iconKey={studio.iconKey} size={22} />
            </span>
            <Badge tone={PRICING_TONE[studio.pricing]}>{pricingLabel[studio.pricing]}</Badge>
          </div>

          <div className="flex flex-col gap-1">
            <Card.Title className="line-clamp-none text-[15px]">{studio.label}</Card.Title>
            {studio.tagline && <Card.Description className="line-clamp-none text-[13px] leading-snug">{studio.tagline}</Card.Description>}
          </div>

          <Card.Footer>
            <span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">
              {t.studio.professions[studio.profession] ?? studio.profession}
            </span>
            {studio.locked ? (
              <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-fg-warning">
                <LockIcon size={13} />
                {lockLabel[studio.lockedReason]}
              </span>
            ) : (
              <span className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-fg-accent">
                {t.studio.open}
                <ForwardIcon size={14} className="transition-transform duration-200" />
              </span>
            )}
          </Card.Footer>
        </Card.Body>
      </Link>
    </Card.Root>
  );
}
