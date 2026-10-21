/**
 * One flag decides whether this deployment is open to search engines: `APP_SEARCH_INDEXING=off` (every dev and preview
 * deployment) closes it — `X-Robots-Tag: noindex, nofollow, noarchive` on every response (src/proxy.ts), robots.txt
 * `Disallow: /` with no sitemap, noindex in the pages' metadata, and the « development environment » line under the
 * footer. Production flips it by configuration alone. Read at request time on the server.
 */
export const NOINDEX_HEADER = "noindex, nofollow, noarchive";
export const CLOSED_ROBOTS = "User-agent: *\nDisallow: /\n";

export function indexable(env: Record<string, string | undefined> = process.env): boolean {
  return env.APP_SEARCH_INDEXING?.trim().toLowerCase() !== "off";
}

/* --- Two addresses, one app (epic krizaka/.github#119, krizaka-com AGENTS section 2.4) ---
   www.orazaka.com is the public address (SITE_URL, indexed). dev.orazaka.com (APP_DEV_HOST) is the development address:
   every HTML page goes to www with a 308, robots.txt is Disallow, and only what is called keeps serving there - the BFF
   and auth (/api/*), /.well-known (app links) and the health check - all noindex. The engine's own API (/edge) is the
   platform ingress, not this app: it answers on both hosts. */
const bare = (host: string | null | undefined) => (host ?? "").trim().toLowerCase().replace(/:\d+$/, "");
export const isDevHost = (host: string | null | undefined, env: Record<string, string | undefined> = process.env): boolean => !!env.APP_DEV_HOST?.trim() && bare(host) === bare(env.APP_DEV_HOST);

const DEV_KEEPS = ["/api/", "/.well-known/"];
const DEV_KEEPS_EXACT = ["/robots.txt", "/healthz"];
/** The www address a dev-host request goes to (308), or null when the dev host keeps serving it. Only GET and HEAD are pages. */
export function devRedirect(method: string, pathname: string, search: string, publicUrl: string): string | null {
  if (method !== "GET" && method !== "HEAD") return null;
  if (DEV_KEEPS_EXACT.includes(pathname) || DEV_KEEPS.some((p) => pathname.startsWith(p))) return null;
  return `${publicUrl.replace(/\/$/, "")}${pathname}${search}`;
}
