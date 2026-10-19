"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { Providers } from "@/core/providers/Providers";
import { DevEnvironmentNotice } from "@/components/DevEnvironmentNotice";
import type { AuthFlags } from "@/core/config/auth-flags";

/**
 * The public site's shell (providers, dev notice) — skipped for the operator console (admin.orazaka.com), which has
 * its own in `app/console/layout.tsx`. The segment is read from the rendered tree, so it follows the proxy's rewrite
 * (`/studios` on the admin host is `/console/studios`) and the public pages stay static.
 */
export function PublicShell({ authFlags, showDevNotice, children }: Readonly<{ authFlags: AuthFlags; showDevNotice: boolean; children: ReactNode }>) {
  if (useSelectedLayoutSegment() === "console") return <>{children}</>;
  return (
    <Providers authFlags={authFlags}>
      {children}
      <DevEnvironmentNotice show={showDevNotice} />
    </Providers>
  );
}
