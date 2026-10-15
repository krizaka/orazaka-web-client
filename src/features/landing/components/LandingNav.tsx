"use client";

import Link from "next/link";
import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { NavBar } from "@krizaka/ui/nav-bar";
import { ThemeToggle } from "@krizaka/ui/theme";
import { cn } from "@krizaka/ui/cn";
import { useTranslation } from "@/core/context/LocaleContext";
import { useAuthFlags } from "@/core/context/AuthFlagsContext";
import type { Locale } from "@/core/context/translations.types";
import { APP_ENV, APP_VERSION } from "@/core/config/version";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const REPO_URL = "https://github.com/krizaka/orazaka-web-client";
const TALK_URL = "https://www.krizaka.com/contact?topic=orazaka";

/** Section anchors of the home page, in reading order (the bar keeps the four that matter; the page has them all). */
export const ANCHORS = ["made", "sovereignty", "platform", "how", "demo", "studios", "packs"] as const;

function Locales({ className }: Readonly<{ className?: string }>) {
  const { t, locale, setLocale } = useTranslation();
  return (
    <span role="group" aria-label={t.landing.nav.langLabel} className={cn("items-center", className)}>
      {LOCALES.map(({ code, label }) => (
        <Button
          key={code}
          variant="ghost"
          size="sm"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className="px-2 font-mono aria-pressed:text-fg-accent"
        >
          {label}
        </Button>
      ))}
    </span>
  );
}

/**
 * The bar of the public pages (NAV-SYS, @krizaka/ui's NavBar). Left: the Orazaka mark, the family switcher and the
 * DEV · version badge. Centre, this site: How it works · Demo · Mobile · Docs. Right: the repository, the language, the
 * theme, Sign in and the one action — « Talk to us » while sign-up is closed, « Get started » once it opens. Below md:
 * one panel, the family as its last group. `onHome` is false on the feature pages, where the anchors lead back to the
 * home page sections.
 */
export function LandingNav({ onHome = true }: Readonly<{ onHome?: boolean }>) {
  const { t } = useTranslation();
  const n = t.landing.nav;
  const flags = useAuthFlags();
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const links = [
    { key: "how", href: href("how"), label: n.how, external: false },
    { key: "demo", href: href("demo"), label: n.demo, external: false },
    { key: "mobile", href: "/mobile", label: n.mobile, external: false },
    { key: "docs", href: "/docs", label: n.docs, external: false },
  ] as const;
  const action = flags.signup ? { href: "/register", label: n.getStarted } : { href: TALK_URL, label: n.talk };

  return (
    <div className="sticky top-0 z-40">
      <NavBar.Root label="Orazaka" floating={false}>
        <NavBar.Brand asChild>
          <Link href="/" aria-label={n.home}>
            <OrazakaLogo size={26} />
            <span>Orazaka</span>
          </Link>
        </NavBar.Brand>
        <NavBar.Badge env={APP_ENV} version={APP_VERSION} />

        <NavBar.Items>
          {links.map((l) => (
            <NavBar.Link key={l.key} asChild>
              <a href={l.href}>{l.label}</a>
            </NavBar.Link>
          ))}
        </NavBar.Items>

        <NavBar.Actions className="gap-1">
          <NavBar.Repo href={REPO_URL} label={n.repo} target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex" />
          <Locales className="hidden md:flex" />
          <ThemeToggle
            variant="ghost"
            className="hidden md:inline-flex"
            label={(mode) => ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode]}
          />
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/login">{n.signIn}</Link>
          </Button>
          <Button asChild variant="primary" size="sm" shape="cut" className="kz-sheen hidden font-bold md:inline-flex">
            <a href={action.href}>{action.label}</a>
          </Button>

          <NavBar.Mobile openLabel={n.openMenu} closeLabel={n.closeMenu} className="max-h-[calc(100dvh-5rem)] gap-1 overflow-y-auto overscroll-contain p-3">
            {ANCHORS.map((id) => (
              <NavBar.MobileLink key={id} asChild>
                <a href={href(id)}>{n[id]}</a>
              </NavBar.MobileLink>
            ))}
            <NavBar.MobileLink asChild>
              <Link href="/mobile">{n.mobile}</Link>
            </NavBar.MobileLink>
            <NavBar.MobileLink asChild>
              <Link href="/docs">{n.docs}</Link>
            </NavBar.MobileLink>
            <span className="mt-2 flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
              <Locales className="flex" />
              <ThemeToggle
                variant="ghost"
                label={(mode) => ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode]}
              />
            </span>
            <span className="flex items-center gap-2">
              <Button asChild variant="ghost" size="md">
                <Link href="/login">{n.signIn}</Link>
              </Button>
              <Button asChild variant="primary" size="md" shape="cut" className="flex-1 font-bold">
                <a href={action.href}>{action.label}</a>
              </Button>
            </span>
              </NavBar.Mobile>
        </NavBar.Actions>
      </NavBar.Root>
    </div>
  );
}
