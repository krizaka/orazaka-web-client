"use client";

import * as React from "react";

export type Appearance = "dark" | "light";

/** The page's look, so the recordings and screenshots match it: `html.light` is the light theme (ThemeProvider). */
function subscribe(notify: () => void) {
  const mo = new MutationObserver(notify);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

export function useAppearance(): Appearance {
  return React.useSyncExternalStore(subscribe, () => (document.documentElement.classList.contains("light") ? "light" : "dark"), () => "dark");
}
