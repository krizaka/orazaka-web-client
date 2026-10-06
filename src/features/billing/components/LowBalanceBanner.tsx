"use client";

import { useState } from "react";
import { Button, Icon } from "@krizaka/orazaka-design-system";
import { formatCredits } from "@krizaka/orazaka-shared";
import { useWallet } from "@/features/billing/hooks/useWallet";

export interface LowBalanceBannerProps {
  /** Opens the top-up flow. */
  onTopUp?: () => void;
}

/**
 * Warns before the balance runs out, not after.
 *
 * Driven by `evt.wallet.low-balance` over SSE, so it appears the moment the
 * crossing happens rather than on the user's next navigation — by which point
 * they may already have started work that will be refused.
 *
 * Dismissible, and dismissal is per-session rather than permanent: the warning is
 * relevant again the next time they sign in with a balance still low, and a
 * banner that could be silenced forever would stop being a warning.
 */
export function LowBalanceBanner({ onTopUp }: LowBalanceBannerProps) {
  const { available, isLow } = useWallet();
  const [dismissed, setDismissed] = useState(false);

  if (!isLow || dismissed) {
    return null;
  }

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-4 rounded-lg border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <Icon name="warning" className="h-4 w-4 shrink-0 text-[var(--warning)]" />
        <p className="text-sm text-[var(--text-primary)]">
          Il vous reste <strong>{formatCredits(available)} crédits</strong>. Les
          générations coûteuses risquent d’être refusées.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onTopUp && (
          <Button size="sm" onClick={onTopUp}>
            Recharger
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          Masquer
        </Button>
      </div>
    </div>
  );
}
