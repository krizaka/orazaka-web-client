"use client";

import type { ComponentType } from "react";
import { CheckIcon, DownloadIcon, ExternalIcon, LocalIcon, type IconProps } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { CodeBlock } from "@krizaka/ui/code-block";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { DeviceFrame } from "@krizaka/ui/step-showcase";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { DesktopCapture } from "@/features/landing/components/DesktopCapture";
import { PhoneSection } from "@/features/landing/components/PhoneSection";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import type { StoreLinks } from "@/core/config/store-links";
import { RELEASES_URL, type DesktopRelease } from "@/features/landing/utils/release";
import "@/features/landing/landing.css";

export type DesktopDownload = (DesktopRelease & { sha256: string | null }) | null;

const megabytes = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`;
/** The small visual of each first-launch step, in order. */
const STEP_ICONS: ComponentType<IconProps>[] = [DownloadIcon, LocalIcon, CheckIcon];

/**
 * `/desktop` — Orazaka for Mac, read in order: the promise and the app in its macOS window, one Download (its facts
 * quiet, the SHA-256 in a disclosure), the first launch of a build not yet signed by Apple in three steps (the
 * quarantine fallback folded), the two modes, the services « Start » brings up, what to do when something goes wrong.
 * Under it, the phone apps: a store button per store whose URL is configured (`store-links.ts`), else one « coming soon » line.
 * The release is read at build time and passed in; without it the page links the releases page. Words: `t.desktop`.
 */
export function DesktopPage({ release, stores = { ios: null, android: null } }: Readonly<{ release: DesktopDownload; stores?: StoreLinks }>) {
  const { t } = useTranslation();
  const d = t.desktop;

  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <SectionBackdrop grid className="border-b border-border-subtle">
          <article className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:pb-24 lg:pt-20">
            <header className="space-y-6">
              <p className="font-mono text-xs font-semibold text-fg-accent">{d.hero.eyebrow}</p>
              <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-tight text-balance text-fg sm:text-6xl">{d.hero.title}</h1>
              <p className="text-lg leading-relaxed text-pretty text-fg-secondary">{d.hero.lead}</p>
              {release ? (
                <div className="space-y-3">
                  <Button asChild variant="primary" size="lg" className="font-bold">
                    <a href={release.dmg.url}>
                      <DownloadIcon size={18} />
                      {d.download.button}
                    </a>
                  </Button>
                  <p className="text-sm text-fg-secondary">
                    {fill(d.download.facts, { size: megabytes(release.dmg.bytes) })} · <span data-testid="desktop-version">{fill(d.download.version, { version: release.version })}</span>
                  </p>
                  <p role="note" className="text-sm text-fg-secondary">
                    {d.download.testBuild}
                  </p>
                  {release.sha256 && (
                    <details className="group text-sm">
                      <summary className="cursor-pointer font-medium text-fg-accent">{d.download.verify}</summary>
                      <div className="mt-2 space-y-2 text-fg-secondary">
                        <p>{d.download.verifyBody}</p>
                        <p className="flex flex-wrap items-center gap-2">
                          <code data-testid="desktop-sha" className="break-all font-mono text-xs text-fg">
                            {release.sha256}
                          </code>
                          <CopyButton text={release.sha256} label={d.download.shaCopy} done={d.download.shaCopied} failed={d.download.shaCopyFailed} />
                        </p>
                      </div>
                    </details>
                  )}
                </div>
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
              <section aria-label={d.mobile.title} data-testid="desktop-mobile" className="space-y-2 border-t border-border-subtle pt-5">
                {stores.ios && stores.android ? null : !stores.ios && !stores.android ? (
                  <p className="text-sm text-fg-secondary">{d.mobile.soon}</p>
                ) : (
                  <p className="text-sm text-fg-secondary">{stores.ios ? d.mobile.android.soon : d.mobile.ios.soon}</p>
                )}
                <div className="flex flex-wrap gap-3">
                  {stores.ios && (
                    <Button asChild variant="secondary" size="md">
                      <a href={stores.ios} target="_blank" rel="noopener noreferrer">
                        {d.mobile.ios.button}
                      </a>
                    </Button>
                  )}
                  {stores.android && (
                    <Button asChild variant="secondary" size="md">
                      <a href={stores.android} target="_blank" rel="noopener noreferrer">
                        {d.mobile.android.button}
                      </a>
                    </Button>
                  )}
                </div>
              </section>
            </header>
            <DeviceFrame kind="desktop" title="Orazaka">
              <DesktopCapture alt={d.hero.captureAlt} sizes="(min-width: 1024px) 36rem, 92vw" className="h-full w-full object-cover object-top" />
            </DeviceFrame>
          </article>
        </SectionBackdrop>

        <SectionBackdrop id="first-launch" className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-5 lg:py-20">
            <SectionHeading eyebrow={d.hero.eyebrow} title={d.firstLaunch.title} lead={d.firstLaunch.lead} />
            <ol className="grid gap-4 md:grid-cols-3">
              {d.firstLaunch.steps.map((step, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <li key={step.title} data-reveal className="space-y-3 rounded-2xl border border-border-default bg-surface-1/85 p-5">
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-bold text-fg-accent">{i + 1}</span>
                      <Icon size={22} className="text-fg-secondary" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-fg">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-fg-secondary">{step.body}</p>
                  </li>
                );
              })}
            </ol>
            <details className="max-w-3xl rounded-2xl border border-border-subtle bg-surface-1/60 p-4 text-sm">
              <summary className="cursor-pointer font-semibold text-fg">{d.firstLaunch.damaged.summary}</summary>
              <div className="mt-3 space-y-3 text-fg-secondary">
                <p>{d.firstLaunch.damaged.body}</p>
                <CodeBlock code={d.firstLaunch.damaged.terminal} language="bash" />
              </div>
            </details>
          </article>
        </SectionBackdrop>

        <SectionBackdrop className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-5 lg:py-20">
            <SectionHeading eyebrow={d.hero.eyebrow} title={d.modes.title} lead={d.modes.lead} />
            <ul className="grid gap-4 md:grid-cols-3">
              {d.modes.items.map((item) => (
                <li key={item.title} data-reveal className="space-y-2 rounded-2xl border border-border-default bg-surface-1/85 p-5">
                  <h3 className="font-display text-lg font-bold text-fg">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-fg-secondary">{item.body}</p>
                </li>
              ))}
            </ul>
          </article>
        </SectionBackdrop>

        <SectionBackdrop className="border-b border-border-subtle">
          <PhoneSection id="phone-ask" words={d.phone} testId="desktop-phone" />
        </SectionBackdrop>

        <SectionBackdrop className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-8 px-4 py-16 sm:px-5 lg:py-20">
            <SectionHeading eyebrow={d.hero.eyebrow} title={d.services.title} lead={d.services.lead} />
            <dl aria-label={d.services.title} className="divide-y divide-border-subtle rounded-2xl border border-border-default bg-surface-1/70">
              {d.services.rows.map((row) => (
                <div key={row.name} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_7rem_1fr] sm:gap-4">
                  <dt className="font-semibold text-fg">{row.name}</dt>
                  <dd className="font-mono text-xs text-fg-accent sm:pt-1">{row.runs}</dd>
                  <dd className="text-sm text-fg-secondary">{row.does}</dd>
                </div>
              ))}
            </dl>
          </article>
        </SectionBackdrop>

        <SectionBackdrop>
          <article className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:py-20">
            <section aria-labelledby="desktop-trouble" className="space-y-5">
              <h2 id="desktop-trouble" className="font-display text-2xl font-bold text-fg">
                {d.trouble.title}
              </h2>
              {d.trouble.items.map((item) => (
                <div key={item.title} className="space-y-2">
                  <h3 className="font-semibold text-fg">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-fg-secondary">{item.body}</p>
                  {item.code && <CodeBlock code={item.code} language="bash" />}
                </div>
              ))}
            </section>
            <section aria-labelledby="desktop-needs" className="space-y-4">
              <h2 id="desktop-needs" className="font-display text-2xl font-bold text-fg">
                {d.requirements.title}
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg-secondary">
                {d.requirements.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          </article>
        </SectionBackdrop>
      </main>
      <LandingFooter />
    </>
  );
}
