"use client";

import Image from "next/image";
import { VideoResult } from "@krizaka/orazaka-design-system";
import { Tabs } from "@krizaka/ui/tabs";
import { useTranslation } from "@/core/context/LocaleContext";
import { gallerySrc } from "@/features/landing/utils/gallery";
import { CLIPS, clipFiles, clipReproduceParts, type GalleryClip } from "@/features/landing/utils/gallery-clips";
import { clipFacts, clipLabels } from "@/features/landing/components/clipUi";
import { ImagePanel } from "@/features/landing/components/GalleryPanels";
import { GALLERY } from "@/features/landing/utils/gallery";

/**
 * The Videos of /gallery — every clip the media manifest publishes, each as the kit's `VideoResult` (muted loop in view, badge, controls,
 * opens larger; the exact prompt; what the run recorded; "Reproduce it"). Where a clip continues an image, a Video · Image switch shows the
 * image's side too. One column on a phone (the 16:9 clip full width), two from `lg`.
 */
export function GalleryVideos() {
  const { t } = useTranslation();
  const g = t.gallery;
  return (
    <section id="videos" aria-labelledby="videos-title" className="space-y-6">
      <div className="space-y-2">
        <h2 id="videos-title" className="font-display text-2xl font-bold tracking-tight">{g.videosTitle}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-fg-secondary">{g.videosLead}</p>
      </div>
      <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {CLIPS.map((clip) => (
          <li key={clip.id} id={`video-${clip.id}`} className="min-w-0 rounded-2xl border border-border-default bg-surface-1 p-4 sm:p-5">
            <ClipCard clip={clip} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ClipCard({ clip }: Readonly<{ clip: GalleryClip }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const image = clip.imageId ? GALLERY.find((item) => item.id === clip.imageId) : undefined;
  const result = (
    <VideoResult
      title={g.clips[clip.id]}
      sources={clipFiles(clip)}
      prompt={clip.prompt}
      facts={clipFacts(g, clip)}
      reproduce={clipReproduceParts(clip)[0].code}
      reproduceLead={g.videoReproduceLead}
      labels={clipLabels(g, clip)}
    />
  );
  return (
    <article aria-label={g.clips[clip.id]} className="space-y-4">
      <h3 className="text-sm font-semibold text-fg">{g.clips[clip.id]}</h3>
      {image ? (
        <Tabs.Root defaultValue="video" variant="segmented" className="space-y-4">
          <Tabs.List aria-label={g.stepsLabel}>
            <Tabs.Trigger value="video">{g.videoStep}</Tabs.Trigger>
            <Tabs.Trigger value="image">{g.imageStep}</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="video">{result}</Tabs.Content>
          <Tabs.Content value="image" className="space-y-4">
            <figure className="w-2/5 min-w-44 overflow-hidden rounded-2xl border border-border-default bg-surface-2">
              <Image src={gallerySrc(image.id)} alt={g.items[image.id]} width={image.width} height={image.height} sizes="(max-width: 1024px) 40vw, 220px" loading="lazy" unoptimized className="block h-auto w-full" />
            </figure>
            <ImagePanel image={image} />
          </Tabs.Content>
        </Tabs.Root>
      ) : (
        result
      )}
    </article>
  );
}

