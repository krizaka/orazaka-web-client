"use client";

import * as React from "react";
import { ClipPlayer } from "@krizaka/orazaka-design-system";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { clipsFor, type Clip } from "@/features/landing/utils/showcase";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/**
 * The recordings of the real application (signed in as the demo persona), each in the kit's ClipPlayer — a muted loop
 * while in view, hover controls, enlarge, no native controls — with "what to notice" beside it, following the clip: the
 * note of the moment is the one lit — and where each output was made, said plainly. Media are on the CDN.
 */
export function LandingDemo() {
  const { t, locale } = useTranslation();
  const d = t.landing.demo;
  const clips = clipsFor(locale);

  return (
    <SectionBackdrop id="demo" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={d.eyebrow} title={d.title} lead={d.lead} />
        <ul className="grid gap-6 md:grid-cols-2">
          {clips.map((c) => (
            <li key={c.id} id={`demo-${c.id}`} data-reveal className="scroll-mt-20 flex flex-col gap-4 rounded-2xl border border-border-default bg-surface-1/85 p-4 ">
              <DemoClip clip={c} />
            </li>
          ))}
        </ul>
      </article>
    </SectionBackdrop>
  );
}

/** The index of the note a moment of the clip falls in: the last one that has begun. */
export function noteAt(notes: readonly { at: number }[], time: number): number {
  let index = 0;
  notes.forEach((note, i) => {
    if (time >= note.at) index = i;
  });
  return index;
}

function DemoClip({ clip }: Readonly<{ clip: Clip }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const d = t.landing.demo;
  const frame = React.useRef<HTMLDivElement>(null);
  const [current, setCurrent] = React.useState(0);

  // The player is the kit's: the clip's own <video> tells the time, the notes follow it.
  React.useEffect(() => {
    const video = frame.current?.querySelector("video");
    if (!video) return;
    const onTime = () => setCurrent(noteAt(clip.notes, video.currentTime));
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [clip.notes]);

  return (
    <figure className="space-y-3">
      <div ref={frame}>
        <ClipPlayer
          sources={{ mp4: clip.mp4, webm: clip.webm, poster: clip.poster }}
          title={clip.label}
          labels={{
            badge: fill(g.videoBadge, { seconds: Math.round(clip.duration) }),
            play: g.videoPlay,
            pause: g.videoPause,
            mute: g.videoMute,
            unmute: g.videoUnmute,
            enlarge: g.videoEnlarge,
            close: g.videoClose,
          }}
          className="aspect-[16/10] rounded-xl"
        />
      </div>
      <figcaption className="space-y-3">
        <span className="block font-mono text-xs font-semibold text-fg-accent">{clip.label}</span>
        <span className="block text-sm leading-relaxed text-fg-secondary">{clip.caption}</span>
        <span className="block text-[13px] leading-relaxed text-fg-secondary">
          <b className="font-semibold text-fg">{d.origin} · </b>
          {clip.origin}
        </span>
        <span className="block space-y-1.5">
          <span className="block font-mono text-[11px] font-semibold text-fg-muted">{d.notice}</span>
          <ol className="space-y-1">
            {clip.notes.map((note, i) => (
              <li key={note.at} data-active={i === current ? "" : undefined} className="flex gap-2 text-[13px] leading-snug text-fg-muted transition-colors data-active:text-fg">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border-strong transition-colors in-data-active:bg-accent" />
                <span>{note.text}</span>
              </li>
            ))}
          </ol>
        </span>
      </figcaption>
    </figure>
  );
}
