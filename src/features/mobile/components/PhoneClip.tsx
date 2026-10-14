"use client";

import type { ClipId } from "@/features/mobile/mobile";
import { clipUrls } from "@/features/mobile/mobile";

/**
 * One recording of the app in a phone: a 9:16-ish frame around the clip, played in place on demand. Nothing loads
 * before the visitor presses play (`preload="none"`, the poster stands in) and nothing autoplays — which is also
 * what reduced motion asks: the poster alone until play is pressed. The caption says what the recording shows.
 */
export function PhoneClip({ id, label, caption }: Readonly<{ id: ClipId; label: string; caption: string }>) {
  const u = clipUrls(id);
  return (
    <figure className="flex w-full min-w-0 flex-col gap-3">
      <div className="mx-auto w-full max-w-[15rem] overflow-hidden rounded-[2rem] border-[6px] border-border-default bg-surface-2 shadow-lg">
        <video
          controls
          playsInline
          preload="none"
          poster={u.poster}
          aria-label={`${label}. ${caption}`}
          className="block aspect-[720/1566] w-full bg-surface-2 object-cover"
        >
          <source src={u.webm} type="video/webm" />
          <source src={u.mp4} type="video/mp4" />
        </video>
      </div>
      <figcaption className="space-y-1 text-center">
        <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{label}</span>
        <span className="block text-sm leading-relaxed text-fg-secondary">{caption}</span>
      </figcaption>
    </figure>
  );
}
