"use client";

/**
 * @file TenantContext.tsx
 * @description Context provider and hook for managing and resolving dynamic tenant configuration and styling accents.
 *
 * Client Directive: "use client"
 * State & Memoization: Uses React.useMemo to compute and cache layout config based on theme properties.
 * See: {@link TenantConfig}
 */

import * as React from "react";
import { useSettings } from "@/core/hooks/useSettings";
import { TenantConfig } from "@/core/types/tenant.types";
import { useTheme } from "@/core/providers/ThemeProvider";

/**
 * Interface mapping available visual utility classes for Tailwind css components.
 */
export interface AccentClasses {
  text: string;
  bg: string;
  hoverBg: string;
  border: string;
  ring: string;
  bgSoft: string;
  textBright: string;
  accentGradient: string;
}

/**
 * Map containing functional CSS classes corresponding to color theme accents.
 * Prevents hardcoding of color utility lists inside core components.
 */
export const accentMap: Record<string, AccentClasses> = {
  rose: {
    text: "text-status-error",
    bg: "bg-status-error",
    hoverBg: "hover:bg-status-error dark:hover:bg-status-error",
    border: "border-status-error",
    ring: "focus:ring-status-error focus-visible:ring-status-error",
    bgSoft: "bg-status-error/20",
    textBright: "text-status-error",
    accentGradient: "from-status-error to-accent",
  },
  emerald: {
    text: "text-status-success",
    bg: "bg-status-success",
    hoverBg: "hover:bg-status-success dark:hover:bg-status-success",
    border: "border-status-success",
    ring: "focus:ring-status-success focus-visible:ring-status-success",
    bgSoft: "bg-status-success/20",
    textBright: "text-status-success",
    accentGradient: "from-status-success to-status-success",
  },
  amber: {
    text: "text-status-warning",
    bg: "bg-status-warning",
    hoverBg: "hover:bg-status-warning dark:hover:bg-status-warning",
    border: "border-status-warning",
    ring: "focus:ring-status-warning focus-visible:ring-status-warning",
    bgSoft: "bg-status-warning/20",
    textBright: "text-status-warning",
    accentGradient: "from-status-warning to-status-warning",
  },
  zinc: {
    text: "text-text-muted dark:text-text-secondary",
    bg: "bg-surface-3",
    hoverBg: "hover:bg-surface-3 dark:hover:bg-surface-3",
    border: "border-border-subtle",
    ring: "focus:ring-border-subtle focus-visible:ring-border-subtle",
    bgSoft: "bg-surface-1 dark:bg-surface-0/20",
    textBright: "text-text-secondary",
    accentGradient:
      "from-surface-3 to-surface-3 dark:from-surface-3 dark:to-surface-3",
  },
};

/**
 * Shape of the Tenant context state object.
 */
interface TenantContextType {
  config: TenantConfig;
  accentClasses: AccentClasses;
}

/**
 * Context container for holding active tenant metadata.
 */
const TenantContext = React.createContext<TenantContextType | undefined>(
  undefined,
);

/**
 * TenantProvider component wrapping context injection.
 * Resolves active tenant config from global state hooks and passes down theme layouts.
 *
 * @param props - Component React properties.
 * @param props.children - Child nodes to be injected inside the provider wrapper.
 * @returns The context Provider rendering element.
 */
export function TenantProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { settings } = useSettings();

  const themeAccent = settings?.themeAccent || "zinc";
  const themeName = settings?.themeName || "Orazaka";
  const themeTagline = settings?.themeTagline || "Decoupled Intelligence";
  const themeLayout = settings?.themeLayout || "standard";
  // Check user settings preferences or fallback to a default ID
  const tenantId = settings?.tenantId || "orazaka-default";

  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings?.theme, setTheme]);

  const contextValue = React.useMemo<TenantContextType>(() => {
    const normalizedAccent = (() => {
      if (themeAccent.includes("rose")) return "rose";
      if (themeAccent.includes("emerald")) return "emerald";
      if (themeAccent.includes("amber")) return "amber";
      return "zinc";
    })();
    const accentClass = accentMap[normalizedAccent] ? normalizedAccent : "zinc";
    const accentClasses = accentMap[accentClass];

    return {
      config: {
        accentClass,
        displayName: themeName,
        tagline: themeTagline,
        tenantId,
        layoutMode: themeLayout,
      },
      accentClasses,
    };
  }, [themeAccent, themeName, themeTagline, themeLayout, tenantId]);

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Custom React Hook to consume the Tenant context.
 *
 * @throws {Error} If called outside of a wrapping {@link TenantProvider}.
 * @returns The active {@link TenantContextType} state configuration.
 */
export function useTenant() {
  const context = React.useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
