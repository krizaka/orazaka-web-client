#!/usr/bin/env node
/**
 * Writes `src/features/landing/utils/gallery-i2v.json` — the image-to-video clips of "Made here", from the records of the
 * batch (`scripts/gpu-i2v-run.mjs` of krizaka/orazaka: one JSON per run, with what the platform's own job reported) and
 * from the review of a person (`review.json`: `{ "<clip id>": { "accepted": true|false, "note": "…" } }` — a clip nobody
 * looked at, or that warps, is never published).
 *
 *   node scripts/sync-i2v.mjs <batch dir holding out/*.json, plan.json and review.json>
 *
 * Only the 16:9 clips are published on the site (the 9:16 set is made for Orochia's Shorts shelf and the mobile apps). Never hand-edit the output.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "src/features/landing/utils/gallery-i2v.json");

/** The subjects: the plan's source photo → the gallery image it is, and the file stem of its clip. */
export const SUBJECTS = {
  "mini-bagels": { image: "mini-bagels", stem: "bagels-i2v" },
  "mini-souk": { image: "mini-souk", stem: "souk-i2v" },
  "mini-ironing": { image: "mini-ironing", stem: "grandmothers-tea-i2v" },
  "tea-pour": { image: "tea-pour", stem: "tea-pour-i2v" },
  "mini-picnic": { image: "mini-picnic", stem: "picnic-i2v" },
  "mini-skating": { image: "mini-skating", stem: "skating-i2v" },
};

/** Frames of the cross-fade between the two halves of a 10 s clip. */
export const LINK_FRAMES = 4;

/** The published records of a batch: accepted 16:9 clips, each with exactly what its run reported. */
export const FEATURED = ["bagels-i2v", "souk-i2v", "tea-pour-i2v"];

export function records(batch, review) {
  const out = [];
  const byId = new Map(batch.map((c) => [c.id, c]));
  for (const clip of batch) {
    const subject = clip.id.replace(/-(16x9|9x16)$/, "");
    const known = SUBJECTS[subject];
    if (!known || clip.aspect !== "16:9" || clip.status !== "SUCCEEDED") continue;
    if (review[clip.id]?.accepted !== true) continue;
    const r = clip.reported;
    if (!r.width || !r.height || !r.frames || !r.fps) throw new Error(`${clip.id}: the run did not report its frame`);
    out.push({
      stem: `products/orazaka/gallery-video/${known.stem}`,
      record: {
        id: known.stem,
        imageId: known.image,
        ...(FEATURED.includes(known.stem) ? { featured: true } : {}),
        model: clip.model,
        fromImage: true,
        gpu: r.gpu,
        gpuRateUsdPerHour: clip.gpuRateUsdPerHour,
        prompt: clip.prompt,
        seed: String(r.seed),
        width: r.width,
        height: r.height,
        fps: r.fps,
        duration: r.durationSeconds,
        seconds: clip.runSeconds,
        costUsd: Math.round(clip.gpuCostUsd * 100) / 100,
        runId: clip.runId,
      },
    });
    // A 10 s version: the clip, then a second run that starts from its last frame (same seed), cross-faded over 4 frames.
    const second = byId.get(`${clip.id}-b`);
    if (second?.status === "SUCCEEDED" && review[second.id]?.accepted === true) {
      out.push({
        stem: `products/orazaka/gallery-video/${known.stem}-10s`,
        record: {
          id: `${known.stem}-10s`,
          imageId: known.image,
          model: clip.model,
          fromImage: true,
          gpu: r.gpu,
          gpuRateUsdPerHour: clip.gpuRateUsdPerHour,
          prompt: clip.prompt,
          seed: String(r.seed),
          width: r.width,
          height: r.height,
          fps: r.fps,
          duration: Math.round(((r.frames * 2 - LINK_FRAMES) / r.fps) * 100) / 100, // 238 frames at 24 fps
          seconds: clip.runSeconds + second.runSeconds,
          costUsd: Math.round((clip.gpuCostUsd + second.gpuCostUsd) * 100) / 100,
          runId: clip.runId,
          linkedRunId: second.runId,
        },
      });
    }
  }
  return out;
}

function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("usage: node scripts/sync-i2v.mjs <batch dir>");
    process.exit(1);
  }
  const batch = fs.readdirSync(path.join(dir, "out")).filter((f) => f.endsWith(".json")).sort().map((f) => JSON.parse(fs.readFileSync(path.join(dir, "out", f), "utf8")));
  const review = JSON.parse(fs.readFileSync(path.join(dir, "review.json"), "utf8"));
  const rows = records(batch, review);
  fs.writeFileSync(OUT, `${JSON.stringify(rows, null, 2)}\n`);
  process.stdout.write(`${rows.length} image-to-video clip(s) recorded\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
