"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiIcon, ImageIcon, PackIcon, PlayIcon, StudioIcon } from "@krizaka/icons";
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

/** The Product menu — every public destination of the product that is not a top-level entry, with its icon. */
const PRODUCT_ENTRIES = [
  { id: "how", anchor: "how", Icon: PlayIcon },
  { id: "studios", anchor: "studios", Icon: StudioIcon },
  { id: "packs", anchor: "packs", Icon: PackIcon },
  { id: "models", path: "/models", Icon: AiIcon },
  { id: "made", path: "/gallery", Icon: ImageIcon },
] as const;

/** Where the visitor is, as the bar shows it: the menu entry, the current top-level link, or neither (on the home). */
export function navActive(pathname: string | null | undefined) {
  const p = pathname ?? "";
  return {
    models: p === "/models" || p.startsWith("/models/"),
    made: p === "/gallery" || p.startsWith("/gallery/"),
    features: p.startsWith("/features/"),
    mobile: p === "/docs/mobile",
    docs: (p === "/docs" || p.startsWith("/docs/")) && p !== "/docs/mobile",
  };
}

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
 * DEV · version badge. Centre, this site: Product (How it works · Studios · Packs · Models · Made here) · Demo ·
 * Mobile · Documentation — every public destination, the current page lit. Right: the repository, the language, the
 * theme, Sign in and the one action — « Talk to us » while sign-up is closed, « Get started » once it opens. Below md:
 * one panel, the family as its last group. `onHome` is false on the feature pages, where the anchors lead back to the
 * home page sections.
 */
export function LandingNav({ onHome = true }: Readonly<{ onHome?: boolean }>) {
  const { t } = useTranslation();
  const n = t.landing.nav;
  const flags = useAuthFlags();
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const active = navActive(usePathname());
  const entries = PRODUCT_ENTRIES.map((e) => ({
    id: e.id,
    Icon: e.Icon,
    href: "anchor" in e ? href(e.anchor) : e.path,
    label: e.id === "models" ? n.models : n[e.id],
    description: n.menu[e.id],
    active: e.id === "models" ? active.models : e.id === "made" ? active.made : false,
  }));
  const links = [
    { key: "demo", href: href("demo"), label: n.demo, active: false },
    { key: "mobile", href: "/docs/mobile", label: n.mobile, active: active.mobile },
    { key: "docs", href: "/docs", label: n.docs, active: active.docs },
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
          <NavBar.Menu value="product" label={n.product} active={active.models || active.made || active.features} columns={1}>
            {entries.map((e) => (
              <NavBar.MenuLink key={e.id} asChild title={e.label} description={e.description} icon={<e.Icon size={18} />} active={e.active}>
                <Link href={e.href} />
              </NavBar.MenuLink>
            ))}
          </NavBar.Menu>
          {links.map((l) => (
            <NavBar.Link key={l.key} asChild active={l.active}>
              <Link href={l.href}>{l.label}</Link>
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
            <span className="px-3 pt-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-accent">{n.product}</span>
            {entries.map((e) => (
              <NavBar.MobileLink key={e.id} asChild active={e.active}>
                <Link href={e.href}>{e.label}</Link>
              </NavBar.MobileLink>
            ))}
            <span aria-hidden className="my-1 h-px bg-border-subtle" />
            {links.map((l) => (
              <NavBar.MobileLink key={l.key} asChild active={l.active}>
                <Link href={l.href}>{l.label}</Link>
              </NavBar.MobileLink>
            ))}
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
