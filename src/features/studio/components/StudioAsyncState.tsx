"use client";

import Link from "next/link";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";

const ACTION_CLASS =
  "px-3 h-8 inline-flex items-center text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors duration-150";

/**
 * The waiting state of a Studio screen.
 *
 * Four screens showed this, and one of them had drifted to a different gap — which is how
 * this kind of duplication ends: not with a bug, with a layout that is subtly wrong on one
 * page and nobody can say which page is right.
 */
export function StudioLoading() {
  return (
    <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
      <Icon name="loader" size={16} className="animate-spin" />
    </div>
  );
}

interface StudioLoadErrorProps {
  /** What to do about it. Omitted when the thing cannot be reloaded — a Studio that is gone. */
  onRetry?: () => void;
}

/**
 * The failed state of a Studio screen.
 *
 * Offers a retry when retrying could work, and a way back when it could not: retrying a
 * Studio that no longer exists just fails again, which reads as the app being broken.
 */
export function StudioLoadError({ onRetry }: Readonly<StudioLoadErrorProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <Icon name="alertCircle" size={20} className="text-[var(--status-error)]" />
      <p className="text-[12px] text-[var(--text-secondary)]">{t.studio.loadError}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className={ACTION_CLASS}>
          {t.studio.retry}
        </button>
      ) : (
        <Link href="/studios" className={ACTION_CLASS}>
          {t.studio.back}
        </Link>
      )}
    </div>
  );
}
