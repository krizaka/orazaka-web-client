"use client";

import type { ClipId } from "@/features/landing/utils/mobile";
import { clipUrls } from "@/features/landing/utils/mobile";

/**
 * One recording of the app in a phone: a 9:16-ish frame around the clip, played in place on demand. Nothing loads
 * before the visitor presses play (`preload="none"`, the poster stands in) and nothing autoplays — which is also
 * what reduced motion asks: the poster alone until play is pressed. `alt` is the text alternative of the recording;
 * the caption under it is optional (a step explains itself beside the phone).
 */
export function PhoneClip({ id, label, alt, caption }: Readonly<{ id: ClipId; label: string; alt: string; caption?: string }>) {
  const u = clipUrls(id);
  return (
    <figure className="flex w-full min-w-0 flex-col gap-3">
      <div className="mx-auto w-full max-w-[15rem] overflow-hidden rounded-[2rem] border-[6px] border-border-default bg-surface-2 shadow-lg">
        <video
          controls
          playsInline
          preload="none"
          poster={u.poster}
          aria-label={`${label}. ${alt}`}
          className="block aspect-[720/1566] w-full bg-surface-2 object-cover"
        >
          <source src={u.webm} type="video/webm" />
          <source src={u.mp4} type="video/mp4" />
        </video>
      </div>
      {caption && (
        <figcaption className="space-y-1 text-center">
          <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{label}</span>
          <span className="block text-sm leading-relaxed text-fg-secondary">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
