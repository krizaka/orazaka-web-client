"use client";

import * as React from "react";
import { cn } from "@krizaka/ui/cn";
import { useTranslation } from "@/core/context/LocaleContext";
import { useAppearance } from "@/features/landing/components/useAppearance";
import { CLIPS, LANGS, clipFiles, type ClipId } from "@/features/clips/clips";

/**
 * A demo recording in place of a paragraph: muted, looping, captioned (`<track>` in both languages, the page's first),
 * its box reserved by the aspect ratio so nothing shifts. It loads its metadata only near the screen and plays only while
 * on it; under reduced motion or Save-Data the poster — the finished state — stands in.
 * Stand-in for the captioned loop block krizaka-ui#489 will ship: swap it there, then delete this file.
 */
export function Clip({ id, priority = false, className }: Readonly<{ id: ClipId; priority?: boolean; className?: string }>) {
  const { t, locale } = useTranslation();
  const look = useAppearance();
  const video = React.useRef<HTMLVideoElement>(null);
  const { width, height, aspect } = CLIPS[id];
  const files = clipFiles(id, locale, look);
  const copy = t.clips[id];

  React.useEffect(() => {
    const el = video.current;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!el || saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? void el.play().catch(() => {}) : el.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [files.webm]);

  return (
    <figure className={className}>
      <video
        key={files.webm}
        ref={video}
        className={cn("block h-auto w-full rounded-lg border border-border-subtle bg-surface-1", aspect)}
        width={width}
        height={height}
        poster={files.poster}
        muted
        loop
        playsInline
        preload={priority ? "metadata" : "none"}
        aria-label={copy.alt}
        data-testid={`clip-${id}`}
      >
        <source src={files.webm} type="video/webm" />
        <source src={files.mp4} type="video/mp4" />
        {[locale, ...LANGS.filter((l) => l !== locale)].map((lang) => (
          <track key={lang} kind="captions" srcLang={lang} label={lang === "fr" ? "Français" : "English"} src={`/captions/${id}/${lang}`} default={lang === locale} />
        ))}
      </video>
      <figcaption className="px-1 pt-2 font-mono text-xs text-fg-secondary">{copy.caption}</figcaption>
    </figure>
  );
}
