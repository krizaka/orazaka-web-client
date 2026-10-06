"use client";

import { useState } from "react";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioLoadError, StudioLoading } from "./StudioAsyncState";
import { useStudios } from "@/features/studio/hooks/useStudios";
import { StudioCard } from "@/features/studio/components/StudioCard";

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
      <div className="flex flex-wrap items-center gap-1.5">
        <FilterChip
          label={t.studio.allProfessions}
          active={profession === null}
          onSelect={() => setProfession(null)}
        />
        {professions.map((trade) => (
          <FilterChip
            key={trade}
            label={trade}
            active={profession === trade}
            onSelect={() => setProfession(trade)}
          />
        ))}
      </div>

      {studios.length === 0 ? (
        <p className="py-16 text-center text-[12px] text-[var(--text-muted)]">
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

interface FilterChipProps {
  label: string;
  active: boolean;
  onSelect: () => void;
}

/** One trade filter. Extracted so the grid above stays a layout, not a loop body. */
function FilterChip({ label, active, onSelect }: Readonly<FilterChipProps>) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`h-7 px-2.5 text-[11px] font-medium border transition-colors duration-150 ${
        active
          ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-2)]"
          : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
      }`}
    >
      {label}
    </button>
  );
}
