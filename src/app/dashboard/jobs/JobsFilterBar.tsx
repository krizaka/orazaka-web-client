"use client";

import { Icon } from "@krizaka/orazaka-design-system";
import type { TranslationDictionary } from "@/core/context/LocaleContext";

import { cn } from "@krizaka/ui/cn";

export type JobTab = "all" | "active" | "completed" | "failed";

interface JobsFilterBarProps {
  activeTab: JobTab;
  onTabChange: (tab: JobTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  t: TranslationDictionary;
}

/** Status-tab segmented control + feature-key search for the jobs dashboard. */
export function JobsFilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  t,
}: Readonly<JobsFilterBarProps>) {
  return (
    <nav className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-1 p-4 rounded-2xl border border-border-subtle/60 shadow-sm backdrop-blur-md">
      <div className="flex bg-surface-2/55 p-1 rounded-xl w-full md:w-auto">
        {(["all", "active", "completed", "failed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 capitalize",
              activeTab === tab
                ? "bg-surface-3 text-fg shadow-sm"
                : "text-fg-secondary hover:text-fg"
            )}
          >
            {
              {
                all: t.jobs?.statusAll || "All Tasks",
                active: t.jobs?.statusActive || "Active",
                completed: t.jobs?.statusCompleted || "Completed",
                failed: t.jobs?.statusFailed || "Failed",
              }[tab]
            }
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-72">
        <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-secondary pointer-events-none" />
        <input
          type="text"
          placeholder={t.jobs?.searchPlaceholder || "Search tasks by feature key..."}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-border-subtle/60 bg-transparent text-fg focus:outline-none focus:ring-2 focus:ring-border-subtle transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-secondary hover:text-fg"
          >
            <Icon name="close" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </nav>
  );
}
