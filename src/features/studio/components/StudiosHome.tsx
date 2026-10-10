"use client";

import { useState } from "react";
import { Tabs } from "@krizaka/ui/tabs";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioCatalogue } from "@/features/studio/components/StudioCatalogue";
import { InstalledStudios } from "@/features/studio/components/InstalledStudios";

type StudioTab = "mine" | "explore";

/**
 * The Studios section shell: My Studios and Explore, on the @krizaka/ui tabs (Radix: tablist, tab, tabpanel, arrows).
 *
 * Explore is the default tab for a user with nothing installed, because an empty
 * "My Studios" is a dead end and the catalogue is the whole point of arriving here.
 */
export function StudiosHome() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<StudioTab>("explore");

  return (
    <Tabs.Root value={tab} onValueChange={(value) => setTab(value as StudioTab)} className="gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-fg">{t.studio.title}</h1>
        <p className="text-[12px] text-fg-secondary">{t.studio.subtitle}</p>
      </header>

      <Tabs.List aria-label={t.studio.title} className="border-border-subtle">
        <Tabs.Trigger value="mine" className="py-2 text-[12px] font-medium">
          {t.studio.tabMine}
        </Tabs.Trigger>
        <Tabs.Trigger value="explore" className="py-2 text-[12px] font-medium">
          {t.studio.tabExplore}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="explore">
        <StudioCatalogue />
      </Tabs.Content>
      <Tabs.Content value="mine">
        <InstalledStudios onBrowse={() => setTab("explore")} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
