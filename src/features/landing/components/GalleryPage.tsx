"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@krizaka/ui/cn";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { GALLERY, STYLES, gallerySrc, type GalleryStyle } from "@/features/landing/utils/gallery";
import { clipFiles, clipOf } from "@/features/landing/utils/gallery-clips";
import { LoopVideo } from "@/features/landing/components/LoopVideo";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { ItemFacts } from "@/features/landing/components/ItemFacts";
import { ReproduceBlock } from "@/features/landing/components/ReproduceBlock";
import "@/features/landing/landing.css";

const chip = "inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * /gallery — every image Orazaka made here, filterable by style (`?style=`, a link each: the URL is the state). Each
 * item: the image, the Studio, model, seed, size and time on one Mac, the exact prompt with a copy button and the
 * command that reproduces it; then the credits.
 */
export function GalleryPage({ only }: Readonly<{ only?: GalleryStyle }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const items = only ? GALLERY.filter((x) => x.style === only) : GALLERY;
  const link = (active: boolean) => cn(chip, active ? "border-accent bg-accent-soft text-fg" : "border-border-default text-fg-secondary hover:text-fg");

  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <SectionBackdrop grid className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-6 px-4 pb-12 pt-14 sm:px-5 lg:pt-20">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">{g.eyebrow}</p>
            <h1 className="max-w-3xl font-display text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">{g.galleryTitle}</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-pretty text-fg-secondary">{g.galleryLead}</p>
            <p className="font-mono text-xs text-fg-muted">{g.engine}</p>
          </article>
        </SectionBackdrop>

        <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-5">
          <nav aria-label={g.filterLabel} className="flex flex-wrap items-center gap-2">
            <Link href="/gallery" aria-current={only ? undefined : "page"} className={link(!only)}>
              {g.filterAll}
            </Link>
            {STYLES.map((s) => (
              <Link key={s} href={`/gallery?style=${s}`} aria-current={only === s ? "page" : undefined} className={link(only === s)}>
                {g.styles[s]}
              </Link>
            ))}
            <span className="ml-auto font-mono text-xs text-fg-secondary" aria-live="polite">{fill(g.count, { count: items.length })}</span>
          </nav>

          <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {items.map((item) => (
              <li key={item.id} className="mb-5 break-inside-avoid">
                <figure className="overflow-hidden rounded-2xl border border-border-default bg-surface-1">
                  <Image
                    src={gallerySrc(item.id)}
                    alt={g.items[item.id]}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    loading="lazy"
                    unoptimized
                    className="block h-auto w-full bg-surface-2"
                  />
                  {clipOf(item.id) && (
                    <LoopVideo
                      sources={clipFiles(clipOf(item.id)!)}
                      label={g.clips[clipOf(item.id)!.id]}
                      width={clipOf(item.id)!.width}
                      height={clipOf(item.id)!.height}
                      className="block border-t border-border-subtle bg-surface-2"
                    />
                  )}
                  <figcaption className="space-y-3 p-4">
                    <span className="block text-sm font-semibold text-fg">{g.styles[item.style]}</span>
                    <ItemFacts item={item} />
                    <details className="text-sm">
                      <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.12em] text-fg-accent">{g.promptLabel}</summary>
                      <blockquote lang="en" className="mt-2 text-[13px] leading-relaxed text-fg-secondary">{item.prompt}</blockquote>
                    </details>
                    <CopyButton text={item.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
                    <details className="text-sm">
                      <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.12em] text-fg-accent">{g.reproduce}</summary>
                      <div className="mt-2">
                        <ReproduceBlock item={item} heading={false} />
                      </div>
                    </details>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <section id="credits" aria-labelledby="credits-title" className="mx-auto max-w-6xl space-y-4 border-t border-border-subtle px-4 py-12 sm:px-5">
          <h2 id="credits-title" className="font-display text-2xl font-bold tracking-tight">{g.creditsTitle}</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-fg-secondary">{g.creditsLead}</p>
          <ul className="max-w-2xl list-disc space-y-1 pl-5 text-sm text-fg-secondary">
            {g.credits.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
