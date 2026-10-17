"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { NavBar } from "@krizaka/ui/nav-bar";
import { ThemeToggle } from "@krizaka/ui/theme";
import { cn } from "@krizaka/ui/cn";
import { useTranslation } from "@/core/context/LocaleContext";
import { useAuthFlags } from "@/core/context/AuthFlagsContext";
import type { Locale } from "@/core/context/translations.types";
import { NAV_DOCS, NAV_GROUPS, entryHref, navActive } from "@/features/landing/utils/site-nav";

export { navActive } from "@/features/landing/utils/site-nav";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const REPO_URL = "https://github.com/krizaka/orazaka-web-client";
const TALK_URL = "https://www.krizaka.com/contact?topic=orazaka";

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
 * The bar of the public pages — the product-site standard (`site-nav.ts`, docs/ux/information-architecture.md of the
 * workspace). Left: the Orazaka mark (home). Then Product ▾ (what it does) · Platforms ▾ (where it runs) · Docs — one
 * lit at a time, the page's own group. Right: the repository, the language, the theme, Sign in and the one action
 * (« Talk to us » while sign-up is closed, « Get started » once it opens). The version is in the footer, not here.
 * Below md: one panel with the same groups in the same order. `onHome` is false off the home page, where the anchors
 * lead back to its sections.
 */
export function LandingNav({ onHome = true }: Readonly<{ onHome?: boolean }>) {
  const { t } = useTranslation();
  const n = t.landing.nav;
  const flags = useAuthFlags();
  const active = navActive(usePathname());
  const groups = NAV_GROUPS.map((g) => ({
    id: g.id,
    label: n[g.id],
    entries: g.entries.map((e) => ({ id: e.id, Icon: e.Icon, href: entryHref(e, onHome), label: n[e.id], description: n.menu[e.id], active: active.entry === e.id })),
  }));
  const action = flags.signup ? { href: "/register", label: n.getStarted } : { href: TALK_URL, label: n.talk };
  const themeLabel = (mode: "dark" | "light" | "system") => ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode];

  return (
    <div className="sticky top-0 z-40">
      <NavBar.Root label="Orazaka" floating={false}>
        <NavBar.Brand asChild>
          <Link href="/" aria-label={n.home}>
            <OrazakaLogo size={26} />
            <span>Orazaka</span>
          </Link>
        </NavBar.Brand>

        <NavBar.Items>
          {groups.map((g) => (
            <NavBar.Menu key={g.id} value={g.id} label={g.label} active={active.top === g.id}>
              {g.entries.map((e) => (
                <NavBar.MenuLink key={e.id} asChild title={e.label} description={e.description} icon={<e.Icon size={18} />} active={e.active}>
                  <Link href={e.href} />
                </NavBar.MenuLink>
              ))}
            </NavBar.Menu>
          ))}
          <NavBar.Link asChild active={active.top === "docs"}>
            <Link href={NAV_DOCS.path}>{n.docs}</Link>
          </NavBar.Link>
        </NavBar.Items>

        <NavBar.Actions className="gap-1">
          <NavBar.Repo href={REPO_URL} label={n.repo} target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex" />
          <Locales className="hidden md:flex" />
          <ThemeToggle variant="ghost" className="hidden md:inline-flex" label={themeLabel} />
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/login">{n.signIn}</Link>
          </Button>
          <Button asChild variant="primary" size="sm" shape="cut" className="kz-sheen hidden font-bold md:inline-flex">
            <a href={action.href}>{action.label}</a>
          </Button>

          <NavBar.Mobile openLabel={n.openMenu} closeLabel={n.closeMenu} className="max-h-[calc(100dvh-5rem)] gap-1 overflow-y-auto overscroll-contain p-3">
            {groups.map((g) => (
              <NavBar.MobileGroup key={g.id} label={g.label}>
                {g.entries.map((e) => (
                  <NavBar.MobileLink key={e.id} asChild active={e.active}>
                    <Link href={e.href}>{e.label}</Link>
                  </NavBar.MobileLink>
                ))}
              </NavBar.MobileGroup>
            ))}
            <span aria-hidden className="my-1 h-px bg-border-subtle" />
            <NavBar.MobileLink asChild active={active.top === "docs"}>
              <Link href={NAV_DOCS.path}>{n.docs}</Link>
            </NavBar.MobileLink>
            <span className="mt-2 flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
              <Locales className="flex" />
              <ThemeToggle variant="ghost" label={themeLabel} />
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
