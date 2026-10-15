"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { Showcase, type ShowcaseLabels } from "@krizaka/ui/showcase";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { gallerySrc, reproduceParts } from "@/features/landing/utils/gallery";
import { CLIP_MODEL, FEATURED, clipFiles, clipReproduceParts, type FeaturedItem } from "@/features/landing/utils/gallery-clips";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { ItemFacts } from "@/features/landing/components/ItemFacts";
import { ReproduceBlock } from "@/features/landing/components/ReproduceBlock";
import { LoopVideo } from "@/features/landing/components/LoopVideo";
import { ClipFacts } from "@/features/landing/components/ClipFacts";
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
 * One slide: the media on the left — the video in its final 16:9 frame, then the image it continues in a frame of its
 * own, so the section never changes height — and on the right the two prompts, what each run recorded and the commands
 * that reproduce them. The video prompt types in over its final size (no layout shift).
 */
function Slide({ item, active }: Readonly<{ item: FeaturedItem; active: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const { clip, image } = item;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
      <div className="space-y-4 lg:sticky lg:top-24">
        <figure className="overflow-hidden rounded-2xl border border-border-default bg-surface-2">
          <LoopVideo sources={clipFiles(clip)} label={g.clips[clip.id]} width={clip.width} height={clip.height} className="block" />
        </figure>
        {image && (
          <figure className="flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-surface-2 sm:h-64">
            <Image
              src={gallerySrc(image.id)}
              alt={g.items[image.id]}
              width={image.width}
              height={image.height}
              sizes="(max-width: 1024px) 100vw, 480px"
              loading="lazy"
              unoptimized
              className="h-full w-full min-w-0 object-contain"
            />
          </figure>
        )}
      </div>
      <div className="space-y-6">
        <section aria-label={g.videoStep} className="space-y-3">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.videoPromptHeading}</h3>
          <TypedPrompt text={clip.prompt} active={active} />
          <CopyButton text={clip.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
          <ClipFacts clip={clip} />
          <ReproduceBlock parts={clipReproduceParts(clip)} lead={g.videoReproduceLead} />
        </section>
        {image ? (
          <section aria-label={g.imageStep} className="space-y-3 border-t border-border-subtle pt-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.imagePromptHeading}</h3>
            <blockquote lang="en" className="text-sm leading-relaxed text-fg-secondary">{image.prompt}</blockquote>
            <CopyButton text={image.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
            <ItemFacts item={image} />
            <ReproduceBlock parts={reproduceParts(image)} />
          </section>
        ) : (
          <p className="border-t border-border-subtle pt-4 text-sm text-fg-secondary">{g.noImage}</p>
        )}
      </div>
    </div>
  );
}

export { CLIP_MODEL };
