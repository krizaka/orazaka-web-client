"use client";

import * as React from "react";
import { getSession } from "next-auth/react";
import { useSettings } from "@/core/hooks/useSettings";
import { type Appearance, toAppearance, useAppearance } from "@/core/hooks/useAppearance";
import { useTranslation, type Locale } from "@/core/context/LocaleContext";
import {
  THEME_ACCENTS,
  THEME_ACCENT_LABELS,
  type AiPersona,
  type ThemeAccent,
  type ThemeLayout,
} from "@/constants/settings.constants";

/** Editable workspace/appearance preferences, mirrored from `Settings`. */
export interface ProfileFormState {
  language: Locale;
  aiPersona: AiPersona;
  themeName: string;
  themeTagline: string;
  themeAccent: ThemeAccent;
  themeLayout: ThemeLayout;
  theme: Appearance;
  tenantId: string;
}

const EMPTY: ProfileFormState = {
  language: "en",
  aiPersona: "standard",
  themeName: "Orazaka",
  themeTagline: "Decoupled Intelligence",
  themeAccent: "zinc",
  themeLayout: "standard",
  theme: "system",
  tenantId: "orazaka-default",
};

/**
 * Shared form state for the Profile Appearance + Workspace tabs.
 *
 * Lifts the preference state formerly held inside the deleted `SettingsForm`,
 * wrapping {@link useSettings} (persistence) and {@link useAppearance} (instant theme).
 * Exposes a single `save()` and a `isDirty` flag that drives the sticky Save bar.
 */
export function useProfileForm() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const { setLocale, t } = useTranslation();
  const { setAppearance: applyTheme } = useAppearance();

  const [form, setForm] = React.useState<ProfileFormState>(EMPTY);
  const [baseline, setBaseline] = React.useState<ProfileFormState>(EMPTY);
  const [availableThemes, setAvailableThemes] = React.useState<
    { value: string; label: string }[]
  >([]);

  // Hydrate from persisted settings once they resolve.
  React.useEffect(() => {
    if (!settings) return;
    const next: ProfileFormState = {
      language: settings.language as Locale,
      aiPersona: settings.aiPersona,
      themeName: settings.themeName || EMPTY.themeName,
      themeTagline: settings.themeTagline || EMPTY.themeTagline,
      themeAccent: settings.themeAccent || EMPTY.themeAccent,
      themeLayout: settings.themeLayout || EMPTY.themeLayout,
      theme: toAppearance(settings.theme),
      tenantId: settings.tenantId || EMPTY.tenantId,
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseline(next);
    setForm(next);
  }, [settings]);

  // Resolve accent options from the live model catalog, falling back to presets.
  React.useEffect(() => {
    let active = true;
    const presets = THEME_ACCENTS.map((a) => {
      const key = THEME_ACCENT_LABELS[a].split(".")[1] as keyof typeof t.settings;
      return { value: a, label: (t.settings[key] as string) || a };
    });
    const load = async () => {
      try {
        const session = await getSession();
        const res = await fetch("/api/v1/models/catalog", {
          headers: session?.user?.id
            ? { Authorization: `Bearer ${session.user.id}` }
            : {},
        });
        if (!res.ok) throw new Error("catalog unavailable");
        const themes = (await res.json()).filter(
          (m: { category: string }) => m.category === "theme",
        );
        if (active && themes.length > 0) {
          setAvailableThemes(
            themes.map((m: { modelName: string; modelLabel: string }) => ({
              value: m.modelName,
              label: m.modelLabel,
            })),
          );
          return;
        }
      } catch {
        // Fall through to presets.
      }
      if (active) setAvailableThemes(presets);
    };
    load();
    return () => {
      active = false;
    };
  }, [t]);

  const setField = React.useCallback(
    <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /** Language changes apply to the live locale immediately (still persisted on save). */
  const setLanguage = React.useCallback(
    (value: Locale) => {
      setField("language", value);
      setLocale(value);
    },
    [setField, setLocale],
  );

  /** Theme changes apply instantly via the ThemeProvider (still persisted on save). */
  const setTheme = React.useCallback(
    (value: Appearance) => {
      setField("theme", value);
      applyTheme(value);
    },
    [setField, applyTheme],
  );

  const isDirty = React.useMemo(
    () =>
      (Object.keys(form) as (keyof ProfileFormState)[]).some(
        (k) => form[k] !== baseline[k],
      ),
    [form, baseline],
  );

  const save = React.useCallback(() => {
    setBaseline(form);
    updateSettings(form);
  }, [form, updateSettings]);

  const discard = React.useCallback(() => {
    setForm(baseline);
    setLocale(baseline.language);
    applyTheme(baseline.theme);
  }, [baseline, setLocale, applyTheme]);

  return {
    form,
    setField,
    setLanguage,
    setTheme,
    availableThemes,
    isLoading,
    isUpdating,
    isDirty,
    save,
    discard,
  };
}

export type UseProfileForm = ReturnType<typeof useProfileForm>;
