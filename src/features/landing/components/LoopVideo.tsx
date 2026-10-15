"use client";

import * as React from "react";
import { cn } from "@krizaka/ui/cn";

/** The frame the provider's clips have (832×480): reserved from the first paint, so nothing moves when the file arrives. */
const FRAME = "aspect-[26/15] w-full object-cover";
const REDUCED = "(prefers-reduced-motion: reduce)";
const readReducedMotion = () => (typeof window.matchMedia === "function" ? window.matchMedia(REDUCED).matches : false);
function subscribeReducedMotion(notify: () => void) {
  const query = typeof window.matchMedia === "function" ? window.matchMedia(REDUCED) : null;
  query?.addEventListener?.("change", notify);
  return () => query?.removeEventListener?.("change", notify);
}

export interface LoopVideoSources {
  mp4: string;
  webm: string;
  poster: string;
}

/**
 * A muted loop that plays only while it is on screen (IntersectionObserver) and pauses off screen and in a hidden tab
 * — no permanent decoding, no sound, no autoplay the visitor did not scroll to. Under `prefers-reduced-motion` it
 * never plays by itself: the poster is what is drawn, and the native controls are there to play it on purpose. The
 * frame has its final aspect ratio from the first paint (`aspect-[26/15]`, the 832×480 of the clips), so nothing moves when
 * the file arrives. Files are served as they are from the CDN, loaded on demand (`preload="none"`).
 */
export function LoopVideo({
  sources,
  label,
  width,
  height,
  className,
}: Readonly<{ sources: LoopVideoSources; label: string; width: number; height: number; className?: string }>) {
  const ref = React.useRef<HTMLVideoElement>(null);
  // On the server nothing plays (the preference is unknown); in the browser it is the visitor's.
  const reduced = React.useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => true);

  React.useEffect(() => {
    const video = ref.current;
    if (!video || reduced || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) void video.play?.()?.catch?.(() => undefined);
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
  }, [reduced]);

  return (
    <video
      ref={ref}
      aria-label={label}
      poster={sources.poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      controls={reduced}
      data-reduced-motion={reduced ? "true" : undefined}
      className={cn(FRAME, className)}
    >
      <source src={sources.webm} type="video/webm" />
      <source src={sources.mp4} type="video/mp4" />
    </video>
  );
}
