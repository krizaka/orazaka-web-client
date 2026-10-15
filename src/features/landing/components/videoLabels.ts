import { fill } from "@/core/context/fill";
import type { GalleryDictionary } from "@/core/context/translations.gallery";
import type { LoopVideoLabels } from "@/features/landing/components/LoopVideo";

/** The words of a clip's player, from the gallery's messages: "Video · 5 s" says what it is and how long. */
export function videoLabels(g: GalleryDictionary, duration: number): LoopVideoLabels {
  return {
    badge: fill(g.videoBadge, { seconds: Math.round(duration) }),
    play: g.videoPlay,
    pause: g.videoPause,
    mute: g.videoMute,
    unmute: g.videoUnmute,
    enlarge: g.videoEnlarge,
    close: g.videoClose,
  };
}
