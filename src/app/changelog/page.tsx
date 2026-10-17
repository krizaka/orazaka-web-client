import type { Metadata } from "next";
import { translations } from "@/core/context/translations";
import { ChangelogView } from "@/features/landing/components/ChangelogView";
import { loadReleases } from "@/features/landing/utils/changelog";

const m = translations.en.changelog.meta;

export const metadata: Metadata = {
  title: m.title,
  description: m.description,
  alternates: { canonical: "/changelog", types: { "application/rss+xml": "/changelog/feed.xml" } },
};

/** `/changelog` — the releases of krizaka/orazaka, read from GitHub (refreshed hourly), on the Changelog template. */
export default async function Page() {
  return <ChangelogView releases={await loadReleases()} />;
}
