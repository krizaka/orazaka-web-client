"use client";

import { useState } from "react";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioLoadError, StudioLoading } from "./StudioAsyncState";
import { useStudios } from "@/features/studio/hooks/useStudios";
import { StudioCard } from "@/features/studio/components/StudioCard";

import { Chip } from "@krizaka/ui/chip";

/** The value of the "all trades" chip (no trade is called "*"). */
const ALL = "*";

/**
 * The Explore tab: the whole catalogue, filterable by trade.
 *
 * Locked Studios are rendered alongside the rest rather than filtered out — the
 * grid is a shop window, and the lock is what makes the upsell visible.
 */
export function StudioCatalogue() {
  const { t } = useTranslation();
  const [profession, setProfession] = useState<string | null>(null);
  const { studios, professions, isLoading, hasError, reload } = useStudios(profession);

  if (isLoading) {
    return <StudioLoading />;
  }

  if (hasError) {
    return <StudioLoadError onRetry={reload} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Chip.Group
        type="single"
        size="sm"
        required
        label={t.studio.filterByTrade}
        value={profession ?? ALL}
        onValueChange={(value) => setProfession(value === ALL ? null : value)}
        className="gap-1.5"
      >
        <Chip value={ALL}>{t.studio.allProfessions}</Chip>
        {professions.map((trade) => (
          <Chip key={trade} value={trade}>
            {t.studio.professions[trade] ?? trade}
          </Chip>
        ))}
      </Chip.Group>

      {studios.length === 0 ? (
        <p className="py-16 text-center text-[12px] text-fg-muted">
          {t.studio.emptyCatalogue}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio.studioKey} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
}
