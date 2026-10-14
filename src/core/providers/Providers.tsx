"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { MotionObserver } from "@krizaka/ui";
import { ThemeProvider } from "@krizaka/ui/theme";
import { QueryProvider } from "./QueryProvider";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import type { AuthFlags } from "@/core/config/auth-flags";
import { SidebarProvider } from "@/core/context/SidebarContext";
import { TenantProvider } from "@/core/context/TenantContext";
import { LocaleProvider } from "@/core/context/LocaleContext";
import { JobStreamProvider } from "@/core/context/JobStreamContext";
import { AppToaster } from "@/core/components/AppToaster";
import { AppCommandPalette } from "@/core/components/AppCommandPalette";
import { AppCharts } from "@/core/components/AppCharts";

interface ProvidersProps {
  children: ReactNode;
  /** AUTH_LOGIN_ENABLED / AUTH_SIGNUP_ENABLED, read on the server. */
  authFlags: AuthFlags;
}

/**
 * Unified application provider tree wrapping all required context contexts.
 *
 * The theme is the organisation's (@krizaka/ui/theme): <ThemeScript /> in the root layout applies the persisted
 * choice before the first paint, this provider keeps it; {@link useAppearance} maps it to the profile's value.
 *
 * <AppCharts> gives every chart the reader's locale, the Orazaka palette and its words.
 *
 * <MotionObserver /> is mounted once here: every `[data-reveal]` of the app (the landing and the signed-in screens)
 * rises into view, and `.kz-spotlight` cards follow the pointer.
 *
 * @param props The provider tree properties.
 * @returns The wrapped ReactNode provider layout.
 */
export function Providers({ children, authFlags }: Readonly<ProvidersProps>) {
  // Sign-in closed: there is no session to look for — `session={null}` keeps next-auth from calling /api/auth/session.
  const sessionProps = authFlags.login ? {} : { session: null, refetchOnWindowFocus: false, refetchInterval: 0 };
  return (
    <AuthFlagsProvider flags={authFlags}>
    <ThemeProvider defaultMode="system">
      <SessionProvider {...sessionProps}>
        <QueryProvider>
          <LocaleProvider>
            <TenantProvider>
              <SidebarProvider>
                <JobStreamProvider>
                  <AppCommandPalette />
                  <MotionObserver />
                  <AppCharts>{children}</AppCharts>
                  <AppToaster />
                </JobStreamProvider>
              </SidebarProvider>
            </TenantProvider>
          </LocaleProvider>
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
    </AuthFlagsProvider>
  );
}
