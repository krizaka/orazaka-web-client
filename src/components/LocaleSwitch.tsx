"use client";

import { Button } from "@krizaka/ui/button";
import { useTranslation } from "@/core/context/LocaleContext";
import type { Locale } from "@/core/context/translations.types";

const LOCALES: readonly { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

/**
 * The language switch of the pages a visitor reads before signing in (sign-in, legal, contact): two ghost buttons on
 * the @krizaka/ui button, the current one pressed. One component instead of four copies of the same markup.
 */
export function LocaleSwitch({ className }: Readonly<{ className?: string }>) {
  const { t, locale, setLocale } = useTranslation();
  return (
    <nav className={className ?? "flex items-center gap-1"} aria-label={t.auth.langSwitchLabel}>
      {LOCALES.map(({ code, label }) => (
        <Button
          key={code}
          variant="ghost"
          size="sm"
          aria-pressed={locale === code}
          className="aria-pressed:bg-surface-2 aria-pressed:text-fg"
          onClick={() => setLocale(code)}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
}
