/**
 * @file mobile.ts
 * @description The recordings and screenshots of the Orazaka mobile app (iOS simulator, Android emulator). Media are on
 * the CDN under products/orazaka/mobile (hashes: core/media/media.generated.json); the words are `t.mobile`.
 */
import { mediaUrl } from "@/core/media/cdn";

export const CLIPS = ["sign-in", "studio-run", "ask", "jobs"] as const;
export type ClipId = (typeof CLIPS)[number];

export interface Shot {
  id: string;
  platform: "ios" | "android";
}

/** In reading order: the iOS screens, then the Android ones. */
export const SHOTS: readonly Shot[] = [
  { id: "01-sign-in", platform: "ios" },
  { id: "02-studios", platform: "ios" },
  { id: "03-studio-detail", platform: "ios" },
  { id: "09-chat-answer", platform: "ios" },
  { id: "05-jobs", platform: "ios" },
  { id: "06-connectors", platform: "ios" },
  { id: "07-system", platform: "ios" },
  { id: "08-profile", platform: "ios" },
  { id: "android-studios", platform: "android" },
  { id: "android-jobs", platform: "android" },
];

const AREA = "products/orazaka/mobile";

export function clipUrls(id: ClipId) {
  return {
    webm: mediaUrl(`${AREA}/clip-${id}.webm`),
    mp4: mediaUrl(`${AREA}/clip-${id}.mp4`),
    poster: mediaUrl(`${AREA}/clip-${id}-poster.webp`),
  };
}

export const shotUrl = (id: string): string => mediaUrl(`${AREA}/${id}.webp`);
