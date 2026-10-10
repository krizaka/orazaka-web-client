"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { QueryProvider } from "./QueryProvider";
import { SidebarProvider } from "@/core/context/SidebarContext";
import { TenantProvider } from "@/core/context/TenantContext";
import { LocaleProvider } from "@/core/context/LocaleContext";
import { JobStreamProvider } from "@/core/context/JobStreamContext";
import { AppToaster } from "@/core/components/AppToaster";
import { AppCommandPalette } from "@/core/components/AppCommandPalette";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Unified application provider tree wrapping all required context contexts.
 *
 * The theme is the organisation's (@krizaka/ui/theme): <ThemeScript /> in the root layout applies the persisted
 * choice before the first paint, this provider keeps it; {@link useAppearance} maps it to the profile's value.
 *
 * @param props The provider tree properties.
 * @returns The wrapped ReactNode provider layout.
 */
export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <ThemeProvider defaultMode="system">
      <SessionProvider>
        <QueryProvider>
          <LocaleProvider>
            <TenantProvider>
              <SidebarProvider>
                <JobStreamProvider>
                  <AppCommandPalette />
                  {children}
                  <AppToaster />
                </JobStreamProvider>
              </SidebarProvider>
            </TenantProvider>
          </LocaleProvider>
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
