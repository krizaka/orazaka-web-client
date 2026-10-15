"use client";

import Link from "next/link";
import { DownloadIcon, ExternalIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { CodeBlock } from "@krizaka/ui/code-block";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { DesktopCapture } from "@/features/landing/components/DesktopCapture";
import { RELEASES_URL, type DesktopRelease } from "@/features/landing/utils/release";
import "@/features/landing/landing.css";

export type DesktopDownload = (DesktopRelease & { sha256: string | null }) | null;

const megabytes = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`;

/**
 * `/desktop` — Orazaka for Mac. The download is the latest `desktop-*` GitHub release, read at build time and passed
 * in; without it the page links the releases page instead of guessing. Words: `t.desktop` (en/fr).
 */
export function DesktopPage({ release }: Readonly<{ release: DesktopDownload }>) {
  const { t } = useTranslation();
  const d = t.desktop;

  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <SectionBackdrop grid className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-14 sm:px-5 lg:pb-24 lg:pt-20">
            <header className="max-w-3xl space-y-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">{d.hero.eyebrow}</p>
              <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-tight text-balance text-fg sm:text-6xl">{d.hero.title}</h1>
              <p className="text-lg leading-relaxed text-pretty text-fg-secondary">{d.hero.lead}</p>
            </header>

            <section aria-labelledby="desktop-download" className="max-w-3xl space-y-5 rounded-2xl border border-border-default bg-surface-1/85 p-5 backdrop-blur-md sm:p-6">
              <h2 id="desktop-download" className="sr-only">
                {d.download.button}
              </h2>
              {release ? (
                <>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button asChild variant="primary" size="lg" shape="cut" className="kz-sheen font-bold">
                      <a href={release.dmg.url}>
                        <DownloadIcon size={18} />
                        {d.download.button}
                      </a>
                    </Button>
                    <p className="text-sm text-fg-secondary">{d.download.fileFacts}</p>
                  </div>
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-muted">{d.download.version}</dt>
                    <dd data-testid="desktop-version">{release.version}</dd>
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-muted">{d.download.size}</dt>
                    <dd>{megabytes(release.dmg.bytes)}</dd>
                    {release.sha256 && (
                      <>
                        <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-muted">{d.download.sha}</dt>
                        <dd className="flex flex-wrap items-center gap-2">
                          <code data-testid="desktop-sha" className="break-all font-mono text-xs">
                            {release.sha256}
                          </code>
                          <CopyButton text={release.sha256} label={d.download.shaCopy} done={d.download.shaCopied} failed={d.download.shaCopyFailed} />
                        </dd>
                      </>
                    )}
                  </dl>
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-sm text-fg-secondary">{d.download.unreadable}</p>
                  <Button asChild variant="secondary" size="md" shape="pill">
                    <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
                      {d.download.releases}
                      <ExternalIcon size={16} />
                    </a>
                  </Button>
                </div>
              )}
              <div className="space-y-3 border-t border-border-subtle pt-5" role="note">
                <p className="font-semibold text-fg">{d.testBuild.title}</p>
                <p className="text-sm leading-relaxed text-fg-secondary">{d.testBuild.body}</p>
                <CodeBlock code={d.testBuild.terminal} language="bash" />
              </div>
            </section>
          </article>
        </SectionBackdrop>

        <SectionBackdrop className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
            <SectionHeading eyebrow={d.hero.eyebrow} title={d.does.title} lead={d.does.lead} />
            <figure data-reveal className="overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-lg">
              <DesktopCapture alt={d.does.captureAlt} sizes="(min-width: 1152px) 1152px, 100vw" className="h-auto w-full" />
            </figure>
            <ul className="grid gap-5 md:grid-cols-2">
              {d.does.items.map((item) => (
                <li key={item.title} data-reveal className="space-y-2 rounded-2xl border border-border-default bg-surface-1/85 p-5">
                  <h3 className="font-display text-lg font-bold text-fg">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-fg-secondary">{item.body}</p>
                </li>
              ))}
            </ul>
          </article>
        </SectionBackdrop>

        <SectionBackdrop>
          <article className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-5 md:grid-cols-2 lg:py-28">
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-fg">{d.access.title}</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg-secondary">
                {d.access.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-fg">{d.requirements.title}</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg-secondary">
                {d.requirements.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <h3 className="pt-4 font-display text-lg font-bold text-fg">{d.notYet.title}</h3>
              <p className="text-sm leading-relaxed text-fg-secondary">
                {d.notYet.body} <Link href="/docs/self-hosting" className="text-fg-accent underline underline-offset-4">/docs/self-hosting</Link>
              </p>
            </section>
          </article>
        </SectionBackdrop>
      </main>
      <LandingFooter />
    </>
  );
}
