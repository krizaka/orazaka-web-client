/**
 * @file changelog.ts
 * @description The product's releases, read from the GitHub Releases of krizaka/orazaka (refreshed hourly) and put in
 * the shared shape of `@krizaka/ui/changelog-page`. Nothing is written by hand: a release without a change a reader
 * would care about is left out, and when GitHub cannot be read the page says so.
 */
import { newestFirst, parseReleaseBody, type Release } from "@krizaka/ui/changelog-page";

export const CHANGELOG_RELEASES_URL = "https://github.com/krizaka/orazaka/releases";
const API = "https://api.github.com/repos/krizaka/orazaka/releases?per_page=30";

interface GithubRelease {
  tag_name: string;
  draft: boolean;
  published_at: string | null;
  html_url: string;
  body: string | null;
}

/** The releases as the changelog shows them: tag → version, body → tagged changes, newest first. */
export function releasesFromGithub(list: readonly GithubRelease[]): Release[] {
  return list
    .filter((r) => !r.draft && r.published_at)
    .map((r) => ({
      source: "Orazaka",
      version: r.tag_name.replace(/^(desktop-)?v/, "$1"),
      date: (r.published_at ?? "").slice(0, 10),
      url: r.html_url,
      changes: parseReleaseBody(r.body ?? ""),
    }))
    .filter((r) => r.changes.length > 0)
    .sort(newestFirst);
}

/** Every release worth showing, or an empty list when GitHub cannot be read. */
export async function loadReleases(): Promise<Release[]> {
  try {
    const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 3600 } });
    return res.ok ? releasesFromGithub((await res.json()) as GithubRelease[]) : [];
  } catch {
    return [];
  }
}
