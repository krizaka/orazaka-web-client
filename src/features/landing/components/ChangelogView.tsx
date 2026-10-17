"use client";

import Link from "next/link";
import { Button } from "@krizaka/ui/button";
import { anchorOf, ChangelogPage, kindOfTag, type ChangelogEntry, type Release } from "@krizaka/ui/changelog-page";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { APP_VERSION } from "@/core/config/version";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { CHANGELOG_RELEASES_URL } from "@/features/landing/utils/changelog";

/** `/changelog` on the Changelog template of @krizaka/ui. The footer's version links `#<APP_VERSION>`: the sentence « this site runs vX » carries that id. */
export function ChangelogView({ releases }: Readonly<{ releases: readonly Release[] }>) {
  const { t, locale } = useTranslation();
  const c = t.changelog;
  const date = new Intl.DateTimeFormat(c.langTag, { dateStyle: "long", timeZone: "UTC" });
  const entries: ChangelogEntry[] = releases.map((r) => ({
    id: anchorOf(r),
    date: r.date,
    dateLabel: date.format(new Date(`${r.date}T12:00:00Z`)),
    version: r.url ? <a href={r.url}>{r.version}</a> : r.version,
    title: r.source,
    changes: r.changes.map((ch) => ({
      kind: kindOfTag(ch.tag),
      text: (
        <>
          {ch.text}
          {ch.pr && (
            <>
              {" "}
              <a href={ch.pr.url} aria-label={fill(c.pull, { number: String(ch.pr.number) })}>
                #{ch.pr.number}
              </a>
            </>
          )}
        </>
      ),
    })),
  }));

  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <ChangelogPage
          back={{ href: "/", label: c.back }}
          linkAs={Link}
          eyebrow={c.eyebrow}
          title={c.title}
          lead={
            <>
              {c.lead} <span id={APP_VERSION}>{fill(c.runs, { version: APP_VERSION })}</span>
            </>
          }
          actions={
            <Button asChild variant="secondary" size="md" shape="cut">
              <a href="/changelog/feed.xml">{c.feed}</a>
            </Button>
          }
          kindLabels={c.kinds}
          logLabel={c.logLabel}
          entries={entries}
          lang={locale}
        />
        {entries.length === 0 && (
          <p className="mx-auto max-w-6xl px-4 pb-16 text-fg-secondary sm:px-5">
            {c.empty} <a href={CHANGELOG_RELEASES_URL}>{c.emptyLink}</a>
          </p>
        )}
      </main>
      <LandingFooter />
    </>
  );
}
