"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
import { Mascot } from "@krizaka/ui/mascots";
import { CatalogueIcon } from "@/components/icons/CatalogueIcon";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioLoadError, StudioLoading } from "./StudioAsyncState";
import { useInstallations } from "@/features/studio/hooks/useInstallations";

interface InstalledStudiosProps {
  onBrowse: () => void;
}

/**
 * The My Studios tab: what this actor has installed.
 *
 * An empty state that only says "nothing here" is a dead end, so the owl hands the user
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
      <div role="status" className="flex flex-col items-center gap-3 py-12 text-center">
        <Mascot bird="owl" mood="empty" size={112} />
        <p className="text-sm font-semibold text-fg">{t.showcase.studio.installedEmptyTitle}</p>
        <p className="max-w-sm text-[13px] text-fg-secondary">{t.showcase.studio.installedEmptyBody}</p>
        <Button variant="primary" size="sm" onClick={onBrowse}>
          {t.studio.emptyInstalledCta}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {installations.map((installation, index) => (
        <Card.Root key={installation.id} asChild interactive reveal={index}>
          <Link href={`/studios/${installation.studioKey}`}>
            <Card.Body className="gap-4">
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-fg-accent ring-1 ring-inset ring-accent/25">
                  <CatalogueIcon iconKey={installation.iconKey} size={22} />
                </span>
                {installation.status === "UPGRADE_AVAILABLE" && <Badge tone="accent">{t.studio.upgradeAvailable}</Badge>}
              </div>
              <Card.Title className="line-clamp-none text-[15px]">{installation.label}</Card.Title>
              <Card.Footer>
                <span className="font-mono text-[11px] text-fg-muted">
                  {t.studio.pinnedVersion} {installation.pinnedVersion}
                </span>
                <span className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-fg-accent">
                  {t.studio.open}
                  <ForwardIcon size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Card.Footer>
            </Card.Body>
          </Link>
        </Card.Root>
      ))}
    </div>
  );
}
