"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import type { Appearance } from "@/core/hooks/useAppearance";
import { ThemePreviewCard } from "./ThemePreviewCard";

interface ThemeModeSelectorProps {
  theme: Appearance;
  onThemeChange: (theme: Appearance) => void;
}

/**
 * Premium theme mode selector with live mini-previews (each drawn in its own theme's tokens), animated gradient
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
    value: Appearance;
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
      value: "electric",
      label: t.settings.themeElectric,
      icon: <Icon name="spark" className="w-3.5 h-3.5" />,
      desc: t.settings.themeElectricDesc,
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
      icon: <Icon name="cpu" className="w-3.5 h-3.5" />,
      desc: t.settings.themeCyberpunkDesc,
    },
    {
      value: "solarized",
      label: t.settings.themeSolarized,
      icon: <Icon name="compass" className="w-3.5 h-3.5" />,
      desc: t.settings.themeSolarizedDesc,
    },
  ];

  const handleThemeChange = (val: Appearance) => {
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
          <Icon name="palette" className="w-3.5 h-3.5 text-fg/70" />
        </figure>
        <aside>
          <label className="text-sm font-semibold text-fg block leading-tight">
            {t.settings.themeMode.replace(" (theme)", "")}
          </label>
          <span className="text-[11px] text-fg/40 leading-tight">
            {t.settings.themeChangesInstant}
          </span>
        </aside>
      </header>

      {/* ── Theme grid ─────────────────────────────── */}
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4 stagger-children">
        {options.map((opt) => (
          <ThemePreviewCard
            key={opt.value}
            value={opt.value}
            label={opt.label}
            desc={opt.desc}
            icon={opt.icon}
            isActive={theme === opt.value}
            onClick={() => handleThemeChange(opt.value)}
            clickToApplyLabel={t.settings.themeClickToApply}
          />
        ))}
      </div>

      {/* ── Status feedback bar ────────────────────── */}
      {statusTheme && (
        <div
          key={statusTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/8 border border-success/15 theme-status-slide"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-xs text-fg/70">
            <strong className="text-fg/90">{statusTheme}</strong>{" "}
            {t.settings.themeApplied}
          </span>
        </div>
      )}
    </section>
  );
}
