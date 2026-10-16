"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/core/hooks/useAuth";
import { ThemeToggle } from "@krizaka/ui/theme";
import { useSidebar } from "@/core/context/SidebarContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { CheckIcon, ChevronDownIcon, GlobeIcon, MenuIcon } from "@krizaka/icons";
import { OrazakaLogo } from "@krizaka/ui";
import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { Button, IconButton } from "@krizaka/ui/button";
import { DropdownMenu } from "@krizaka/ui/dropdown-menu";
import { NotificationBell } from "./NotificationBell";


/**
 * Global Header layout Component — Calm Obsidian 2026.
 *
 * <p>Compact 56px height, solid surface-1 background with subtle border.
 * Dropdowns use surface-2 with clean border-default, no glass effects.
 * Rendered exclusively as a Client Component ("use client") due to
 * stateful dropdowns and context consumption.
 *
 * @returns The global top header navbar React element.
 * @see {@link useAuth}
 * @see {@link useSidebar}
 * @see {@link useTranslation}
 */
export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { open } = useSidebar();
  const { locale, setLocale, t } = useTranslation();

  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);
  const [bellOpen, setBellOpen] = React.useState(false);

  const initial = React.useMemo(() => {
    if (!user) return "U";
    const val = user.name || user.email || "User";
    return val[0].toUpperCase();
  }, [user]);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border-subtle bg-surface-1 px-5">
      <div className="flex items-center md:hidden">
        <IconButton variant="ghost" onClick={open} label={t.header.openSidebar} className="mr-2">
          <MenuIcon size={20} />
        </IconButton>
      </div>
      {/* The app's mark and its name: the rail only carries the icon. */}
      <Link href="/" aria-label={t.sidebar.dashboard} className="flex items-center gap-2 rounded-lg p-1 transition-opacity hover:opacity-80">
        <OrazakaLogo size={22} />
        <span className="font-display text-sm font-bold tracking-tight text-fg">Orazaka</span>
      </Link>
      <Badge tone="success" dot className="ml-3 hidden sm:inline-flex">
        {t.dashboard.sovereignBadge}
      </Badge>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <DropdownMenu.Root
          open={langDropdownOpen}
          onOpenChange={(openState) => {
            setLangDropdownOpen(openState);
            if (openState) setBellOpen(false);
          }}
        >
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="sm" aria-label={t.header.changeLanguage}>
              <GlobeIcon size={16} />
              <span className="uppercase">{locale}</span>
              <ChevronDownIcon size={12} className="opacity-50" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-40">
            {(["en", "fr"] as const).map((code) => (
              <DropdownMenu.Item key={code} onSelect={() => setLocale(code)} className="justify-between">
                <span>{code === "en" ? t.settings.english : t.settings.french}</span>
                {locale === code && <CheckIcon size={14} className="text-fg-accent" />}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <ThemeToggle
          id="theme-toggle"
          label={(mode) =>
            ({ "dark": t.header.themeDark, "light": t.header.themeLight, "system": t.header.themeSystem })[mode]
          }
        />

        {/* Notification Bell Dropdown */}
        {isAuthenticated && (
          <NotificationBell
            bellOpen={bellOpen}
            onToggle={(openState) => {
              setBellOpen(openState);
              setLangDropdownOpen(false);
            }}
          />
        )}

        {/* User → single link to Profile */}
        {isAuthenticated && user && (
          <Link
            href="/profile"
            title={t.header.profile}
            className="flex items-center gap-2.5 rounded-lg p-1 transition-colors duration-150 hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="hidden text-sm font-medium text-fg-secondary sm:inline-block">
              {user.name || user.email || "Admin"}
            </span>
            {/* No photo on an account: Orazaka's default picture (a person, one of six tones from the id), the initial while it loads. */}
            <Avatar size="sm" className="h-7 w-7" defaultAvatar={{ brand: "orazaka", seed: user.id ?? user.email ?? user.name ?? undefined }} fallback={initial} />
          </Link>
        )}
      </div>
    </header>
  );
};
