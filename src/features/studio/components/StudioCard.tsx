"use client";

import Link from "next/link";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { usePricingLabel } from "@/features/studio/hooks/usePricingLabel";
import type { LockReason, StudioSummary } from "@krizaka/orazaka-shared";

import { cn } from "@krizaka/ui/cn";

interface StudioCardProps {
  studio: StudioSummary;
}

/**
 * One catalogue card.
 *
 * A locked card is dimmed but never hidden and never disabled: it still links to
 * its detail page, because the upsell lives there and a product the user cannot
 * open is a product they cannot buy (ADR-034 §4).
 */
export function StudioCard({ studio }: Readonly<StudioCardProps>) {
  const { t } = useTranslation();
  const pricingLabel = usePricingLabel();


  const lockLabel: Record<LockReason, string> = {
    NONE: "",
    REQUIRES_PURCHASE: t.studio.lockedPurchase,
    REQUIRES_PLAN: t.studio.lockedPlan,
    UNKNOWN: t.studio.lockedUnknown,
  };

  return (
    <Link
      href={`/studios/${studio.studioKey}`}
      className={cn(
        "group relative flex flex-col gap-3 p-4 border border-border-subtle bg-surface-1 transition-all duration-200 hover:border-accent hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        studio.locked ? "opacity-60" : ""
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center justify-center w-9 h-9 border border-border-subtle bg-surface-2 text-accent">
          <Icon name={studio.iconKey as IconName} fallback="studio" size={18} />
        </span>
        <span className="hud-label text-[10px] text-fg-muted">
          {pricingLabel[studio.pricing]}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-fg">
          {studio.label}
        </h3>
        {studio.tagline && (
          <p className="text-[12px] leading-snug text-fg-secondary">{studio.tagline}</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="hud-label text-[10px] text-fg-muted">{t.studio.professions[studio.profession] ?? studio.profession}</span>
        {studio.locked ? (
          <span className="flex items-center gap-1 text-[10px] font-medium text-warning">
            <Icon name="shield" size={12} />
            {lockLabel[studio.lockedReason]}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {t.studio.open}
          </span>
        )}
      </div>
    </Link>
  );
}
