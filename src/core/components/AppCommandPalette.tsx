"use client";

import { useRouter } from "next/navigation";
import { CommandPalette, type CommandPaletteItem } from "@krizaka/orazaka-design-system";
import { useAuth } from "@/core/hooks/useAuth";
import { useTranslation } from "@/core/context/LocaleContext";

/**
 * The ⌘K palette of the web client: the design system's `CommandPalette` (a composite on @krizaka/ui/command) given
 * this app's routes — the sidebar's, in the same words — and its translated labels.
 */
export function AppCommandPalette() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const go = t.commandPalette.sectionGo;

  const commands: CommandPaletteItem[] = [
    { id: "dashboard", label: t.sidebar.dashboard, icon: "dashboard", href: "/", section: go },
    { id: "chat", label: t.sidebar.chatSessions, icon: "chat", href: "/chat", section: go },
    { id: "studios", label: t.sidebar.studios, icon: "studio", href: "/studios", section: go },
    { id: "packs", label: t.sidebar.packs, icon: "layers", href: "/packs", section: go },
    { id: "jobs", label: t.sidebar.jobsHistory, icon: "history", href: "/dashboard/jobs", section: go },
    ...(user?.role === "admin"
      ? [{ id: "admin", label: t.sidebar.adminPanel, icon: "admin", href: "/dashboard/admin", section: go } as const]
      : []),
    { id: "profile", label: t.header.profile, icon: "profile", href: "/profile", section: t.commandPalette.sectionAccount },
  ];

  return <CommandPalette commands={commands} labels={t.commandPalette} onNavigate={(href) => router.push(href)} />;
}
