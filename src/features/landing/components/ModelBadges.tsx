"use client";

import { Badge } from "@krizaka/ui/badge";
import { useTranslation } from "@/core/context/LocaleContext";
import type { Capability, ModelEntry } from "@/features/landing/utils/models";

/** Where a model runs: Local (the accent — the product's promise) or an optional provider (neutral, labelled opt-in). */
export function WhereBadge({ runsOn }: Readonly<{ runsOn: ModelEntry["runsOn"] }>) {
  const { t } = useTranslation();
  return (
    <Badge tone={runsOn === "local" ? "accent" : "neutral"} dot size="sm">
      {runsOn === "local" ? t.models.where.local : t.models.where.provider}
    </Badge>
  );
}

/** What a model does, one small pill per capability. */
export function CapabilityBadges({ capabilities }: Readonly<{ capabilities: readonly Capability[] }>) {
  const { t } = useTranslation();
  return (
    <span className="flex flex-wrap gap-1">
      {capabilities.map((c) => (
        <Badge key={c} size="sm">
          {t.models.capabilities[c]}
        </Badge>
      ))}
    </span>
  );
}
