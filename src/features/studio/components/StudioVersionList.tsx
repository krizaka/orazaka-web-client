"use client";

import { format } from "date-fns";
import { useTranslation } from "@/core/context/LocaleContext";
import type { BlueprintVersion } from "@krizaka/orazaka-shared";

interface StudioVersionListProps {
  versions: BlueprintVersion[];
}

/**
 * The version history.
 *
 * Drafts are dropped here on purpose: the service returns them so the admin
 * console can read the same endpoint, but an unpublished version is not something
 * a user can pin, and listing it would offer an upgrade that cannot happen.
 */
export function StudioVersionList({ versions }: Readonly<StudioVersionListProps>) {
  const { t } = useTranslation();
  const published = versions.filter((version) => version.status !== "DRAFT");

  if (published.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="hud-label text-[10px] text-[var(--text-muted)]">{t.studio.versionHistory}</h2>
      <ul className="flex flex-col divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)]">
        {published.map((version) => (
          <StudioVersionRow key={version.version} version={version} />
        ))}
      </ul>
    </section>
  );
}

interface StudioVersionRowProps {
  version: BlueprintVersion;
}

/** One history row. A sub-component so the list above stays a list (UI standards). */
function StudioVersionRow({ version }: Readonly<StudioVersionRowProps>) {
  const { t } = useTranslation();

  return (
    <li className="flex flex-col gap-1 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold text-[var(--text-primary)]">
          {version.version}
        </span>
        <span className="hud-label text-[10px] text-[var(--text-muted)]">
          {version.publishedAt ? format(new Date(version.publishedAt), "dd MMM yyyy") : ""}
        </span>
      </div>
      <p className="text-[11px] leading-snug text-[var(--text-secondary)]">
        {version.changelog ?? t.studio.noChangelog}
      </p>
    </li>
  );
}
