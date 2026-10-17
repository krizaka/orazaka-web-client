"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrazakaLogo } from "@krizaka/ui";
import { RailNav } from "@krizaka/ui/rail-nav";
import { useAuth } from "@/core/hooks/useAuth";
import { useTranslation } from "@/core/context/LocaleContext";
import { AppSectionId, AppSectionPlace, appSectionsFor, currentAppSection, type AppSection } from "@/core/config/app-sections";

function item(s: AppSection, label: string, current: boolean) {
  const { Icon } = s;
  return (
    <RailNav.Item key={s.id} icon={<Icon size={20} />} label={label} current={current} asChild>
      <Link href={s.href} />
    </RailNav.Item>
  );
}

/**
 * The navigation of the signed-in app (core/config/app-sections.ts) — `@krizaka/ui` RailNav: a compact rail on a
 * desktop (the mark on top, where you work, Settings and Admin at the foot), the same items as a bottom tab bar on a
 * phone. Home is the mark (the rail) or the name (the bar). Sign out is in the user menu under the avatar.
 */
export function Sidebar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const current = currentAppSection(usePathname());
  const sections = appSectionsFor(user?.role === "admin");
  const main = sections.filter((s) => s.place === AppSectionPlace.Main && s.id !== AppSectionId.Home);
  const foot = sections.filter((s) => s.place === AppSectionPlace.Foot);

  return (
    <RailNav.Root
      label={t.appNav.label}
      accent="orazaka"
      mark={
        <Link href="/" aria-label={t.appNav.home}>
          <OrazakaLogo size={26} />
        </Link>
      }
      footer={foot.map((s) => item(s, t.appNav[s.id], current === s.id))}
    >
      {main.map((s) => item(s, t.appNav[s.id], current === s.id))}
    </RailNav.Root>
  );
}
