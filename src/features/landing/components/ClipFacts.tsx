"use client";

import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { CLIP_MODEL, type GalleryClip } from "@/features/landing/utils/gallery-clips";

/** What the run of a clip recorded — and nothing else: the model and who made it, who ran it, the run, the seed, the frame, the length, the time, the price. */
export function ClipFacts({ clip }: Readonly<{ clip: GalleryClip }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const rows: [string, string][] = [
    [g.videoModel, `${CLIP_MODEL.name} (${CLIP_MODEL.licence})`],
    [g.videoProvider, CLIP_MODEL.provider],
    [g.runBy, `Orazaka — ${g.routedBy}`],
    [g.runId, clip.runId],
    [g.seedValue, clip.seed],
    [g.frame, `${clip.width}×${clip.height} · ${clip.aspect} · ${fill(g.fps, { fps: clip.fps })}`],
    [g.clipLength, fill(g.seconds, { seconds: clip.duration })],
    [g.time, fill(g.videoTime, { seconds: clip.seconds })],
    [g.clipCost, fill(g.cost, { cost: clip.costUsd.toFixed(2) })],
  ];
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-fg-muted">{k}</dt>
          <dd className="break-all text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
