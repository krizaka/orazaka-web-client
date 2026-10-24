"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/core/hooks/useAuth";
import { ThemeToggle } from "@krizaka/ui/theme";
import { useTranslation } from "@/core/context/LocaleContext";
import { LogoutIcon, SettingsIcon, UserIcon } from "@krizaka/icons";
import { OrazakaLogo } from "@krizaka/ui";
import { AppHeader } from "@krizaka/ui/app-header";
import { AccountMenu } from "@krizaka/ui/account-menu";
import { NotificationBell } from "./NotificationBell";

const LOCALES = ["en", "fr"] as const;

/**
 * The top bar of the signed-in app — `@krizaka/ui` AppHeader: the name beside the rail (the mark on a phone, where the
 * rail is a bottom bar), and on the right the theme, the notifications and the user menu under
 * the avatar. Nothing here repeats the rail (core/config/app-sections.ts).
 */
export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { locale, setLocale, t } = useTranslation();
  const [bellOpen, setBellOpen] = React.useState(false);

  const initial = ((user?.name || user?.email || "U")[0] ?? "U").toUpperCase();

  return (
    <AppHeader
      name="Orazaka"
      mark={<OrazakaLogo size={22} />}
      homeLink={<Link href="/" aria-label={t.appNav.home} />}
      actions={
        <>
          <ThemeToggle id="theme-toggle" label={(mode) => ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode]} />
          {isAuthenticated && (
            <NotificationBell
              bellOpen={bellOpen}
              onToggle={setBellOpen}
            />
          )}
          {isAuthenticated && user && (
            <AccountMenu
              label={t.appNav.account}
              showName
              name={user.name || undefined}
              email={user.email || undefined}
              avatar={{ defaultAvatar: { brand: "orazaka", seed: user.id ?? user.email ?? user.name ?? undefined }, fallback: initial }}
              linkAs={Link}
              links={[
                { id: "profile", label: t.profile.title, href: "/settings/account", icon: <UserIcon size={16} /> },
                { id: "settings", label: t.appNav.settings, href: "/settings/appearance", icon: <SettingsIcon size={16} /> },
              ]}
              language={{
                label: t.appNav.language,
                value: locale,
                options: LOCALES.map((code) => ({ value: code, label: code === "en" ? t.settings.english : t.settings.french })),
                onChange: (code) => setLocale(code as (typeof LOCALES)[number]),
              }}
              signOut={{ label: t.appNav.signOut, onSelect: () => logout(), icon: <LogoutIcon size={16} /> }}
            />
          )}
        </>
      }
    />
  );
};
