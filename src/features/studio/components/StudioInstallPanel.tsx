"use client";

import { useState } from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioApi } from "@/services/studio.api";
import { InstallDialog } from "@/features/studio/components/InstallDialog";
import { StudioLockNotice } from "@/features/studio/components/StudioLockNotice";
import type { Installation, StudioDetail } from "@krizaka/orazaka-shared";

interface StudioInstallPanelProps {
  studio: StudioDetail;
  installation: Installation | undefined;
  onChanged: () => void;
}

/**
 * The install / configure / upgrade actions for one Studio.
 *
 * A locked Studio shows the upsell instead of the button, and an unpublished one
 * shows neither: there is no version to pin, so offering an install would produce a
 * failure the user cannot act on.
 *
 * A TOOLKIT Studio the actor is entitled to shows "included" and no install, configure,
 * upgrade or uninstall action (ADR-061): its installation is derived, so each of those
 * would address a row that does not exist. The run form below it is the whole surface.
 */
export function StudioInstallPanel({
  studio,
  installation,
  onChanged,
}: Readonly<StudioInstallPanelProps>) {
  const { t } = useTranslation();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (config: Record<string, string>) => {
    setSubmitting(true);
    setError(null);
    try {
      if (installation) {
        await StudioApi.updateConfig(installation.id, config);
      } else {
        await StudioApi.install(studio.studioKey, config);
      }
      setDialogOpen(false);
      onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.studio.loadError);
    } finally {
      setSubmitting(false);
    }
  };

  const act = async (action: () => Promise<unknown>) => {
    setSubmitting(true);
    setError(null);
    try {
      await action();
      onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.studio.loadError);
    } finally {
      setSubmitting(false);
    }
  };

  if (studio.locked) {
    return <StudioLockNotice reason={studio.lockedReason} packKey={studio.packKey} />;
  }

  if (!studio.latestVersion) {
    return null;
  }

  if (studio.kind === "TOOLKIT") {
    return (
      <span className="inline-flex items-center gap-1.5 h-8 self-start px-3 text-[12px] font-medium border border-[var(--status-success)]/40 text-[var(--status-success)]">
        <Icon name="check" size={13} />
        {t.studio.included}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {isDialogOpen ? (
        <InstallDialog
          configSchema={studio.configSchema}
          initialConfig={installation?.config}
          isSubmitting={isSubmitting}
          onSubmit={(config) => void submit(config)}
          onCancel={() => setDialogOpen(false)}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {installation ? (
            <>
              <span className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium border border-[var(--status-success)]/40 text-[var(--status-success)]">
                <Icon name="check" size={13} />
                {t.studio.installed}
              </span>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                disabled={isSubmitting}
                className="h-8 px-3 text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors duration-150 disabled:opacity-50"
              >
                {t.studio.configure}
              </button>
              {installation.status === "UPGRADE_AVAILABLE" && (
                <button
                  type="button"
                  onClick={() => void act(() => StudioApi.upgrade(installation.id))}
                  disabled={isSubmitting}
                  className="h-8 px-3 text-[12px] font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors duration-150 disabled:opacity-50"
                >
                  {t.studio.upgradeNow}
                </button>
              )}
              <button
                type="button"
                onClick={() => void act(() => StudioApi.uninstall(installation.id))}
                disabled={isSubmitting}
                className="h-8 px-3 text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--status-error)] transition-colors duration-150 disabled:opacity-50"
              >
                {t.studio.uninstall}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              disabled={isSubmitting}
              className="h-8 px-4 inline-flex items-center gap-1.5 text-[12px] font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors duration-150 disabled:opacity-50"
            >
              {isSubmitting && <Icon name="loader" size={13} className="animate-spin" />}
              {t.studio.install}
            </button>
          )}
        </div>
      )}

      {installation?.status === "UPGRADE_AVAILABLE" && !isDialogOpen && (
        <p className="text-[11px] text-[var(--accent)]">{t.studio.upgradeAvailable}</p>
      )}

      {error && <p className="text-[11px] text-[var(--status-error)]">{error}</p>}
    </div>
  );
}
