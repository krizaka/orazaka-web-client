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
