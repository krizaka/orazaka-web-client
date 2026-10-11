"use client";

import Link from "next/link";
import { Button } from "@krizaka/ui/button";
import { Mascot } from "@krizaka/ui/mascots";
import { Spinner } from "@krizaka/ui/spinner";
import { useTranslation } from "@/core/context/LocaleContext";

/**
 * The waiting state of a Studio screen: a short wait, so a spinner — a mascot is for the long ones (a run).
 *
 * Four screens showed this, and one of them had drifted to a different gap — which is how
 * this kind of duplication ends: not with a bug, with a layout that is subtly wrong on one
 * page and nobody can say which page is right.
 */
export function StudioLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-16 text-fg-muted">
      <Spinner label={t.dashboard.loading} />
    </div>
  );
}

interface StudioLoadErrorProps {
  /** What to do about it. Omitted when the thing cannot be reloaded — a Studio that is gone. */
  onRetry?: () => void;
}

/**
 * The failed state of a Studio screen: the owl, worried, and the one action that can help.
 *
 * Offers a retry when retrying could work, and a way back when it could not: retrying a
 * Studio that no longer exists just fails again, which reads as the app being broken.
 */
export function StudioLoadError({ onRetry }: Readonly<StudioLoadErrorProps>) {
  const { t } = useTranslation();

  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <Mascot bird="owl" mood="error" size={104} />
      <p className="text-sm font-semibold text-fg">{t.showcase.studio.loadErrorTitle}</p>
      <p className="max-w-sm text-[13px] text-fg-secondary">{t.studio.loadError}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t.studio.retry}
        </Button>
      ) : (
        <Button asChild variant="secondary" size="sm">
          <Link href="/studios">{t.studio.back}</Link>
        </Button>
      )}
    </div>
  );
}
