"use client";

import { useState } from "react";
import { CheckIcon } from "@krizaka/icons";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
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
      <Badge tone="success" size="md" className="self-start">
        <CheckIcon size={13} />
        {t.studio.included}
      </Badge>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <InstallDialog
        open={isDialogOpen}
        configSchema={studio.configSchema}
        initialConfig={installation?.config}
        isSubmitting={isSubmitting}
        onSubmit={(config) => void submit(config)}
        onCancel={() => setDialogOpen(false)}
      />
      <div className="flex flex-wrap items-center gap-2">
        {installation ? (
          <>
            <Badge tone="success" size="md">
              <CheckIcon size={13} />
              {t.studio.installed}
            </Badge>
            <Button variant="secondary" size="sm" onClick={() => setDialogOpen(true)} disabled={isSubmitting}>
              {t.studio.configure}
            </Button>
            {installation.status === "UPGRADE_AVAILABLE" && (
              <Button variant="primary" size="sm" onClick={() => void act(() => StudioApi.upgrade(installation.id))} disabled={isSubmitting}>
                {t.studio.upgradeNow}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => void act(() => StudioApi.uninstall(installation.id))} disabled={isSubmitting}>
              {t.studio.uninstall}
            </Button>
          </>
        ) : (
          <Button variant="primary" size="md" onClick={() => setDialogOpen(true)} loading={isSubmitting}>
            {t.studio.install}
          </Button>
        )}
      </div>

      {installation?.status === "UPGRADE_AVAILABLE" && (
        <p className="text-xs text-fg-accent">{t.studio.upgradeAvailable}</p>
      )}

      {error && <p role="alert" className="text-xs text-fg-danger">{error}</p>}
    </div>
  );
}
