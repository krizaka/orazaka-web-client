"use client";

import Link from "next/link";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import type { LockReason } from "@krizaka/orazaka-shared";

interface StudioLockNoticeProps {
  reason: LockReason;
  packKey: string | null;
}

/**
 * The upsell shown in place of the install button.
 *
 * The three reasons lead to three different actions, which is the whole point of
 * distinguishing them: buy this pack, change plan, or wait — and `UNKNOWN`
 * offers no action at all, because billing being unreachable is not the user's
 * problem to solve and asking them to pay for something they may already own is
 * the one mistake that costs trust (ADR-034 §8.3).
 */
export function StudioLockNotice({ reason, packKey }: Readonly<StudioLockNoticeProps>) {
  const { t } = useTranslation();

  if (reason === "NONE") {
    return null;
  }

  const copy: Record<Exclude<LockReason, "NONE">, string> = {
    REQUIRES_PURCHASE: t.studio.lockedPurchase,
    REQUIRES_PLAN: t.studio.lockedPlan,
    UNKNOWN: t.studio.lockedUnknown,
  };

  return (
    <div className="flex flex-col gap-2 p-3 border border-[var(--status-warning)]/40 bg-[var(--status-warning)]/8">
      <p className="flex items-center gap-1.5 text-[12px] text-[var(--text-primary)]">
        <Icon name="shield" size={14} className="flex-shrink-0 text-[var(--status-warning)]" />
        {copy[reason]}
      </p>

      {reason === "REQUIRES_PURCHASE" && packKey && (
        <Link
          href={`/packs?pack=${encodeURIComponent(packKey)}`}
          className="self-start h-8 px-3 inline-flex items-center text-[12px] font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors duration-150"
        >
          {t.studio.buyPackage}
        </Link>
      )}

      {reason === "REQUIRES_PLAN" && (
        <Link
          href="/billing"
          className="self-start h-8 px-3 inline-flex items-center text-[12px] font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors duration-150"
        >
          {t.studio.upgradePlan}
        </Link>
      )}
    </div>
  );
}
