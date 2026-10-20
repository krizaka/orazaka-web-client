"use client";

import * as React from "react";
import { useTranslation } from "@/core/context/LocaleContext";
import { mediaUrl } from "@/core/media/cdn";
import { useAppearance } from "@/features/landing/components/useAppearance";

/** The take's frame: the 760×640 window of the real web client, scaled to 1140×960 — the browser reserves it, nothing shifts. */
const WIDTH = 1140;
const HEIGHT = 960;

/** The files of one take: `products/orazaka/home/take-<locale>-<theme>.{webm,mp4}` and its poster (the finished answer). */
export function takeFiles(locale: string, look: string) {
  const base = `products/orazaka/home/take-${locale}-${look}`;
  return { webm: mediaUrl(`${base}.webm`), mp4: mediaUrl(`${base}.mp4`), poster: mediaUrl(`${base}-poster.webp`) };
}

/**
 * The hero's visual: the real Orazaka chat answering a real question, recorded on dev.orazaka.com (scripts/landing-take.mjs,
 * ≥ 25 fps), in the language and the theme of the page. A muted loop that plays only while on screen and never under
 * reduced motion — the poster, the finished answer, stands in. It lives in the template's window, so it is below the text
 * on a phone and does not hold the first paint (the heading is the LCP).
 */
export function HeroTake() {
  const { t, locale } = useTranslation();
  const look = useAppearance();
  const video = React.useRef<HTMLVideoElement>(null);
  const files = takeFiles(locale, look);

  React.useEffect(() => {
    const el = video.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? void el.play().catch(() => {}) : el.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [files.webm]);

  return (
    <div className="flex flex-col">
      <video
        key={files.webm}
        ref={video}
        className="block aspect-[1140/960] h-auto w-full bg-surface-1"
        width={WIDTH}
        height={HEIGHT}
        poster={files.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={t.landing.hero.takeAlt}
        data-testid="hero-take"
      >
        <source src={files.webm} type="video/webm" />
        <source src={files.mp4} type="video/mp4" />
        <track kind="captions" />
      </video>
      <p className="border-t border-border-subtle px-4 py-2 font-mono text-xs text-fg-secondary">{t.landing.hero.takeCaption}</p>
    </div>
  );
}
