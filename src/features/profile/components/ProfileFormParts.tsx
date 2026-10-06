"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";

/** Uppercase micro-label shared across the appearance/workspace form fields. */
export function FieldLabel({
  htmlFor,
  children,
}: Readonly<{ htmlFor?: string; children: React.ReactNode }>) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
    >
      {children}
    </label>
  );
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  children: React.ReactNode;
}

/**
 * Token-styled native `<select>` with a labelled wrapper and chevron affordance.
 * Native control = correct mobile keyboard + a11y for free (system-controls rule).
 */
export function SelectField({
  id,
  label,
  children,
  className = "",
  ...props
}: Readonly<SelectFieldProps>) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          className={`h-10 w-full cursor-pointer appearance-none rounded-lg border border-[var(--border-default)] bg-[var(--surface-2)] px-3 pr-9 text-sm text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${className}`}
          {...props}
        >
          {children}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      </div>
    </div>
  );
}
