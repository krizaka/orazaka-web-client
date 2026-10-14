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
import { GALLERY, gallerySrc, type GalleryItem } from "@/features/landing/utils/gallery";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { ItemFacts } from "@/features/landing/components/ItemFacts";
import { ReproduceBlock } from "@/features/landing/components/ReproduceBlock";
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
          items={GALLERY}
          getId={(item) => item.id}
          getTitle={(item) => g.styles[item.style]}
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

/** One slide: the image on the left (a fixed frame, so the section never changes height), the prompt, facts and command on the right. */
function Slide({ item, active }: Readonly<{ item: GalleryItem; active: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
      <figure className="flex h-[22rem] items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-surface-2 sm:h-[32rem]">
        <Image
          src={gallerySrc(item.id)}
          alt={g.items[item.id]}
          width={item.width}
          height={item.height}
          sizes="(max-width: 1024px) 100vw, 520px"
          loading="lazy"
          unoptimized
          className="h-full w-full min-w-0 object-contain"
        />
      </figure>
      <div className="space-y-5">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.promptHeading}</h3>
        <TypedPrompt text={item.prompt} active={active} />
        <CopyButton text={item.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
        <ItemFacts item={item} />
        <ReproduceBlock item={item} />
      </div>
    </div>
  );
}
