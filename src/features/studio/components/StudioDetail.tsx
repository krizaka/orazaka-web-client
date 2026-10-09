"use client";

import Link from "next/link";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { usePricingLabel } from "@/features/studio/hooks/usePricingLabel";
import { StudioLoadError, StudioLoading } from "./StudioAsyncState";
import { useStudioDetail } from "@/features/studio/hooks/useStudioDetail";
import { useInstallations } from "@/features/studio/hooks/useInstallations";
import { StudioInstallPanel } from "@/features/studio/components/StudioInstallPanel";
import { StudioRunPanel } from "@/features/studio/components/StudioRunPanel";
import { StudioVersionList } from "@/features/studio/components/StudioVersionList";

interface StudioDetailProps {
  studioKey: string;
}

/**
 * The Studio detail screen: everything needed to decide to install.
 *
 * The install action itself lands in phase 2 — this screen deliberately shows the
 * cost, the copy and the lock state first, because the decision is made here and
 * the button is only its conclusion.
 */
export function StudioDetail({ studioKey }: Readonly<StudioDetailProps>) {
  const { t } = useTranslation();
  const pricingLabel = usePricingLabel();
  const { studio, versions, isLoading, notFound, hasError, reload } = useStudioDetail(studioKey);
  const { findFor, reload: reloadInstallations } = useInstallations();
  const installation = studio ? findFor(studio.studioKey) : undefined;

  if (isLoading) {
    return <StudioLoading />;
  }

  if (notFound || hasError || !studio) {
    return <StudioLoadError onRetry={notFound ? undefined : reload} />;
  }


  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/studios"
        className="inline-flex items-center gap-1.5 self-start text-[11px] font-medium text-fg-muted hover:text-fg transition-colors duration-150"
      >
        <Icon name="arrowLeft" size={13} />
        {t.studio.back}
      </Link>

      <header className="flex items-start gap-3">
        <span className="flex items-center justify-center w-11 h-11 flex-shrink-0 border border-border-subtle bg-surface-2 text-accent">
          <Icon name={studio.iconKey as IconName} size={22} />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-fg">
            {studio.label}
          </h1>
          {studio.tagline && (
            <p className="text-[13px] text-fg-secondary">{studio.tagline}</p>
          )}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="hud-label text-[10px] text-fg-muted">
              {studio.profession}
            </span>
            <span className="hud-label text-[10px] text-fg-muted">
              {pricingLabel[studio.pricing]}
            </span>
          </div>
        </div>
      </header>

      {studio.description && (
        <p className="text-[13px] leading-relaxed text-fg-secondary">
          {studio.description}
        </p>
      )}

      {studio.estimatedCredits > 0 && (
        <div className="flex items-baseline gap-2 p-3 border border-border-subtle bg-surface-1">
          <span className="hud-label text-[10px] text-fg-muted">
            {t.studio.estimatedCost}
          </span>
          <span className="text-[15px] font-semibold text-fg">
            {studio.estimatedCredits}
          </span>
          <span className="text-[11px] text-fg-muted">{t.studio.creditsPerRun}</span>
        </div>
      )}

      <StudioInstallPanel
        studio={studio}
        installation={installation}
        onChanged={() => {
          reloadInstallations();
          reload();
        }}
      />

      {(installation || (studio.kind === "TOOLKIT" && !studio.locked)) && (
        <StudioRunPanel studio={studio} installation={installation} />
      )}

      <StudioVersionList versions={versions} />
    </div>
  );
}
