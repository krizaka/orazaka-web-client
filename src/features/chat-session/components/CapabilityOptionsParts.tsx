import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";

export interface ModelOption {
  value: string;
  label: string;
  /** Host hardware compatibility from the catalog; incompatible models are greyed + disabled. */
  compatible: boolean;
  reason?: string | null;
  /** Catalog description, surfaced under the picker so the user knows what the model does. */
  description?: string | null;
  /** Image-to-video models need a seed image; the UI surfaces a reference-image affordance. */
  requiresReferenceImage?: boolean;
}

export const selectClass =
  "h-8 w-full cursor-pointer appearance-none rounded-lg border border-border-default bg-surface-2 pl-2.5 pr-7 text-xs text-fg transition-colors focus:outline-none focus:ring-2 focus:ring-ring";

export function Field({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <label className="flex min-w-[120px] flex-1 flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </span>
      <span className="relative">
        {children}
        <Icon name="chevronDown" className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
      </span>
    </label>
  );
}
