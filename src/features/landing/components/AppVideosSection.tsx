"use client";

import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { AppVideoPlayer } from "@/features/landing/components/AppVideoPlayer";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { APP_VIDEOS, videoId, videoUrl } from "@/features/landing/utils/app-videos";

/** The recording's shape: the web at 16:10 (the journeys are filmed at 1280×800). */
const SHAPE = { width: 1280, height: 800 } as const;

/** The videos the web journeys recorded of the app (krizaka/.github#315). Nothing is drawn while the manifest holds no video. */
export function AppVideosSection() {
  const { t, locale } = useTranslation();
  const v = t.desktop.videos;
  if (APP_VIDEOS.length === 0) return null;
  return (
    <article data-testid="desktop-videos" className="mx-auto max-w-6xl space-y-8 px-4 py-16 sm:px-5 lg:py-20">
      <SectionHeading eyebrow={t.desktop.hero.eyebrow} title={v.title} lead={v.lead} />
      <ul className="grid gap-6 sm:grid-cols-2">
        {APP_VIDEOS.map((video) => {
          const words = v.items[videoId(video)];
          const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(video.capturedAt));
          return (
            <li key={videoId(video)} className="flex flex-col gap-3" data-video={videoId(video)}>
              <AppVideoPlayer poster={videoUrl(video.files.poster)} webm={videoUrl(video.files.webm)} mp4={videoUrl(video.files.mp4)} {...SHAPE} play={v.play} label={words.name} />
              <h3 className="font-display text-base font-bold text-fg">{words.name}</h3>
              <p className="text-sm text-fg-secondary">{words.body}</p>
              <p className="text-xs text-fg-muted">
                {fill(v.recorded, { date })} · {fill(v.seconds, { seconds: String(Math.round(video.seconds)) })}
              </p>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
