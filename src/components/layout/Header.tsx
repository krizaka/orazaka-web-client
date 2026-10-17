"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/core/hooks/useAuth";
import { ThemeToggle } from "@krizaka/ui/theme";
import { useTranslation } from "@/core/context/LocaleContext";
import { LogoutIcon } from "@krizaka/icons";
import { OrazakaLogo } from "@krizaka/ui";
import { AppHeader } from "@krizaka/ui/app-header";
import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { DropdownMenu } from "@krizaka/ui/dropdown-menu";
import { NotificationBell } from "./NotificationBell";

const LOCALES = ["en", "fr"] as const;

/**
 * The top bar of the signed-in app — `@krizaka/ui` AppHeader: the name beside the rail (the mark on a phone, where the
 * rail is a bottom bar), the sovereign status, and on the right the theme, the notifications and the user menu under
 * the avatar. Nothing here repeats the rail (core/config/app-sections.ts).
 */
export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { locale, setLocale, t } = useTranslation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [bellOpen, setBellOpen] = React.useState(false);

  const name = user?.name || user?.email || "";
  const initial = (name || "U")[0].toUpperCase();
  // No photo on an account: Orazaka's default picture (a person, one of six tones from the id), the initial while it loads.
  const avatar = (size: "sm" | "md") => (
    <Avatar size={size} defaultAvatar={{ brand: "orazaka", seed: user?.id ?? user?.email ?? user?.name ?? undefined }} fallback={initial} />
  );

  return (
    <AppHeader
      name="Orazaka"
      mark={<OrazakaLogo size={22} />}
      homeLink={<Link href="/" aria-label={t.appNav.home} />}
      chips={
        <Badge tone="success" dot className="hidden sm:inline-flex">
          {t.dashboard.sovereignBadge}
        </Badge>
      }
      actions={
        <>
          <ThemeToggle id="theme-toggle" label={(mode) => ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode]} />
          {isAuthenticated && (
            <NotificationBell
              bellOpen={bellOpen}
              onToggle={(openState) => {
                setBellOpen(openState);
                setMenuOpen(false);
              }}
            />
          )}
          {isAuthenticated && user && (
            <DropdownMenu.Root
              open={menuOpen}
              onOpenChange={(openState) => {
                setMenuOpen(openState);
                if (openState) setBellOpen(false);
              }}
            >
              <DropdownMenu.Trigger
                aria-label={t.appNav.account}
                className="flex items-center gap-2.5 rounded-lg p-1 transition-colors duration-150 hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {avatar("sm")}
                <span className="hidden text-sm font-medium text-fg-secondary sm:inline-block">{name}</span>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end" className="w-64">
                <DropdownMenu.Label className="flex items-center gap-3 py-2 normal-case tracking-normal">
                  {avatar("md")}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-fg">{user.name || user.email}</span>
                    {user.name && user.email && <span className="block truncate text-xs font-normal text-fg-secondary">{user.email}</span>}
                  </span>
                </DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Group aria-label={t.appNav.language}>
                  <DropdownMenu.Label>{t.appNav.language}</DropdownMenu.Label>
                  {LOCALES.map((code) => (
                    <DropdownMenu.CheckboxItem key={code} checked={locale === code} onCheckedChange={() => setLocale(code)}>
                      {code === "en" ? t.settings.english : t.settings.french}
                    </DropdownMenu.CheckboxItem>
                  ))}
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.Item tone="danger" onSelect={() => logout()}>
                  <LogoutIcon size={16} />
                  {t.appNav.signOut}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </>
      }
    />
  );
};
