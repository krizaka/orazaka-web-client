"use client";

import React from "react";
import type { TranslationDictionary } from "@/core/context/LocaleContext";

interface Feature {
  featureKey: string;
  isEnabled: boolean;
}

interface FeatureToggleCardProps {
  features: Feature[];
  onToggle: (featureKey: string, currentStatus: boolean) => void;
  t: TranslationDictionary;
}

/**
 * Renders the Capabilities Registry Overrides card with toggle switches
 * for each database-configured feature flag.
 */
export const FeatureToggleCard: React.FC<FeatureToggleCardProps> = ({
  features,
  onToggle,
  t,
}) => (
  <div className="bg-surface-1/70 border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4 backdrop-blur-lg">
    <h3 className="text-lg font-bold text-fg border-b pb-2 border-border-subtle">
      {t.admin.featureOverridesTitle}
    </h3>
    {features.length === 0 ? (
      <p className="text-sm text-fg-secondary py-4 text-center italic">
        {t.admin.featureNoOverrides}
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat) => (
          <div
            key={feat.featureKey}
            className="flex items-center justify-between p-3.5 bg-surface-0 rounded-xl border border-border-subtle"
          >
            <div className="flex flex-col gap-0.5 min-w-0 pr-2">
              <span className="text-xs font-bold text-fg font-mono truncate block">
                {feat.featureKey}
              </span>
              <span className="text-[10px] text-fg-secondary">
                {t.admin.featureOverrideEnabled}
              </span>
            </div>
            <input
              type="checkbox"
              checked={feat.isEnabled}
              onChange={() => onToggle(feat.featureKey, feat.isEnabled)}
              className="h-4.5 w-4.5 rounded border-border-subtle text-warning focus:ring-warning cursor-pointer"
            />
          </div>
        ))}
      </div>
    )}
  </div>
);
