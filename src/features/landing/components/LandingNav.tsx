"use client";

import Link from "next/link";
import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { ThemeToggle } from "@krizaka/ui/theme";
import { cn } from "@krizaka/ui/cn";
import { useTranslation } from "@/core/context/LocaleContext";
import type { Locale } from "@/core/context/translations.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

/** Section anchors of the landing page, in reading order. */
const ANCHORS = ["benefits", "how", "studios"] as const;

/**
 * Top bar of the public home page: the mark, the section anchors, language and theme, and the two
 * ways in (sign in, create a workspace). Sticky and translucent so the page stays readable under it.
 */
export function LandingNav() {
  const { t, locale, setLocale } = useTranslation();
  const n = t.landing.nav;

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-0/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5" aria-label="Orazaka">
        <Link href="/" className="flex items-center gap-2.5 text-fg">
          <OrazakaLogo size={30} title="Orazaka" />
          <span className="font-display text-lg font-bold tracking-tight">Orazaka</span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {ANCHORS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className="text-sm text-fg-secondary transition-colors hover:text-fg">
                {n[id]}
              </a>
            </li>
          ))}
        </ul>

        <span className="ml-auto flex items-center gap-2">
          <span role="group" aria-label={n.langLabel} className="hidden items-center sm:flex">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                className={cn(
                  "rounded-md px-2 py-1 font-mono text-xs transition-colors",
                  locale === code ? "text-accent" : "text-fg-muted hover:text-fg",
                )}
              >
                {label}
              </button>
            ))}
          </span>
          <ThemeToggle
            variant="ghost"
            label={(mode) => ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode]}
          />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">{n.signIn}</Link>
          </Button>
          <Button asChild variant="primary" size="sm" shape="pill">
            <Link href="/register">{n.getStarted}</Link>
          </Button>
        </span>
      </nav>
    </header>
  );
}
