/**
 * The public addresses that moved or were removed, each answered with a 308 (permanent, method kept) so no link, no
 * bookmark and no search result 404s (epic krizaka/orazaka-web-client#231). `next.config.ts` reads this list;
 * `src/__tests__/public-routes.test.ts` checks that every target exists.
 */
export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
  has?: { type: "host"; value: string }[];
}

/** Removed on 2026-10-21 (#231): feature tours, the gallery, the models catalogue, three marketing or stub docs. */
export const REMOVED_PUBLIC: readonly { source: string; destination: string }[] = [
  { source: "/features", destination: "/#features" },
  { source: "/features/:id", destination: "/#features" },
  { source: "/gallery", destination: "/#records" },
  { source: "/models", destination: "/docs/models" },
  { source: "/infrastructure", destination: "/docs/self-hosting" },
  { source: "/docs/business-playbook", destination: "/docs/101" },
  { source: "/docs/cinematic-shorts", destination: "/docs/packs" },
  { source: "/docs/use-cases", destination: "/docs/business" },
];

/** Older renames, kept (their targets are the pages that stay). */
const RENAMED: readonly { source: string; destination: string }[] = [
  // The mobile guide is a section of the documentation; the docs' pages were renamed (slugs without underscores).
  { source: "/mobile", destination: "/docs/mobile" },
  { source: "/docs/api_reference", destination: "/docs/api" },
  { source: "/docs/interface_contracts", destination: "/docs/interface-contracts" },
  { source: "/docs/worker_protocol", destination: "/docs/worker-protocol" },
  { source: "/docs/business_implementation", destination: "/docs/101" },
  { source: "/docs/use_cases", destination: "/docs/business" },
  // The signed-in app's addresses say the section's name (docs/ux/information-architecture.md of the workspace).
  { source: "/dashboard/jobs", destination: "/jobs" },
  { source: "/profile", destination: "/settings" },
];

export const PUBLIC_REDIRECTS: readonly Redirect[] = [
  // The contact form lives on krizaka.com.
  { source: "/contact", destination: "https://www.krizaka.com/contact", permanent: false },
  ...[...REMOVED_PUBLIC, ...RENAMED].map((r) => ({ ...r, permanent: true })),
  // Not on admin.orazaka.com: /billing is a section of the operator console there (src/console), served by the proxy.
  { source: "/billing", has: [{ type: "host", value: "(?!admin\\.).*" }], destination: "/usage", permanent: true },
];
