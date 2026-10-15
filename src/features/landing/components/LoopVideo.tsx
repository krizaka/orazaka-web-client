"use client";

import * as React from "react";
import { MuteIcon, PauseIcon, PlayIcon, SoundIcon, VideoIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { cn } from "@krizaka/ui/cn";
import { Dialog } from "@krizaka/ui/dialog";

export interface LoopVideoSources {
  mp4: string;
  webm: string;
  poster: string;
}

/** Every word of the player, translated by the page. */
export interface LoopVideoLabels {
  /** The badge that says it is a video: "Video · 5 s". */
  badge: string;
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  /** The name of the button that opens the clip larger (the whole frame is that button). */
  enlarge: string;
  /** The close button of the large view. */
  close: string;
}

/** The frame the provider's clips have (832×480): reserved from the first paint, so nothing moves when the file arrives. */
const FRAME = "aspect-[26/15] w-full object-cover";
const REDUCED = "(prefers-reduced-motion: reduce)";
const readReducedMotion = () => (typeof window.matchMedia === "function" ? window.matchMedia(REDUCED).matches : false);
function subscribeReducedMotion(notify: () => void) {
  const query = typeof window.matchMedia === "function" ? window.matchMedia(REDUCED) : null;
  query?.addEventListener?.("change", notify);
  return () => query?.removeEventListener?.("change", notify);
}

const control = "pointer-events-auto bg-surface-0/80 backdrop-blur";

/**
 * A clip that is plainly a clip: a muted loop that plays only while it is on screen (IntersectionObserver) and
 * pauses off screen and in a hidden tab, a "Video · 5 s" badge, play/pause and sound buttons that show on hover and
 * focus (always on touch screens: they are drawn when the pointer cannot hover), and a click anywhere on the frame
 * opens it larger in a dialog with the native controls. Under `prefers-reduced-motion` it never plays by itself: the
 * poster and a play button. Plain mp4/webm from the CDN (webm first, mp4 as the fallback), `playsInline`, `preload="none"`.
 */
export function LoopVideo({
  sources,
  title,
  labels,
  className,
}: Readonly<{ sources: LoopVideoSources; title: string; labels: LoopVideoLabels; className?: string }>) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const userPaused = React.useRef(false);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  // On the server nothing plays (the preference is unknown); in the browser it is the visitor's.
  const reduced = React.useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => true);

  React.useEffect(() => {
    const video = ref.current;
    if (!video || reduced || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !userPaused.current && !open) void video.play?.()?.catch?.(() => undefined);
      else video.pause?.();
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    }, { threshold: 0.35 });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause?.();
    };
  }, [reduced, open]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play?.()?.catch?.(() => undefined);
    } else {
      userPaused.current = true;
      video.pause?.();
    }
  };
  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <>
      <div className="group relative overflow-hidden" data-loop-video>
        <video
          ref={ref}
          aria-label={title}
          poster={sources.poster}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          data-reduced-motion={reduced ? "true" : undefined}
          className={cn(FRAME, "block", className)}
        >
          <source src={sources.webm} type="video/webm" />
          <source src={sources.mp4} type="video/mp4" />
        </video>
        <button type="button" onClick={() => setOpen(true)} aria-label={labels.enlarge} className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <span className={cn(control, "pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border-default px-2.5 py-1 font-mono text-xs text-fg")} data-video-badge>
          <VideoIcon size={14} />
          {labels.badge}
        </span>
        {reduced && !playing && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Button type="button" variant="primary" size="lg" shape="pill" className="pointer-events-auto" onClick={toggle} aria-label={labels.play}>
              <PlayIcon size={20} />
            </Button>
          </span>
        )}
        <div className="pointer-events-none absolute bottom-3 right-3 flex gap-2 opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100">
          <Button type="button" variant="secondary" size="sm" className={control} onClick={toggle} aria-label={playing ? labels.pause : labels.play}>
            {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </Button>
          <Button type="button" variant="secondary" size="sm" className={control} onClick={toggleSound} aria-label={muted ? labels.unmute : labels.mute} aria-pressed={!muted}>
            {muted ? <MuteIcon size={16} /> : <SoundIcon size={16} />}
          </Button>
        </div>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content closeLabel={labels.close} className="max-w-5xl">
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <video aria-label={title} poster={sources.poster} controls autoPlay loop playsInline className="block aspect-[26/15] w-full rounded-lg bg-surface-2">
            <source src={sources.webm} type="video/webm" />
            <source src={sources.mp4} type="video/mp4" />
          </video>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
