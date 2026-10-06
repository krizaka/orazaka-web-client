"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import type { Theme } from "@/core/providers/ThemeProvider";
import { ThemePreviewCard } from "./ThemePreviewCard";

interface ThemeModeSelectorProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

/** Preview color tokens for each theme mode. */
const PREVIEWS: Record<
  Theme,
  {
    sidebar: string;
    header: string;
    body: string;
    accent: string;
    text: string;
  }
> = {
  system: {
    sidebar: "bg-surface-3 dark:bg-surface-2",
    header: "bg-surface-2 dark:bg-surface-1",
    body: "bg-white dark:bg-surface-0",
    accent: "bg-status-warning",
    text: "bg-surface-3",
  },
  light: {
    sidebar: "bg-surface-2",
    header: "bg-white",
    body: "bg-surface-1",
    accent: "bg-status-warning",
    text: "bg-surface-3",
  },
  dark: {
    sidebar: "bg-surface-1",
    header: "bg-surface-0",
    body: "bg-surface-0",
    accent: "bg-status-warning",
    text: "bg-surface-2",
  },
  custom: {
    sidebar: "bg-accent",
    header: "bg-surface-0",
    body: "bg-surface-0",
    accent: "bg-accent",
    text: "bg-surface-2",
  },
  cyberpunk: {
    sidebar: "bg-accent",
    header: "bg-black",
    body: "bg-accent/80",
    accent: "bg-accent",
    text: "bg-accent",
  },
  solarized: {
    sidebar: "bg-status-warning",
    header: "bg-status-warning",
    body: "bg-status-warning/60",
    accent: "bg-accent",
    text: "bg-status-warning",
  },
};

/**
 * Premium theme mode selector with live mini-previews, animated gradient
 * borders, selection feedback, and contextual status bar.
 *
 * Interactions:
 * - Hover  → "Click to apply" overlay appears
 * - Click  → pulse animation + status bar slides in with confirmation
 * - Active → rotating conic gradient border + checkmark badge
 */
export function ThemeModeSelector({
  theme,
  onThemeChange,
}: Readonly<ThemeModeSelectorProps>) {
  const { t } = useTranslation();
  const [statusTheme, setStatusTheme] = React.useState<string | null>(null);
  const statusTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const options: {
    value: Theme;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "system",
      label: t.settings.themeSystem,
      icon: <Icon name="laptop" className="w-3.5 h-3.5" />,
      desc: t.settings.themeSystemDesc,
    },
    {
      value: "light",
      label: t.settings.themeLight,
      icon: <Icon name="sun" className="w-3.5 h-3.5" />,
      desc: t.settings.themeLightDesc,
    },
    {
      value: "dark",
      label: t.settings.themeDark,
      icon: <Icon name="moon" className="w-3.5 h-3.5" />,
      desc: t.settings.themeDarkDesc,
    },
    {
      value: "custom",
      label: t.settings.themeCustom,
      icon: <Icon name="shield" className="w-3.5 h-3.5" />,
      desc: t.settings.themeCustomDesc,
    },
    {
      value: "cyberpunk",
      label: t.settings.themeCyberpunk,
      icon: <Icon name="spark" className="w-3.5 h-3.5" />,
      desc: t.settings.themeCyberpunkDesc,
    },
    {
      value: "solarized",
      label: t.settings.themeSolarized,
      icon: <Icon name="compass" className="w-3.5 h-3.5" />,
      desc: t.settings.themeSolarizedDesc,
    },
  ];

  const handleThemeChange = (val: Theme) => {
    onThemeChange(val);
    const selected = options.find((o) => o.value === val);
    setStatusTheme(selected?.label ?? val);
    if (statusTimeout.current) clearTimeout(statusTimeout.current);
    statusTimeout.current = setTimeout(() => setStatusTheme(null), 3000);
  };

  return (
    <section className="space-y-3">
      {/* ── Section header ─────────────────────────── */}
      <header className="flex items-center gap-2">
        <figure className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="palette" className="w-3.5 h-3.5 text-foreground/70" />
        </figure>
        <aside>
          <label className="text-sm font-semibold text-foreground block leading-tight">
            {t.settings.themeMode.replace(" (theme)", "")}
          </label>
          <span className="text-[11px] text-foreground/40 leading-tight">
            {t.settings.themeChangesInstant}
          </span>
        </aside>
      </header>

      {/* ── Theme grid ─────────────────────────────── */}
      <div className="grid gap-2.5 grid-cols-3 stagger-children">
        {options.map((opt, i) => (
          <ThemePreviewCard
            key={opt.value}
            value={opt.value}
            label={opt.label}
            desc={opt.desc}
            icon={opt.icon}
            preview={PREVIEWS[opt.value]}
            isActive={theme === opt.value}
            onClick={() => handleThemeChange(opt.value)}
            index={i}
            clickToApplyLabel={t.settings.themeClickToApply}
          />
        ))}
      </div>

      {/* ── Status feedback bar ────────────────────── */}
      {statusTheme && (
        <div
          key={statusTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-status-success/8 border border-status-success/15 theme-status-slide"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success" />
          </span>
          <span className="text-xs text-foreground/70">
            <strong className="text-foreground/90">{statusTheme}</strong>{" "}
            {t.settings.themeApplied}
          </span>
        </div>
      )}
    </section>
  );
}
