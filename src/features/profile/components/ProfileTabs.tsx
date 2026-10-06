"use client";

import * as React from "react";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";

export interface ProfileTab {
  id: string;
  label: string;
  icon: IconName;
}

interface ProfileTabsProps {
  tabs: ProfileTab[];
  active: string;
  onChange: (id: string) => void;
}

/**
 * Sticky segmented tab control for the Profile view.
 *
 * Token-styled pill rail with an animated active surface, full keyboard support
 * (Arrow/Home/End + roving focus) and ARIA `tab`/`tablist` semantics. Horizontally
 * scrollable on narrow viewports so it never overflows.
 */
export function ProfileTabs({ tabs, active, onChange }: Readonly<ProfileTabsProps>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const i = (index + tabs.length) % tabs.length;
    onChange(tabs[i].id);
    refs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusTab(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusTab(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(tabs.length - 1);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      className="sticky top-0 z-10 -mx-1 flex gap-1 overflow-x-auto scrollbar-thin rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-1)_88%,transparent)] p-1 backdrop-blur-xl backdrop-saturate-150"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            role="tab"
            id={`profile-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`profile-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={`relative flex flex-1 min-w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              isActive
                ? "bg-[var(--surface-2)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon
              name={tab.icon}
              size={16}
              className={isActive ? "text-[var(--accent)]" : ""}
            />
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-px h-px bg-[var(--accent)] opacity-60" />
            )}
          </button>
        );
      })}
    </div>
  );
}
