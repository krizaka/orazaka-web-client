"use client";

import { RunFacts } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { reproduceParts, type GalleryItem } from "@/features/landing/utils/gallery";
import { IMAGE_MODEL, clipReproduceParts, imageReproduceParts, type GalleryClip, type ImageRecord } from "@/features/landing/utils/gallery-clips";
import { CopyButton } from "@/features/landing/components/CopyButton";
import { ItemFacts } from "@/features/landing/components/ItemFacts";
import { ReproduceBlock } from "@/features/landing/components/ReproduceBlock";
import { clipFacts, imageFacts } from "@/features/landing/components/clipUi";
import { TypedPrompt } from "@/features/landing/components/TypedPrompt";

/** The video's side of an item: its prompt (typed over its final size), the facts of its run, the command. */
export function VideoPanel({ clip, active }: Readonly<{ clip: GalleryClip; active: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <section aria-label={g.videoStep} className="space-y-3">
      <h3 className="font-mono text-xs font-semibold text-fg-accent">{g.videoPromptHeading}</h3>
      <TypedPrompt text={clip.prompt} active={active} />
      <CopyButton text={clip.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
      <RunFacts facts={clipFacts(g, clip)} />
      <ReproduceBlock parts={clipReproduceParts(clip)} lead={g.videoReproduceLead} />
    </section>
  );
}

/** The image of a featured clip: its prompt, what its own run recorded, the commands that make it again. */
export function FeaturedImagePanel({ image }: Readonly<{ image: ImageRecord }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <section aria-label={g.imageStep} className="space-y-3">
      <h3 className="font-mono text-xs font-semibold text-fg-accent">{g.imagePromptHeading}</h3>
      <blockquote lang="en" className="text-sm leading-relaxed text-fg-secondary">{image.prompt}</blockquote>
      <CopyButton text={image.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
      <RunFacts facts={imageFacts(g, image, IMAGE_MODEL)} />
      <ReproduceBlock parts={imageReproduceParts(image)} />
    </section>
  );
}

/** The image's side: its prompt, what the data records about it, the commands that make it again. */
export function ImagePanel({ image }: Readonly<{ image: GalleryItem }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <section aria-label={g.imageStep} className="space-y-3">
      <h3 className="font-mono text-xs font-semibold text-fg-accent">{g.imagePromptHeading}</h3>
      <blockquote lang="en" className="text-sm leading-relaxed text-fg-secondary">{image.prompt}</blockquote>
      <CopyButton text={image.prompt} label={g.copy} done={g.copied} failed={g.copyFailed} />
      <ItemFacts item={image} />
      <ReproduceBlock parts={reproduceParts(image)} />
    </section>
  );
}

