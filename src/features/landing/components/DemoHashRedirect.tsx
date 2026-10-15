"use client";

import * as React from "react";

/** Where an old home-page link goes: `#demo-<clip>` is the same clip on /gallery; anything else stays where it is. */
export function demoRedirect(hash: string): string | null {
  return /^#demo-[a-z-]+$/.test(hash) ? `/gallery${hash}` : null;
}

/**
 * The demo moved to /gallery (its clips were the home page's #demo-<clip> anchors): an old link with such a hash —
 * `/#demo-chat`, `/#demo-documents` — lands on the same clip there. A bare `#demo` stays on the home, which keeps its
 * own `#demo` anchor on the Made here teaser.
 */
export function DemoHashRedirect() {
  React.useEffect(() => {
    // On arrival, and when the hash changes without a reload (a link clicked on the page itself).
    const go = () => {
      const to = demoRedirect(window.location.hash);
      if (to) window.location.replace(to);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);
  return null;
}
