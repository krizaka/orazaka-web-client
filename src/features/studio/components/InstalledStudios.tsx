"use client";

import Link from "next/link";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioLoadError, StudioLoading } from "./StudioAsyncState";
import { useInstallations } from "@/features/studio/hooks/useInstallations";

interface InstalledStudiosProps {
  onBrowse: () => void;
}

/**
 * The My Studios tab: what this actor has installed.
 *
 * An empty state that only says "nothing here" is a dead end, so it hands the user
 * straight back to the catalogue — the tab they actually wanted.
 */
export function InstalledStudios({ onBrowse }: Readonly<InstalledStudiosProps>) {
  const { t } = useTranslation();
  const { installations, isLoading, hasError, reload } = useInstallations();

  if (isLoading) {
    return <StudioLoading />;
  }

  if (hasError) {
    return <StudioLoadError onRetry={reload} />;
  }

  if (installations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Icon name="studio" size={22} className="text-fg-muted" />
        <p className="text-[12px] text-fg-secondary">{t.studio.emptyInstalled}</p>
        <button
          type="button"
          onClick={onBrowse}
          className="px-3 h-8 text-[12px] font-medium border border-accent text-accent hover:bg-surface-2 transition-colors duration-150"
        >
          {t.studio.emptyInstalledCta}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {installations.map((installation) => (
        <Link
          key={installation.id}
          href={`/studios/${installation.studioKey}`}
          className="group flex flex-col gap-2 p-4 border border-border-subtle bg-surface-1 transition-all duration-200 hover:border-accent hover:bg-surface-2"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="flex items-center justify-center w-9 h-9 border border-border-subtle bg-surface-2 text-accent">
              <Icon name={installation.iconKey as IconName} size={18} />
            </span>
            {installation.status === "UPGRADE_AVAILABLE" && (
              <span className="hud-label text-[10px] text-accent">
                {t.studio.upgradeAvailable}
              </span>
            )}
          </div>
          <h3 className="text-[13px] font-semibold text-fg">
            {installation.label}
          </h3>
          <span className="hud-label text-[10px] text-fg-muted">
            {t.studio.pinnedVersion} {installation.pinnedVersion}
          </span>
        </Link>
      ))}
    </div>
  );
}
