import { fill } from "@/core/context/fill";
import type { GalleryDictionary } from "@/core/context/translations.gallery";
import { clipModel, type GalleryClip } from "@/features/landing/utils/gallery-clips";
import type { RunFact, VideoResultLabels } from "@krizaka/orazaka-design-system";

/** The words of a clip's player, prompt, command and download, from the gallery's messages ("Video · 5 s" says what it is and how long). */
export function clipLabels(g: GalleryDictionary, clip: GalleryClip): VideoResultLabels {
  return {
    badge: fill(g.videoBadge, { seconds: Math.round(clip.duration) }),
    play: g.videoPlay,
    pause: g.videoPause,
    mute: g.videoMute,
    unmute: g.videoUnmute,
    enlarge: g.videoEnlarge,
    close: g.videoClose,
    prompt: g.videoPromptHeading,
    facts: g.runHeading,
    reproduce: g.reproduce,
    copy: g.copyCommand,
    copied: g.commandCopied,
    download: g.videoDownload,
  };
}

/** What the run of a clip recorded — and nothing else: the model, who made it, who ran it, the run, the seed, the frame, the length, the time (when it is a fair one) and the price. */
export function clipFacts(g: GalleryDictionary, clip: GalleryClip): RunFact[] {
  const model = clipModel(clip);
  const facts: RunFact[] = [
    { label: g.videoModel, value: `${model.name} (${model.licence})` },
    { label: g.videoProvider, value: model.provider },
    ...(clip.fromImage ? [{ label: g.videoFrom, value: g.videoFromImage }] : []),
    { label: g.runBy, value: `Orazaka — ${g.routedBy}` },
    { label: g.runId, value: clip.runId },
    { label: g.seedValue, value: clip.seed },
    { label: g.frame, value: `${clip.width}×${clip.height} · ${clip.aspect} · ${fill(g.fps, { fps: clip.fps })}` },
    { label: g.clipLength, value: fill(g.seconds, { seconds: clip.duration }) },
  ];
  if (clip.seconds !== undefined) facts.push({ label: g.time, value: fill(g.videoTime, { seconds: clip.seconds }) });
  facts.push(
    clip.gpuRateUsdPerHour
      ? { label: g.clipCostGpu, value: fill(g.costGpu, { cost: clip.costUsd.toFixed(2), rate: clip.gpuRateUsdPerHour.toFixed(2) }) }
      : { label: g.clipCost, value: fill(g.cost, { cost: clip.costUsd.toFixed(2) }) },
  );
  return facts;
}
