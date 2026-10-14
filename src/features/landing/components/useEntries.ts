"use client";

import { useAuthFlags } from "@/core/context/AuthFlagsContext";
import { useTranslation } from "@/core/context/LocaleContext";

export interface Entry {
  href: string;
  label: string;
}

/**
 * The two ways in of a public page, honest about the AUTH_* flags: while sign-up is closed the primary action reads
 * the documentation, while sign-in is closed the secondary one watches the demo — never a link to a closed door.
 */
export function useEntries() {
  const flags = useAuthFlags();
  const { t } = useTranslation();
  const closed = t.landing.closed;
  return {
    flags,
    primary: (label: string): Entry => (flags.signup ? { href: "/register", label } : { href: "/docs", label: closed.heroPrimary }),
    secondary: (label: string, href = "/login"): Entry => (flags.login ? { href, label } : { href: "/#demo", label: closed.heroSecondary }),
  };
}
