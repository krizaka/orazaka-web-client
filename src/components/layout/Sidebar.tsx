"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseIcon } from "@krizaka/icons";
import { OrazakaLogo } from "@krizaka/ui";
import { IconButton } from "@krizaka/ui/button";
import { cn } from "@krizaka/ui/cn";
import { useAuth } from "@/core/hooks/useAuth";
import { useSidebar } from "@/core/context/SidebarContext";
import { useTenant } from "@/core/context/TenantContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { AppSectionPlace, appSectionsFor, currentAppSection, type AppSection } from "@/core/config/app-sections";

/** The accent node of every active icon: the signature dot of @krizaka/icons lit in the brand colour. */
const ACCENT_NODE = "var(--kz-accent)";

const TOOLTIP =
  "pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap border border-border-subtle bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-fg opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100";

/** One icon of the rail: its label on hover and focus, the current section marked by the accent bar. */
function RailLink({ section, label, active }: Readonly<{ section: AppSection; label: string; active: boolean }>) {
  const { Icon } = section;
  return (
    <li className="w-full">
      <Link
        href={section.href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-10 w-full items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "bg-surface-2 text-fg-accent" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
        )}
      >
        {active && <span aria-hidden="true" className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 bg-accent" />}
        <Icon size={19} nodeColor={active ? ACCENT_NODE : undefined} />
        <span aria-hidden="true" className={TOOLTIP}>{label}</span>
      </Link>
    </li>
  );
}

/** One row of the phone drawer: icon and label. */
function DrawerLink({ section, label, active, onClick }: Readonly<{ section: AppSection; label: string; active: boolean; onClick: () => void }>) {
  const { Icon } = section;
  return (
    <li>
      <Link
        href={section.href}
        onClick={onClick}
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
}

/**
 * The navigation of the signed-in app (core/config/app-sections.ts), with the Krizaka signature icons. Desktop: a 56 px
 * rail — where you work on top (Home, Studios, Chat, Jobs, Packs, Usage & credits), Settings and Admin at its foot.
 * Phone: a drawer with the same sections and words. Sign out is in the user menu under the avatar, not here.
 */
export function Sidebar() {
  const { user } = useAuth();
  const { isOpen, close } = useSidebar();
  const { config } = useTenant();
  const { t } = useTranslation();
  const current = currentAppSection(usePathname());
  const sections = appSectionsFor(user?.role === "admin");
  const main = sections.filter((s) => s.place === AppSectionPlace.Main);
  const foot = sections.filter((s) => s.place === AppSectionPlace.Foot);

  return (
    <>
      <aside className="hidden h-full w-14 flex-shrink-0 flex-col md:flex">
        <nav aria-label={t.appNav.label} className="krizaka-navbar relative flex h-full flex-col pb-3">
          <Link href="/" aria-label={t.appNav.home} className="mb-2 grid h-14 w-full flex-shrink-0 place-items-center transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span data-brand-mark className="grid place-items-center">
              <OrazakaLogo size={26} />
            </span>
          </Link>
          <ul className="flex w-full flex-1 flex-col items-center gap-1 px-1.5">
            {main.map((s) => <RailLink key={s.id} section={s} label={t.appNav[s.id]} active={current === s.id} />)}
          </ul>
          <ul className="mt-1 flex w-full flex-col items-center gap-1 border-t border-border-subtle px-1.5 pt-2">
            {foot.map((s) => <RailLink key={s.id} section={s} label={t.appNav[s.id]} active={current === s.id} />)}
          </ul>
        </nav>
      </aside>

      {isOpen && (
        <section className="fixed inset-0 z-50 flex md:hidden">
          <button type="button" aria-hidden="true" tabIndex={-1} onClick={close} className="fixed inset-0 cursor-default border-none bg-overlay backdrop-blur-sm" />
          <nav aria-label={t.appNav.label} className="kz-fade relative z-50 flex h-full w-64 max-w-[80vw] flex-col border-r border-border-subtle bg-surface-1/95 backdrop-blur-xl">
            <header className="flex h-14 items-center justify-between border-b border-border-subtle px-5">
              <Link href="/" onClick={close} className="flex items-center gap-2.5">
                <OrazakaLogo size={26} />
                <span className="text-[13px] font-semibold tracking-[-0.02em] text-fg">{config.displayName}</span>
              </Link>
              <IconButton variant="ghost" onClick={close} label={t.sidebar.closeMenu}>
                <CloseIcon size={18} />
              </IconButton>
            </header>
            <ul className="mt-3 flex-1 space-y-0.5 overflow-auto px-3">
              {main.map((s) => <DrawerLink key={s.id} section={s} label={t.appNav[s.id]} active={current === s.id} onClick={close} />)}
            </ul>
            <ul className="space-y-0.5 border-t border-border-subtle p-3">
              {foot.map((s) => <DrawerLink key={s.id} section={s} label={t.appNav[s.id]} active={current === s.id} onClick={close} />)}
            </ul>
          </nav>
        </section>
      )}
    </>
  );
}
