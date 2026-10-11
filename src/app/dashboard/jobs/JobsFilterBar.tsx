"use client";

import { SearchIcon } from "@krizaka/icons";
import { Chip } from "@krizaka/ui/chip";
import { Input } from "@krizaka/ui/field";
import type { TranslationDictionary } from "@/core/context/LocaleContext";

export type JobTab = "all" | "active" | "completed" | "failed";

interface JobsFilterBarProps {
  activeTab: JobTab;
  onTabChange: (tab: JobTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  t: TranslationDictionary;
}

/** Status filter (the @krizaka/ui chips, one at a time) + search, on the platform's field. */
export function JobsFilterBar({ activeTab, onTabChange, searchQuery, onSearchChange, t }: Readonly<JobsFilterBarProps>) {
  const labels: Record<JobTab, string> = {
    all: t.jobs.statusAll,
    active: t.jobs.statusActive,
    completed: t.jobs.statusCompleted,
    failed: t.jobs.statusFailed,
  };
  return (
    <nav className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
      <Chip.Group
        type="single"
        size="sm"
        required
        label={t.jobs.title}
        value={activeTab}
        onValueChange={(value) => onTabChange((value || "all") as JobTab)}
        className="gap-1.5"
      >
        {(["all", "active", "completed", "failed"] as const).map((tab) => (
          <Chip key={tab} value={tab}>
            {labels[tab]}
          </Chip>
        ))}
      </Chip.Group>

      <div className="relative w-full md:w-72">
        <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
        <Input
          type="search"
          aria-label={t.jobs.searchPlaceholder}
          placeholder={t.jobs.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </nav>
  );
}
