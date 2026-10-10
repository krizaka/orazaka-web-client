"use client";

import * as React from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "@krizaka/icons";
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

/** Section anchors of the home page, in reading order. */
export const ANCHORS = ["sovereignty", "platform", "how", "studios"] as const;

function Locales({ className }: Readonly<{ className?: string }>) {
  const { t, locale, setLocale } = useTranslation();
  return (
    <span role="group" aria-label={t.landing.nav.langLabel} className={cn("items-center", className)}>
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "min-h-9 rounded-md px-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            locale === code ? "text-fg-accent" : "text-fg-secondary hover:text-fg",
          )}
        >
          {label}
        </button>
      ))}
    </span>
  );
}

/**
 * Top bar of the public pages: the mark, the section anchors, language and theme, and the two ways in. Sticky and
 * translucent so the page stays readable under it; on a phone the anchors fold into a menu. `onHome` is false on
 * the feature pages, where the anchors lead back to the home page sections.
 */
export function LandingNav({ onHome = true }: Readonly<{ onHome?: boolean }>) {
  const { t } = useTranslation();
  const n = t.landing.nav;
  const [open, setOpen] = React.useState(false);
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-0/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-5" aria-label="Orazaka">
        <Link href="/" aria-label={n.home} className="flex items-center gap-2.5 rounded-md text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <OrazakaLogo size={30} />
          <span className="font-display text-lg font-bold tracking-tight">Orazaka</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {ANCHORS.map((id) => (
            <li key={id}>
              <a href={href(id)} className="text-sm text-fg-secondary transition-colors hover:text-fg">
                {n[id]}
              </a>
            </li>
          ))}
        </ul>

        <span className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Locales className="hidden sm:flex" />
          <ThemeToggle
            variant="ghost"
            label={(mode) => ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode]}
          />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">{n.signIn}</Link>
          </Button>
          <Button asChild variant="primary" size="sm" shape="pill" className="kz-sheen">
            <Link href="/register">{n.getStarted}</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="landing-menu"
            aria-label={open ? n.closeMenu : n.openMenu}
            className="grid h-10 w-10 place-items-center rounded-lg text-fg-secondary transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </span>
      </nav>

      {open && (
        <nav id="landing-menu" aria-label={n.openMenu} className="kz-pop border-t border-border-subtle bg-surface-0/95 px-4 pb-5 pt-2 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col">
            {ANCHORS.map((id) => (
              <li key={id}>
                <a href={href(id)} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-border-subtle text-base text-fg">
                  {n[id]}
                </a>
              </li>
            ))}
          </ul>
          <span className="mt-4 flex items-center justify-between gap-3">
            <Locales className="flex" />
            <Button asChild variant="secondary" size="sm" shape="pill">
              <Link href="/login">{n.signIn}</Link>
            </Button>
          </span>
        </nav>
      )}
    </header>
  );
}
