"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { ClipPlayer, RunFacts } from "@krizaka/orazaka-design-system";
import { cn } from "@krizaka/ui/cn";
import { Tabs } from "@krizaka/ui/tabs";
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
 * One slide: the media on the left — the video in its final frame, then the image it continues at its own aspect (no bands),
 * the prompts in two tabs (Video · Image) so an item fits about one screen — and on the right the two prompts, what each run recorded and the commands
 * that reproduce them. The video prompt types in over its final size (no layout shift).
 */
function Slide({ item, active }: Readonly<{ item: FeaturedItem; active: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const { clip, image } = item;
  // The tab is the item's own state; the media on the left follow it: the side that is chosen is the large one (both stay mounted, so the clip keeps playing).
  const [tab, setTab] = React.useState<"video" | "image">("video");
  const imageFirst = tab === "image" && image !== undefined;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12" data-tab={tab}>
      <div className="flex flex-col gap-4">
        <figure className={cn("overflow-hidden rounded-2xl border border-border-default bg-surface-2", imageFirst ? "order-2 w-2/5 min-w-44" : "order-1 w-full")}>
          <ClipPlayer sources={clipFiles(clip)} title={g.clips[clip.id]} labels={clipLabels(g, clip)} />
        </figure>
        {image && (
          <figure className={cn("overflow-hidden rounded-2xl border border-border-default bg-surface-2", imageFirst ? "order-1 w-full max-w-lg" : "order-2 w-2/5 min-w-44")}>
            <Image
              src={gallerySrc(image.id)}
              alt={g.items[image.id]}
              width={image.width}
              height={image.height}
              sizes="(max-width: 1024px) 80vw, 480px"
              loading="lazy"
              unoptimized
              className="block h-auto w-full"
            />
          </figure>
        )}
      </div>
      {image ? (
        <Tabs.Root value={tab} onValueChange={(next) => setTab(next as "video" | "image")} variant="segmented" className="space-y-5">
          <Tabs.List aria-label={g.stepsLabel}>
            <Tabs.Trigger value="video">{g.videoStep}</Tabs.Trigger>
            <Tabs.Trigger value="image">{g.imageStep}</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="video">
            <VideoPanel clip={clip} active={active} />
          </Tabs.Content>
          <Tabs.Content value="image">
            <ImagePanel image={image} />
          </Tabs.Content>
        </Tabs.Root>
      ) : (
        <div className="space-y-5">
          <VideoPanel clip={clip} active={active} />
          <p className="border-t border-border-subtle pt-4 text-sm text-fg-secondary">{g.noImage}</p>
        </div>
      )}
    </div>
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

