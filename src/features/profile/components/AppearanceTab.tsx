"use client";

import * as React from "react";
import { useTranslation } from "@/core/context/LocaleContext";
import {
  THEME_LAYOUTS,
  THEME_LAYOUT_LABELS,
  type ThemeAccent,
  type ThemeLayout,
} from "@/constants/settings.constants";
import type { Locale } from "@/core/context/translations.types";
import { AppearancePicker } from "./AppearancePicker";
import { SelectField } from "./ProfileFormParts";
import type { UseProfileForm } from "@/features/profile/hooks/useProfileForm";
import { Card } from "@krizaka/ui/card";

/**
 * Appearance tab — theme mode (instant), accent, density, and language.
 * All controls are driven by the shared {@link UseProfileForm} state so edits
 * surface in the Profile sticky Save bar.
 */
export function AppearanceTab({ pf }: Readonly<{ pf: UseProfileForm }>) {
  const { t } = useTranslation();
  const { form, setField, setTheme, setLanguage, availableThemes } = pf;

  return (
    <Card.Root className="bg-surface-1 shadow-sm">
      <Card.Body padding="lg" className="gap-1.5">
        <Card.Title className="line-clamp-none tracking-tight group-hover:text-fg text-base font-semibold text-fg">
          {t.profile.appearanceTitle}
        </Card.Title>
        <Card.Description className="line-clamp-none text-sm text-fg-muted">
          {t.profile.appearanceDesc}
        </Card.Description>
      </Card.Body>
      <Card.Body padding="lg" className="block pt-0 space-y-6">
        <AppearancePicker theme={form.theme} onThemeChange={setTheme} />

        <hr className="border-border-subtle" />

        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            id="appearance-accent"
            label={t.settings.colorAccent}
            value={form.themeAccent}
            onChange={(e) => setField("themeAccent", e.target.value as ThemeAccent)}
          >
            {availableThemes.map((th) => (
              <option key={th.value} value={th.value}>
                {th.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="appearance-layout"
            label={t.settings.layoutScale}
            value={form.themeLayout}
            onChange={(e) => setField("themeLayout", e.target.value as ThemeLayout)}
          >
            {THEME_LAYOUTS.map((l) => (
              <option key={l} value={l}>
                {
                  t.settings[
                    THEME_LAYOUT_LABELS[l].split(".")[1] as keyof typeof t.settings
                  ] as string
                }
              </option>
            ))}
          </SelectField>

          <SelectField
            id="appearance-language"
            label={t.settings.language}
            value={form.language}
            onChange={(e) => setLanguage(e.target.value as Locale)}
          >
            <option value="en">{t.settings.english}</option>
            <option value="fr">{t.settings.french}</option>
          </SelectField>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
