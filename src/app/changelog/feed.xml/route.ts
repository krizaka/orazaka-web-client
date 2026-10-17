import { changelogRss } from "@krizaka/ui/changelog-page";
import { translations } from "@/core/context/translations";
import { loadReleases } from "@/features/landing/utils/changelog";
import { SITE_URL } from "@/app/_seo/seo";

export const revalidate = 3600;

/** The changelog as RSS 2.0 (English: the feed has one URL; the page itself follows the visitor's language). */
export async function GET() {
  const c = translations.en.changelog;
  const xml = changelogRss({
    releases: await loadReleases(),
    title: c.feedTitle,
    description: c.feedDescription,
    siteUrl: SITE_URL,
    pageUrl: `${SITE_URL}/changelog`,
    feedUrl: `${SITE_URL}/changelog/feed.xml`,
    language: c.langTag,
    tagLabel: c.tags,
  });
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
