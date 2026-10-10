"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/core/hooks/useAuth";
import { ThemeToggle } from "@krizaka/ui/theme";
import { useSidebar } from "@/core/context/SidebarContext";
import { useTenant } from "@/core/context/TenantContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { CheckIcon, ChevronDownIcon, GlobeIcon, MenuIcon } from "@krizaka/icons";
import { NotificationBell } from "./NotificationBell";

import { cn } from "@krizaka/ui/cn";

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
 * @see {@link useTenant}
 * @see {@link useTranslation}
 */
export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { open } = useSidebar();
  const { accentClasses } = useTenant();
  const { locale, setLocale, t } = useTranslation();

  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);
  const [bellOpen, setBellOpen] = React.useState(false);

  const initial = React.useMemo(() => {
    if (!user) return "U";
    const val = user.name || user.email || "User";
    return val[0].toUpperCase();
  }, [user]);

  const dropdownPanelClass =
    "absolute right-0 mt-2 rounded-lg border border-border-default bg-surface-2 p-1 shadow-lg z-20";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border-subtle bg-surface-1 px-5">
      <div className="flex items-center md:hidden">
        <button
          onClick={open}
          className="mr-2 p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t.header.openSidebar}
        >
          <MenuIcon size={20} />
        </button>
      </div>
      <div className="flex-1" /> {/* Spacer */}
      <div className="flex items-center gap-3">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setLangDropdownOpen(!langDropdownOpen);
              setBellOpen(false);
            }}
            className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2.5 py-1.5 text-xs font-medium text-fg-secondary hover:bg-surface-2 hover:text-fg transition-colors duration-150"
            aria-label={t.header.changeLanguage}
          >
            <GlobeIcon size={16} />
            <span className="uppercase">{locale}</span>
            <ChevronDownIcon size={12} className="opacity-50" />
          </button>

          {langDropdownOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 bg-transparent border-none cursor-default"
                aria-label={t.header.closeLanguageMenu}
                onClick={() => setLangDropdownOpen(false)}
              />
              <div className={cn(dropdownPanelClass, "w-36")}>
                <button
                  onClick={() => {
                    setLocale("en");
                    setLangDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors duration-150",
                    locale === "en"
                      ? cn(accentClasses.bgSoft, accentClasses.text, "font-medium")
                      : "text-fg-secondary hover:bg-surface-3 hover:text-fg"
                  )}
                >
                  <span>{t.settings.english}</span>
                  {locale === "en" && <CheckIcon size={14} />}
                </button>
                <button
                  onClick={() => {
                    setLocale("fr");
                    setLangDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors duration-150",
                    locale === "fr"
                      ? cn(accentClasses.bgSoft, accentClasses.text, "font-medium")
                      : "text-fg-secondary hover:bg-surface-3 hover:text-fg"
                  )}
                >
                  <span>{t.settings.french}</span>
                  {locale === "fr" && <CheckIcon size={14} />}
                </button>
              </div>
            </>
          )}
        </div>

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
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                accentClasses.bg,
                "text-xs font-semibold", accentClasses.textOn
              )}
            >
              {initial}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};
