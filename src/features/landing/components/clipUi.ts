import { fill } from "@/core/context/fill";
import type { GalleryDictionary } from "@/core/context/translations.gallery";
import { CLIP_MODEL, type GalleryClip, type ImageRecord } from "@/features/landing/utils/gallery-clips";
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
  const facts: RunFact[] = [
    { label: g.videoModel, value: `${(clip.via ?? CLIP_MODEL).name} (${(clip.via ?? CLIP_MODEL).licence})` },
    { label: g.videoProvider, value: (clip.via ?? CLIP_MODEL).provider },
    { label: g.runBy, value: `Orazaka — ${g.routedBy}` },
    { label: g.runId, value: clip.runId },
    { label: g.seedValue, value: clip.seed },
    { label: g.frame, value: `${clip.width}×${clip.height} · ${clip.aspect} · ${fill(g.fps, { fps: clip.fps })}` },
    { label: g.clipLength, value: fill(g.seconds, { seconds: clip.duration }) },
  ];
  if (clip.seconds !== undefined) facts.push({ label: g.time, value: fill(g.videoTime, { seconds: clip.seconds }) });
  if (clip.upscale) facts.push({ label: g.upscaleLabel, value: fill(g.upscaleFact, { model: clip.upscale.model, licence: clip.upscale.licence, from: clip.upscale.from, to: clip.upscale.to, seconds: clip.upscale.seconds, cost: clip.upscale.costUsd.toFixed(2) }) });
  // An image-to-video clip is charged by the GPU's hour, not by the clip: the figure is that run's share of the hour.
  facts.push({ label: clip.via ? g.gpuCostLabel : g.clipCost, value: fill(clip.via ? g.gpuCost : g.cost, { cost: clip.costUsd.toFixed(2) }) });
  return facts;
}

/** The model and the place of a clip's chip: "Wan 2.2 TI2V 5B · RunPod H100 80 GB" or "Wan 2.2 A14B · DigitalOcean". */
export function clipChip(clip: GalleryClip): { model: string; where: string } {
  const base = clip.via ? { model: clip.via.name, where: clip.via.provider } : { model: CLIP_MODEL.name, where: "DigitalOcean" };
  return clip.upscale ? { ...base, where: `${base.where} · ↑ ${clip.upscale.to.split("×")[1]}p` } : base;
}

/** What the run of a still recorded — and nothing else: the model, who made it, who ran it, the run, the seed, the size, the time and the price. */
export function imageFacts(g: GalleryDictionary, image: ImageRecord, model: { name: string; licence: string; provider: string }): RunFact[] {
  return [
    { label: g.model, value: `${model.name} (${model.licence})` },
    { label: g.videoProvider, value: model.provider },
    { label: g.runBy, value: `Orazaka — ${g.routedBy}` },
    { label: g.runId, value: image.runId },
    { label: g.seedValue, value: image.seed },
    { label: g.imageFrameLabel, value: fill(g.imageFrame, { width: image.width, height: image.height }) },
    { label: g.time, value: fill(g.videoTime, { seconds: image.seconds }) },
    { label: g.clipCost, value: fill(g.imageCost, { cost: image.costUsd.toFixed(2) }) },
  ];
}
