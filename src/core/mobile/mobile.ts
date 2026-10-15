/**
 * @file mobile.ts
 * @description The four steps of the Orazaka mobile app, in the order a person lives them: sign in, run a Studio, ask,
 * follow the jobs. Each step is one recording (iOS simulator) on the CDN under products/orazaka/mobile (hashes:
 * core/media/media.generated.json); its words — goal, purpose, alt, the things to notice — are `t.mobile.steps`.
 * Fewer screens, each one explained: a screen that does not tell a distinct part of the story is not shown.
 */
import { mediaUrl } from "@/core/media/cdn";

export const STEPS = ["sign-in", "studio-run", "ask", "jobs"] as const;
export type StepId = (typeof STEPS)[number];
export type ClipId = StepId;

const AREA = "products/orazaka/mobile";

export function clipUrls(id: ClipId) {
  return {
    webm: mediaUrl(`${AREA}/clip-${id}.webm`),
    mp4: mediaUrl(`${AREA}/clip-${id}.mp4`),
    poster: mediaUrl(`${AREA}/clip-${id}-poster.webp`),
  };
}
