"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatIcon, ClockIcon, CloseIcon, HomeIcon, LogoutIcon, PackIcon, ShieldIcon, StudioIcon, type IconProps } from "@krizaka/icons";
import { OrazakaLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { useAuth } from "@/core/hooks/useAuth";
import { useSidebar } from "@/core/context/SidebarContext";
import { useTenant } from "@/core/context/TenantContext";
import { useTranslation } from "@/core/context/LocaleContext";

interface NavItem {
  href: string;
  icon: ComponentType<IconProps>;
  label: string;
  adminOnly?: boolean;
}

/** The accent node of every active icon: the signature dot of @krizaka/icons lit in the brand colour. */
const ACCENT_NODE = "var(--kz-accent)";

/**
 * The navigation of the signed-in app, with the Krizaka signature icons (@krizaka/icons). Desktop: a 56 px rail of
 * icons with their label on hover, the active route marked by an accent bar. Mobile: a drawer with labels.
 */
export function Sidebar() {
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const { config } = useTenant();
  const { t } = useTranslation();
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/", icon: HomeIcon, label: t.sidebar.dashboard },
    { href: "/chat", icon: ChatIcon, label: t.sidebar.chatSessions },
    { href: "/studios", icon: StudioIcon, label: t.sidebar.studios },
    { href: "/packs", icon: PackIcon, label: t.sidebar.packs },
    { href: "/dashboard/jobs", icon: ClockIcon, label: t.sidebar.jobsHistory },
    { href: "/dashboard/admin", icon: ShieldIcon, label: t.sidebar.adminPanel, adminOnly: true },
  ].filter((item) => !item.adminOnly || user?.role === "admin");

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const tooltip =
    "pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap border border-border-subtle bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-fg opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100";

  return (
    <>
      <aside className="hidden h-full w-14 flex-shrink-0 flex-col md:flex">
        <nav aria-label={t.sidebar.navigation} className="krizaka-navbar relative h-full py-3">
          <Link href="/" aria-label={t.sidebar.dashboard} className="mb-4 grid h-10 w-10 place-items-center transition-opacity duration-200 hover:opacity-80">
            <OrazakaLogo size={26} />
          </Link>
          <ul className="flex w-full flex-1 flex-col items-center gap-1 px-1.5">
            {items.map(({ href, icon: Icon, label }) => {
              const active = isActive(href);
              return (
                <li key={href} className="w-full">
                  <Link
                    href={href}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex h-10 w-full items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-surface-2 text-fg-accent" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                    )}
                  >
                    {active && <span aria-hidden="true" className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 bg-accent" />}
                    <Icon size={19} nodeColor={active ? ACCENT_NODE : undefined} />
                    <span aria-hidden="true" className={tooltip}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <footer className="mt-1 w-full border-t border-border-subtle px-1.5 pt-2">
            <button
              type="button"
              onClick={logout}
              aria-label={t.sidebar.logout}
              className="group relative flex h-10 w-full items-center justify-center rounded-lg text-fg-muted transition-colors duration-200 hover:bg-danger/8 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <LogoutIcon size={19} />
              <span aria-hidden="true" className={tooltip}>{t.sidebar.logout}</span>
            </button>
          </footer>
        </nav>
      </aside>

      {isOpen && (
        <section className="fixed inset-0 z-50 flex md:hidden">
          <button type="button" aria-hidden="true" tabIndex={-1} onClick={close} className="fixed inset-0 cursor-default border-none bg-overlay backdrop-blur-sm" />
          <nav aria-label={t.sidebar.navigation} className="kz-fade relative z-50 flex h-full w-64 max-w-[80vw] flex-col border-r border-border-subtle bg-surface-1/95 backdrop-blur-xl">
            <header className="flex h-14 items-center justify-between border-b border-border-subtle px-5">
              <Link href="/" onClick={close} className="flex items-center gap-2.5">
                <OrazakaLogo size={26} />
                <span className="text-[13px] font-semibold tracking-[-0.02em] text-fg">{config.displayName}</span>
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label={t.sidebar.closeMenu}
                className="grid h-10 w-10 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <CloseIcon size={18} />
              </button>
            </header>
            <p className="hud-label mb-1 mt-3 px-5">{t.sidebar.navigation}</p>
            <ul className="flex-1 space-y-0.5 overflow-auto px-3">
              {items.map(({ href, icon: Icon, label }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-11 w-full items-center gap-3 px-3 text-sm transition-colors duration-200",
                        active ? "bg-surface-2 font-semibold text-fg" : "font-medium text-fg-secondary hover:bg-surface-2 hover:text-fg",
                      )}
                    >
                      {active && <span aria-hidden="true" className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 bg-accent" />}
                      <Icon size={18} className={cn("flex-shrink-0", active && "text-fg-accent")} nodeColor={active ? ACCENT_NODE : undefined} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <footer className="border-t border-border-subtle p-3">
              <button
                type="button"
                onClick={() => {
                  close();
                  logout();
                }}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-fg-secondary transition-colors duration-200 hover:bg-danger/8 hover:text-danger"
              >
                <LogoutIcon size={18} className="flex-shrink-0" />
                {t.sidebar.logout}
              </button>
            </footer>
          </nav>
        </section>
      )}
    </>
  );
}
