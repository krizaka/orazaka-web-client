/**
 * The public bar of dev.orazaka.com as data — the product-site standard of every Krizaka product (addendum 2026-10-15,
 * docs/ux/information-architecture.md of the Orazaka workspace): the mark, then at most four entries grouped by the
 * visitor's question — **Product ▾** (what does it do?), **Platforms ▾** (where does it run?), **Docs** (how do I use
 * it?) — and Pricing when it exists. No entry stands alone that belongs to a group (no top-level Demo, Mobile or Mac).
 * The bar, the mobile panel and the footer read this one list, in this order.
 */
import type { ComponentType } from "react";
import { AiIcon, DownloadIcon, GlobeIcon, LocalIcon, PackIcon, PlayIcon, ServerIcon, StudioIcon, VideoIcon, type IconProps } from "@krizaka/icons";
import { SHIPPED_ROUTES } from "@/features/landing/utils/nav-routes";

/** The words of an entry live in `t.landing.nav[id]` and its line in `t.landing.nav.menu[id]`. */
export const NavEntryId = {
  How: "how",
  Studios: "studios",
  Packs: "packs",
  Models: "models",
  Demo: "demo",
  Web: "web",
  Mobile: "mobile",
  Desktop: "desktop",
  SelfHost: "selfHost",
} as const;
export type NavEntryId = (typeof NavEntryId)[keyof typeof NavEntryId];

export const NavGroupId = { Product: "product", Platforms: "platforms" } as const;
export type NavGroupId = (typeof NavGroupId)[keyof typeof NavGroupId];

export interface NavEntry {
  id: NavEntryId;
  /** A section of the home page (`#id` there, `/#id` elsewhere) — or a page. */
  anchor?: string;
  path?: string;
  Icon: ComponentType<IconProps>;
  /** The pages this entry is the current one for (exact path, or the path and everything under it). */
  current?: readonly string[];
}

export interface NavGroup {
  id: NavGroupId;
  entries: readonly NavEntry[];
}

/** Product ▾ — what Orazaka does, as outcomes, and the proof (Demo: real runs, nothing staged). */
const PRODUCT: NavGroup = {
  id: NavGroupId.Product,
  entries: [
    { id: NavEntryId.How, anchor: "how", Icon: PlayIcon, current: ["/features"] },
    { id: NavEntryId.Studios, anchor: "studios", Icon: StudioIcon },
    { id: NavEntryId.Packs, anchor: "packs", Icon: PackIcon },
    { id: NavEntryId.Models, path: "/models", Icon: AiIcon, current: ["/models"] },
    { id: NavEntryId.Demo, path: "/gallery", Icon: VideoIcon, current: ["/gallery"] },
  ],
};

/** Platforms ▾ — where it runs: the browser, the phone, the Mac, your own servers. */
const PLATFORMS: NavGroup = {
  id: NavGroupId.Platforms,
  entries: [
    { id: NavEntryId.Web, anchor: "platform", Icon: GlobeIcon },
    { id: NavEntryId.Mobile, path: "/docs/mobile", Icon: DownloadIcon, current: ["/docs/mobile"] },
    { id: NavEntryId.Desktop, path: "/desktop", Icon: LocalIcon, current: ["/desktop"] },
    // « Self-host » reads the install guide until the /infrastructure page ships (no dead link either way).
    SHIPPED_ROUTES.infrastructure
      ? { id: NavEntryId.SelfHost, path: "/infrastructure", Icon: ServerIcon, current: ["/infrastructure", "/docs/self-hosting"] }
      : { id: NavEntryId.SelfHost, path: "/docs/self-hosting", Icon: ServerIcon, current: ["/docs/self-hosting"] },
  ],
};

export const NAV_GROUPS: readonly NavGroup[] = [PRODUCT, PLATFORMS];

/** Docs — a direct link: the documentation is a reading place, not a menu. */
export const NAV_DOCS = { path: "/docs" } as const;

const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

/** The entry the page belongs to, if a group holds it. */
export function currentEntry(pathname: string | null | undefined): { group: NavGroupId; entry: NavEntryId } | null {
  const p = pathname ?? "";
  for (const group of NAV_GROUPS) {
    const entry = group.entries.find((e) => e.current?.some((base) => under(p, base)));
    if (entry) return { group: group.id, entry: entry.id };
  }
  return null;
}

/**
 * Where the visitor is, as the bar shows it — at most one top-level item lit: the group holding the page, else Docs for
 * the rest of /docs, else nothing (the home, whose sections are anchors).
 */
export function navActive(pathname: string | null | undefined): { top: NavGroupId | "docs" | null; entry: NavEntryId | null } {
  const hit = currentEntry(pathname);
  if (hit) return { top: hit.group, entry: hit.entry };
  if (under(pathname ?? "", NAV_DOCS.path)) return { top: "docs", entry: null };
  return { top: null, entry: null };
}

/** The address of an entry: an anchor of the home (`#id` on it, `/#id` elsewhere), or its page. */
export function entryHref(entry: NavEntry, onHome: boolean): string {
  if (entry.anchor) return onHome ? `#${entry.anchor}` : `/#${entry.anchor}`;
  return entry.path ?? "/";
}
