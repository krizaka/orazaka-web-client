"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { ClipPlayer, RunFacts } from "@krizaka/orazaka-design-system";
import { cn } from "@krizaka/ui/cn";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { Showcase, type ShowcaseLabels } from "@krizaka/ui/showcase";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { gallerySrc, reproduceParts, type GalleryItem } from "@/features/landing/utils/gallery";
import { FEATURED, clipFiles, clipReproduceParts, type FeaturedItem, type GalleryClip } from "@/features/landing/utils/gallery-clips";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { ItemFacts } from "@/features/landing/components/ItemFacts";
import { ReproduceBlock } from "@/features/landing/components/ReproduceBlock";
import { clipFacts, clipLabels } from "@/features/landing/components/clipUi";
import { TypedPrompt } from "@/features/landing/components/TypedPrompt";

/**
 * "Prompt → image", high on the home page, as a slideshow that moves on by itself (`@krizaka/ui/showcase`): one large
 * image with its exact prompt typed beside it, what the data records about the run and the command that reproduces it.
 * A segmented bar under it shows the time left on the image (each segment is a button), with the counter, previous /
 * next and a pause button; it holds for the pointer, the keyboard, a hidden tab and a scroll away, and never moves on
 * its own under reduced motion. Images are served as they are from the CDN (unoptimized) and load on demand.
 */
export function GalleryFeatured() {
  const { t } = useTranslation();
  const g = t.gallery;
  const labels = React.useMemo<ShowcaseLabels>(
    () => ({
      previous: g.prev,
      next: g.next,
      pause: g.pause,
      play: g.play,
      goTo: (n) => fill(g.goTo, { n }),
      counter: (n, total) => fill(g.counter, { n, total }),
      slide: (n, total) => fill(g.slide, { n, total }),
    }),
    [g],
  );

  return (
    <SectionBackdrop id="made" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-5 lg:py-24">
        <SectionHeading eyebrow={g.eyebrow} title={g.featuredTitle} lead={g.featuredLead} />
        <Showcase
          label={g.carousel}
          labels={labels}
          items={FEATURED}
          getId={(item) => item.id}
          getTitle={(item) => g.clips[item.id]}
          interval={7000}
          renderItem={(item, { active }) => <Slide item={item} active={active} />}
        />
        <p>
          <Button asChild variant="secondary" size="md" shape="pill">
            <Link href="/gallery">
              {g.all}
              <ForwardIcon size={16} />
            </Link>
          </Button>
        </p>
      </article>
    </SectionBackdrop>
  );
}

/**
 * One slide, readable in five seconds: three steps side by side (stacked on a phone) — ① the prompt, two lines with a
 * "More", ② the image (FLUX.2, on one Mac) and ③ the video (Wan 2.2, in the cloud), the two media the same size, each
 * step with a chip that says where and at what cost it was made. The full facts and "Reproduce it" are a "Details"
 * disclosure per step. The video is its own run from a similar prompt — it is not made from the image, and says so.
 */
function Slide({ item, active }: Readonly<{ item: FeaturedItem; active: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const { clip, image } = item;
  const prompt = image?.prompt ?? clip.prompt;
  return (
    <div className="space-y-4" data-steps={image ? 3 : 2}>
      <ol className={cn("grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:gap-3", image ? "lg:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.4fr)]")}>
        <Step n={1} title={g.stepPrompt}>
          <PromptClamp text={prompt} />
          <CopyButton text={prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
        </Step>
        <Arrow />
        {image && (
          <>
            <Step n={2} title={g.stepImage} chip={fill(g.imageChip, { seconds: image.seconds })}>
              <figure className="aspect-video overflow-hidden rounded-xl border border-border-default bg-surface-2">
                <Image src={gallerySrc(image.id)} alt={g.items[image.id]} width={image.width} height={image.height} sizes="(max-width: 1024px) 90vw, 360px" loading="lazy" unoptimized className="block h-full w-full object-contain" />
              </figure>
              <Details label={g.details}>
                <ImagePanel image={image} />
              </Details>
            </Step>
            <Arrow />
          </>
        )}
        <Step n={image ? 3 : 2} title={g.stepVideo} chip={fill(clip.seconds === undefined ? g.videoChipNoTime : g.videoChip, { seconds: clip.seconds ?? 0, cost: clip.costUsd.toFixed(2) })}>
          <figure className="overflow-hidden rounded-xl border border-border-default bg-surface-2">
            <ClipPlayer sources={clipFiles(clip)} title={g.clips[clip.id]} labels={clipLabels(g, clip)} />
          </figure>
          <Details label={g.details}>
            <VideoPanel clip={clip} active={active} />
          </Details>
        </Step>
      </ol>
      <p className="text-sm text-fg-secondary">{image ? g.notFromImage : g.noImage}</p>
    </div>
  );
}

/** One step of the strip: its number and name, a chip saying where it was made, then its content. */
function Step({ n, title, chip, children }: Readonly<{ n: number; title: string; chip?: string; children: React.ReactNode }>) {
  return (
    <li className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{`${String(n)} · ${title}`}</span>
        {chip && <span className="rounded-full border border-border-default bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-fg-secondary">{chip}</span>}
      </div>
      {children}
    </li>
  );
}

function Arrow() {
  return <li aria-hidden="true" className="hidden self-center pt-8 text-fg-muted lg:block"><ForwardIcon size={20} /></li>;
}

/** The prompt, two lines; "More" opens it whole. */
function PromptClamp({ text }: Readonly<{ text: string }>) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-1">
      <blockquote lang="en" className={cn("text-sm leading-relaxed text-fg-secondary", !open && "line-clamp-2")}>{text}</blockquote>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="text-xs font-medium text-fg-accent underline-offset-2 hover:underline">
        {open ? t.gallery.less : t.gallery.more}
      </button>
    </div>
  );
}

/** "Details": the facts of the run and its command, folded (a native disclosure). */
function Details({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <details className="group rounded-xl border border-border-subtle px-3 py-2">
      <summary className="cursor-pointer text-sm font-medium text-fg-secondary">{label}</summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

/** The video's side of an item: its prompt (typed over its final size), the facts of its run, the command. */
function VideoPanel({ clip, active }: Readonly<{ clip: GalleryClip; active: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <section aria-label={g.videoStep} className="space-y-3">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.videoPromptHeading}</h3>
      <TypedPrompt text={clip.prompt} active={active} />
      <CopyButton text={clip.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
      <RunFacts facts={clipFacts(g, clip)} />
      <ReproduceBlock parts={clipReproduceParts(clip)} lead={g.videoReproduceLead} />
    </section>
  );
}

/** The image's side: its prompt, what the data records about it, the commands that make it again. */
export function ImagePanel({ image }: Readonly<{ image: GalleryItem }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <section aria-label={g.imageStep} className="space-y-3">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.imagePromptHeading}</h3>
      <blockquote lang="en" className="text-sm leading-relaxed text-fg-secondary">{image.prompt}</blockquote>
      <CopyButton text={image.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
      <ItemFacts item={image} />
      <ReproduceBlock parts={reproduceParts(image)} />
    </section>
  );
}

