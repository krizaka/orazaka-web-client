"use client";

import { useState } from "react";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioCatalogue } from "@/features/studio/components/StudioCatalogue";
import { InstalledStudios } from "@/features/studio/components/InstalledStudios";

type StudioTab = "mine" | "explore";

/**
 * The Studios section shell: My Studios and Explore.
 *
 * Explore is the default tab for a user with nothing installed, because an empty
 * "My Studios" is a dead end and the catalogue is the whole point of arriving here.
 */
export function StudiosHome() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<StudioTab>("explore");

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
          {t.studio.title}
        </h1>
        <p className="text-[12px] text-[var(--text-secondary)]">{t.studio.subtitle}</p>
      </header>

      <div
        role="tablist"
        aria-label={t.studio.title}
        className="flex items-center gap-1 border-b border-[var(--border-subtle)]"
      >
        <TabButton
          label={t.studio.tabMine}
          active={tab === "mine"}
          onSelect={() => setTab("mine")}
        />
        <TabButton
          label={t.studio.tabExplore}
          active={tab === "explore"}
          onSelect={() => setTab("explore")}
        />
      </div>

      {tab === "explore" ? (
        <StudioCatalogue />
      ) : (
        <InstalledStudios onBrowse={() => setTab("explore")} />
      )}
    </div>
  );
}

interface TabButtonProps {
  label: string;
  active: boolean;
  onSelect: () => void;
}

/** One tab. Extracted so the shell above stays a layout rather than a loop body. */
function TabButton({ label, active, onSelect }: Readonly<TabButtonProps>) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`relative h-8 px-3 text-[12px] font-medium transition-colors duration-150 ${
        active
          ? "text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      }`}
    >
      {label}
      {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--accent)]" />}
    </button>
  );
}
