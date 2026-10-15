"use client";

import { useTranslation } from "@/core/context/LocaleContext";

/**
 * A calm line under the footer of a deployment that is not open to the public (APP_SEARCH_INDEXING=off: dev, preview) —
 * the flag that keeps it out of search engines; the server decides (`show`), the visitor's language words it. Tokens only:
 * it reads in dark and light.
 */
export function DevEnvironmentNotice({ show }: { show: boolean }) {
  const { t } = useTranslation();
  if (!show) return null;
  return (
    <p className="mx-auto max-w-6xl px-4 pb-6 text-center text-xs text-fg-muted" data-testid="dev-environment-notice">
      {t.landing.footer.devNotice}
    </p>
  );
}
