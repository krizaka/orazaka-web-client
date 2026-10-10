"use client";

import * as React from "react";
import { useTranslation } from "@/core/context/LocaleContext";
import { Icon } from "@krizaka/orazaka-design-system";
import type { IconName } from "@krizaka/orazaka-design-system";

import { cn } from "@krizaka/ui/cn";

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
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="group space-y-1.5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
        <Icon name={icon} className="h-3 w-3" />
        {label}
      </p>
      <section className="flex items-center gap-2">
        <p
          className={cn("flex-1 text-sm text-fg", isMono
            ? "select-all break-all rounded-lg border border-border-subtle bg-surface-2 p-2.5 font-mono"
            : "font-medium")}
        >
          {value}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg p-1.5 text-fg-muted opacity-0 transition-all duration-150 hover:bg-surface-2 hover:text-fg group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t.a11y.copy}
        >
          {copied ? (
            <Icon name="check" className="h-3.5 w-3.5 text-success" />
          ) : (
            <Icon name="copy" className="h-3.5 w-3.5" />
          )}
        </button>
      </section>
    </article>
  );
}
