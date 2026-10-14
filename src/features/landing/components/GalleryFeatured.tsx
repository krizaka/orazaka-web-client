"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BackIcon, ForwardIcon } from "@krizaka/icons";
import { Button, IconButton } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { GALLERY, gallerySrc } from "@/features/landing/utils/gallery";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { ItemFacts } from "@/features/landing/components/ItemFacts";
import { ReproduceBlock } from "@/features/landing/components/ReproduceBlock";
import { TypedPrompt } from "@/features/landing/components/TypedPrompt";

/**
 * "Prompt → image", high on the home page: one large image with its exact prompt typed beside it, previous / next
 * through the series, what the data records about the run, the command that reproduces it, and the way to the whole
 * gallery. Images are served as they are from the CDN (unoptimized); only the first one is above the fold's neighbour,
 * the rest load on demand.
 */
export function GalleryFeatured() {
  const { t } = useTranslation();
  const g = t.gallery;
  const [i, setI] = React.useState(0);
  const item = GALLERY[i];
  const go = (d: number) => setI((n) => (n + d + GALLERY.length) % GALLERY.length);

  return (
    <SectionBackdrop id="made" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-5 lg:py-24">
        <SectionHeading eyebrow={g.eyebrow} title={g.featuredTitle} lead={g.featuredLead} />
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
          <figure className="space-y-3">
            <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-surface-2">
              <Image
                key={item.id}
                src={gallerySrc(item.id)}
                alt={g.items[item.id]}
                width={item.width}
                height={item.height}
                sizes="(max-width: 1024px) 100vw, 520px"
                loading="lazy"
                unoptimized
                className="h-auto max-h-[36rem] w-full object-contain"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3">
              <IconButton variant="ghost" label={g.prev} onClick={() => go(-1)}>
                <BackIcon size={18} />
              </IconButton>
              <span className="font-mono text-xs text-fg-secondary" aria-live="polite">
                {g.styles[item.style]} · {fill(g.counter, { n: i + 1, total: GALLERY.length })}
              </span>
              <IconButton variant="ghost" label={g.next} onClick={() => go(1)}>
                <ForwardIcon size={18} />
              </IconButton>
            </figcaption>
          </figure>

          <div className="space-y-5">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.promptHeading}</h3>
            <TypedPrompt text={item.prompt} restartKey={item.id} />
            <CopyButton text={item.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
            <ItemFacts item={item} />
            <ReproduceBlock item={item} />
          </div>
        </div>
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
