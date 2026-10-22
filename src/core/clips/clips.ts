/**
 * @file clips.ts
 * @description The demo recordings of the public site: the home's chat take and the three web steps, all recorded on the
 * current UI as the demo persona (scripts/landing-take.mjs, scripts/record-web-steps.mjs) and served from the CDN
 * (`media.generated.json`). One vocabulary, one table: the home, the docs and the caption route read it.
 */
import { mediaUrl } from "@/core/media/cdn";

export const CLIP_IDS = ["take", "workspace", "studio", "results"] as const;
export type ClipId = (typeof CLIP_IDS)[number];

export const LANGS = ["en", "fr"] as const;
export type Lang = (typeof LANGS)[number];

export const LOOKS = ["dark", "light"] as const;
export type Look = (typeof LOOKS)[number];

interface ClipSpec {
  width: number;
  height: number;
  /** The box's ratio as a Tailwind class (spelled out: the scanner reads literals), so nothing shifts. */
  aspect: string;
  /** The shortest recording of the clip, in seconds: the captions are spread over it. */
  seconds: number;
  /** The take is recorded once per language (the question is typed in it); the web steps are the app as it is. */
  perLang: boolean;
}

export const CLIPS: Readonly<Record<ClipId, ClipSpec>> = {
  take: { width: 1140, height: 960, aspect: "aspect-[1140/960]", seconds: 8, perLang: true },
  workspace: { width: 1120, height: 700, aspect: "aspect-[1120/700]", seconds: 4, perLang: false },
  studio: { width: 1120, height: 700, aspect: "aspect-[1120/700]", seconds: 6, perLang: false },
  results: { width: 1120, height: 700, aspect: "aspect-[1120/700]", seconds: 5, perLang: false },
};

export const isClipId = (id: string): id is ClipId => (CLIP_IDS as readonly string[]).includes(id);
export const isLang = (lang: string): lang is Lang => (LANGS as readonly string[]).includes(lang);

/** `products/orazaka/home/take-fr-dark` or `products/orazaka/web/step-studio-light`: the CDN path without extension. */
export function clipBase(id: ClipId, lang: Lang, look: Look): string {
  return CLIPS[id].perLang ? `products/orazaka/home/${id}-${lang}-${look}` : `products/orazaka/web/step-${id}-${look}`;
}

export function clipFiles(id: ClipId, lang: Lang, look: Look) {
  const base = clipBase(id, lang, look);
  return { webm: mediaUrl(`${base}.webm`), mp4: mediaUrl(`${base}.mp4`), poster: mediaUrl(`${base}-poster.webp`) };
}

const stamp = (s: number) => {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  return `${m}:${(s % 60).toFixed(3).padStart(6, "0")}`;
};

/** WebVTT for a clip: the cues share its length evenly. */
export function captionsVtt(id: ClipId, cues: readonly string[]): string {
  const step = CLIPS[id].seconds / cues.length;
  const body = cues.map((text, i) => `${stamp(i * step)} --> ${stamp((i + 1) * step)}\n${text}`);
  return `WEBVTT\n\n${body.join("\n\n")}\n`;
}
