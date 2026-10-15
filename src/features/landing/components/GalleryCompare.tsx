"use client";

import Image from "next/image";
import Link from "next/link";
import { RunFacts, type RunFact } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import type { GalleryDictionary } from "@/core/context/translations.gallery";
import { COMPARE_INSPIRATIONS, COMPARE_MODELS, imagesOf, type CompareImage } from "@/features/landing/utils/model-compare";

/** What the run of one image recorded, with an honest "where it ran": a local model says it never left the Mac, a hosted one says who made it. */
export function compareFacts(g: GalleryDictionary, image: CompareImage): RunFact[] {
  const { model } = image;
  const facts: RunFact[] = [
    { label: g.model, value: `${model.name} (${model.licence})` },
    { label: g.compareWhere, value: model.where === "mac" ? g.compareOnMac : g.compareOnDo },
    { label: g.runBy, value: `Orazaka — ${g.routedBy}` },
    { label: g.runId, value: image.runId },
    { label: g.seedValue, value: model.seedHonoured ? image.seed : g.compareSeedIgnored },
    { label: g.size, value: `${image.width}×${image.height}` },
    { label: g.time, value: fill(g.videoTime, { seconds: image.seconds }) },
    { label: g.clipCost, value: model.costUsd === undefined ? g.compareNoCost : fill(g.compareImageCost, { cost: model.costUsd.toFixed(2) }) },
  ];
  return facts;
}

/**
 * "Compare models" — one prompt per inspiration, the same for every model, side by side: one column on a phone, two from `sm`, three from `lg`. Each image is
 * an Orazaka run of the image-generation Studio and says where it ran (this Mac, or DigitalOcean's serverless inference), how long it took,
 * what it cost and its run id.
 */
export function GalleryCompare() {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <section id="compare" aria-labelledby="compare-title" className="space-y-8">
      <div className="space-y-2">
        <h2 id="compare-title" className="font-display text-2xl font-bold tracking-tight">{g.compareTitle}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-fg-secondary">{g.compareLead}</p>
        <p className="text-sm">
          <Link href="/docs/measured-runs" className="font-medium text-fg-accent underline-offset-4 hover:underline">{g.compareMeasured}</Link>
        </p>
      </div>
      <ul className="space-y-10">
        {COMPARE_INSPIRATIONS.filter((inspiration) => imagesOf(inspiration.id).length > 0).map((inspiration) => (
          <li key={inspiration.id} id={`compare-${inspiration.id}`} className="space-y-4 rounded-2xl border border-border-default bg-surface-1 p-4 sm:p-5">
            <h3 className="text-base font-semibold text-fg">{g.compareTitles[inspiration.id]}</h3>
            <blockquote lang="en" className="text-sm leading-relaxed text-fg-secondary">{inspiration.prompt}</blockquote>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {imagesOf(inspiration.id).map((image) => (
                <li key={image.stem} className="min-w-0 space-y-3">
                  <figure className="overflow-hidden rounded-xl border border-border-default bg-surface-2">
                    <Image src={image.src} alt={fill(g.compareAlt, { model: image.model.name, title: g.compareTitles[inspiration.id] })} width={image.width} height={image.height} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" loading="lazy" unoptimized className="block h-auto w-full" />
                    <figcaption className="px-3 py-2 text-sm font-semibold text-fg">{image.model.name}</figcaption>
                  </figure>
                  <RunFacts facts={compareFacts(g, image)} />
                </li>
              ))}
            </ul>
            {COMPARE_MODELS.filter((model) => !imagesOf(inspiration.id).some((image) => image.model.id === model.id)).map((model) => (
              <p key={model.id} className="text-xs leading-relaxed text-fg-muted">{fill(g.compareMissing, { model: model.name })}</p>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
