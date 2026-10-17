"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ForwardIcon, InfoIcon } from "@krizaka/icons";
import { Dialog } from "@krizaka/ui/dialog";
import { Popover } from "@krizaka/ui/popover";
import { Button } from "@krizaka/ui/button";
import { ClipPlayer, RunFacts } from "@krizaka/orazaka-design-system";
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
      {/* The old #demo anchor of the home page: the demo is /gallery now, this teaser is where a #demo link lands. */}
      <span id="demo" className="block scroll-mt-20" />
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
              {g.seeDemo}
              <ForwardIcon size={16} />
            </Link>
          </Button>
        </p>
      </article>
    </SectionBackdrop>
  );
}

/**
 * One slide, readable in five seconds: three steps side by side (stacked on a phone) — ① the prompt, two lines, ② the
 * image (FLUX.2, on one Mac) and ③ the video (Wan 2.2, in the cloud), both media in the same 16:9 frame, a chip under
 * each saying where and at what cost it was made. The full prompt, the facts and "Reproduce it" open in a popover (a
 * dialog on a phone) anchored to the step: the strip never changes height, and every slide has the same structure, so
 * the carousel keeps one height. The video is its own run from a similar prompt — it is not made from the image.
 */
function Slide({ item, active }: Readonly<{ item: FeaturedItem; active: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const { clip, image } = item;
  const prompt = image?.prompt ?? clip.prompt;
  const steps = image ? 3 : 2;
  return (
    <div className="space-y-4" data-steps={steps}>
      <ol
        className={
          image
            ? "grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-3"
            : "grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:mx-auto lg:max-w-4xl lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-3"
        }
      >
        <Step n={1} title={g.stepPrompt}>
          <div className="flex aspect-video flex-col justify-between gap-2 overflow-hidden rounded-xl border border-border-default bg-surface-2 p-4">
            <blockquote lang="en" className="line-clamp-5 text-sm leading-relaxed text-fg-secondary">{prompt}</blockquote>
            <div className="flex items-center gap-2">
              <Disclosure label={g.more} title={g.stepPrompt}>
                <blockquote lang="en" className="text-sm leading-relaxed text-fg-secondary">{prompt}</blockquote>
                <CopyButton text={prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
              </Disclosure>
            </div>
          </div>
        </Step>
        <Arrow />
        {image ? (
          <>
            <Step n={2} title={g.stepImage}>
              <Frame>
                <Image src={gallerySrc(image.id)} alt="" aria-hidden width={image.width} height={image.height} sizes="360px" loading="lazy" unoptimized className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl" />
                <Image src={gallerySrc(image.id)} alt={g.items[image.id]} width={image.width} height={image.height} sizes="(max-width: 1024px) 90vw, 360px" loading="lazy" unoptimized className="relative block h-full w-full object-contain" />
              </Frame>
              <Chip>{fill(g.imageChip, { seconds: image.seconds })}</Chip>
              <Disclosure label={g.details} title={g.imageStep}>
                <ImagePanel image={image} />
              </Disclosure>
            </Step>
            <Arrow />
          </>
        ) : null}
        <Step n={steps} title={g.stepVideo}>
          <figure className="aspect-video overflow-hidden rounded-xl border border-border-default bg-surface-2 [&_video]:h-full [&_video]:w-full [&_video]:object-cover">
            <ClipPlayer sources={clipFiles(clip)} title={g.clips[clip.id]} labels={clipLabels(g, clip)} className="h-full" />
          </figure>
          <Chip>{fill(clip.seconds === undefined ? g.videoChipNoTime : g.videoChip, { seconds: clip.seconds ?? 0, cost: clip.costUsd.toFixed(2) })}</Chip>
          <Disclosure label={g.details} title={g.videoStep}>
            <VideoPanel clip={clip} active={active} />
          </Disclosure>
        </Step>
      </ol>
      <p className="min-h-12 text-sm text-fg-secondary">{image ? g.notFromImage : ""}</p>
    </div>
  );
}

/** One step of the strip: its number and name, then its content. */
function Step({ n, title, children }: Readonly<{ n: number; title: string; children: React.ReactNode }>) {
  return (
    <li className="min-w-0 space-y-2">
      <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{`${String(n)} · ${title}`}</span>
      {children}
    </li>
  );
}

/** The one frame both media share: 16:9, rounded, whatever the shape of what it holds. */
function Frame({ children }: Readonly<{ children: React.ReactNode }>) {
  return <figure className="relative aspect-video overflow-hidden rounded-xl border border-border-default bg-surface-2">{children}</figure>;
}

/** Where it was made, how long it took, what it cost — visibly under the medium. */
function Chip({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="min-h-6 font-mono text-[11px] leading-tight text-fg-secondary">{children}</p>;
}

function Arrow() {
  return <li aria-hidden="true" className="hidden self-center text-fg-muted lg:block"><ForwardIcon size={20} /></li>;
}

/** Whether the viewport is wide enough for a popover; below it, a dialog (a popover on a phone is a sliver). */
function useWide() {
  const [wide, setWide] = React.useState(true);
  React.useEffect(() => {
    const query = window.matchMedia?.("(min-width: 1024px)");
    if (!query) return;
    const read = () => setWide(query.matches);
    read();
    query.addEventListener?.("change", read);
    return () => query.removeEventListener?.("change", read);
  }, []);
  return wide;
}

/**
 * "Details" / "More": a kit ghost button (its focus ring, no browser outline) that opens its content over the page —
 * a popover anchored to the step, a dialog on a phone. Nothing is added to the strip, so its height never changes.
 */
function Disclosure({ label, title, children }: Readonly<{ label: string; title: string; children: React.ReactNode }>) {
  const { t } = useTranslation();
  const wide = useWide();
  const trigger = (
    <Button type="button" variant="ghost" size="sm" className="-ml-2">
      <InfoIcon size={14} />
      {label}
    </Button>
  );
  if (wide) {
    return (
      <Popover.Root>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Content align="start" className="max-h-[70vh] w-[min(92vw,34rem)] space-y-3 overflow-auto p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{title}</p>
          {children}
        </Popover.Content>
      </Popover.Root>
    );
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content closeLabel={t.gallery.videoClose} className="max-h-[85vh] overflow-auto">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-3">{children}</div>
      </Dialog.Content>
    </Dialog.Root>
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

