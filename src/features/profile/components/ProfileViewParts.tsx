"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import type { IconName } from "@krizaka/orazaka-design-system";

/* ─── Copyable Field Component ─── */
export function CopyableField({
  label,
  value,
  icon,
  isMono = false,
}: Readonly<{
  label: string;
  value: string;
  icon: IconName;
  isMono?: boolean;
}>) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="group space-y-1.5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        <Icon name={icon} className="h-3 w-3" />
        {label}
      </p>
      <section className="flex items-center gap-2">
        <p
          className={`flex-1 text-sm text-[var(--text-primary)] ${
            isMono
              ? "select-all break-all rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-2)] p-2.5 font-mono"
              : "font-medium"
          }`}
        >
          {value}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg p-1.5 text-[var(--text-muted)] opacity-0 transition-all duration-150 hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Copy"
        >
          {copied ? (
            <Icon name="check" className="h-3.5 w-3.5 text-[var(--status-success)]" />
          ) : (
            <Icon name="copy" className="h-3.5 w-3.5" />
          )}
        </button>
      </section>
    </article>
  );
}
