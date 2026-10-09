/* eslint-disable */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { SentinelMini } from "@krizaka/orazaka-design-system";
import { useAuth } from "@/core/hooks/useAuth";
import { useSidebar } from "@/core/context/SidebarContext";
import { useTenant } from "@/core/context/TenantContext";
import { useTranslation } from "@/core/context/LocaleContext";

import { cn } from "@krizaka/ui/cn";

interface NavItem {
  href: string;
  icon: IconName;
  label: string;
  adminOnly?: boolean;
}

/**
 * Krizaka Icon-Only Sidebar Rail (56px / w-14).
 *
 * Desktop: icon-only rail with tooltip labels on hover, active route indicator,
 * and bottom-anchored user profile avatar. Mobile: full-width drawer with labels.
 */
export function Sidebar() {
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const { config } = useTenant();
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", icon: "dashboard", label: t.sidebar.dashboard },
    { href: "/chat", icon: "chat", label: t.sidebar.chatSessions },
    { href: "/studios", icon: "studio", label: t.sidebar.studios },
    { href: "/packs", icon: "layers", label: t.sidebar.packs },
    { href: "/dashboard/jobs", icon: "history", label: t.sidebar.jobsHistory },
    {
      href: "/dashboard/admin",
      icon: "admin",
      label: t.sidebar.adminPanel,
      adminOnly: true,
    },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin",
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  /* ─── Desktop: Icon-Only Rail ────────────────────────── */
  const desktopRail = (
    <div className="krizaka-navbar h-full py-3 relative">
      {/* Brand logo */}
      <Link
        href="/"
        className="flex items-center justify-center w-10 h-10 mb-4 transition-opacity duration-200 hover:opacity-80"
      >
        <SentinelMini size={22} />
      </Link>

      {/* Nav icons */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full px-1.5">
        {visibleItems.map(({ href, icon: iconName, label }, index) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={{
                animationDelay: `${index * 40}ms`,
                animationFillMode: "backwards",
              }}
              className="animate-in fade-in duration-300 block w-full"
            >
              <div
                className={cn(
                  "relative flex items-center justify-center w-full h-10 transition-all duration-200 group",
                  active
                    ? "text-accent bg-surface-2"
                    : "text-fg-muted hover:text-fg hover:bg-surface-2"
                )}
              >
                {/* Active indicator pill */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent animate-in fade-in zoom-in-50 duration-200" />
                )}
                <Icon name={iconName} size={18} />

                {/* Tooltip label on hover */}
                <span className="absolute left-full ml-2 px-2.5 py-1 text-[11px] font-medium text-fg bg-surface-2 border border-border-subtle shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom-anchored Log out */}
      <div className="w-full px-1.5 pt-2 mt-1 border-t border-border-subtle">
        <button
          type="button"
          onClick={logout}
          title={t.sidebar.logout}
          aria-label={t.sidebar.logout}
          className="group relative flex items-center justify-center w-full h-10 rounded-lg text-fg-muted hover:text-danger hover:bg-danger/8 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          <Icon name="logout" size={18} />
          <span className="absolute left-full ml-2 px-2.5 py-1 text-[11px] font-medium text-fg bg-surface-2 border border-border-subtle shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
            {t.sidebar.logout}
          </span>
        </button>
      </div>
    </div>
  );

  /* ─── Mobile: Full-Width Drawer with Labels ──────────── */
  const mobileDrawerContent = (
    <div className="flex h-full w-full flex-col border-r border-border-subtle bg-surface-1/82 backdrop-blur-xl backdrop-saturate-[180%]">
      {/* Brand header */}
      <div className="flex h-14 items-center justify-between px-5 border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-2.5" onClick={close}>
          <SentinelMini size={24} className="transition-opacity duration-200 hover:opacity-80" />
          <h1 className="text-[13px] font-semibold tracking-[-0.02em] text-fg">
            {config.displayName}
          </h1>
        </Link>
        <button
          onClick={close}
          className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors duration-150"
          aria-label="Close Sidebar"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      {/* Nav items with labels */}
      <div className="flex-1 overflow-auto py-3">
        <span className="hud-label px-5 mb-1 block">{t.sidebar.navigation}</span>
        <nav className="space-y-0.5 px-3">
          {visibleItems.map(({ href, icon: iconName, label }, index) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                style={{
                  animationDelay: `${index * 40}ms`,
                  animationFillMode: "backwards",
                }}
                className="animate-in fade-in slide-in-from-left-2 duration-300 block"
              >
                <div
                  className={cn(
                    "w-full flex items-center gap-2.5 h-9 px-3 text-sm transition-all duration-200 relative",
                    active
                      ? "font-semibold text-fg bg-surface-2"
                      : "font-medium text-fg-secondary hover:text-fg hover:bg-surface-2"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent animate-in fade-in zoom-in-50 duration-200" />
                  )}
                  <Icon
                    name={iconName}
                    size={16}
                    className={cn(
                      "flex-shrink-0 transition-colors duration-200",
                      active ? "text-accent" : ""
                    )}
                  />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Log out */}
      <div className="p-3 border-t border-border-subtle">
        <button
          type="button"
          onClick={() => {
            close();
            logout();
          }}
          className="w-full flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm font-medium text-fg-secondary hover:text-danger hover:bg-danger/8 transition-colors duration-200 cursor-pointer"
        >
          <Icon name="logout" size={16} className="flex-shrink-0" />
          {t.sidebar.logout}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: icon-only rail */}
      <div className="hidden md:flex h-full w-14 flex-col flex-shrink-0">
        {desktopRail}
      </div>

      {/* Mobile: full drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <button
            type="button"
            className="fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-200 border-none cursor-default"
            aria-label="Close sidebar"
            onClick={close}
          />
          <div className="relative flex flex-col w-56 max-w-[80vw] h-full bg-surface-1/90 backdrop-blur-xl backdrop-saturate-[180%] z-50 transition-transform duration-200">
            {mobileDrawerContent}
          </div>
        </div>
      )}
    </>
  );
}
