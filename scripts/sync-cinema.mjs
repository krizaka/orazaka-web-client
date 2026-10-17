#!/usr/bin/env node
/**
 * Writes `src/features/landing/utils/cinema-films.generated.json` — what each cinematic short's production recorded
 * (krizaka/orazaka `docs/measurements/cinema.json`, generated from the production files by `scripts/cinema-measure.mjs`).
 *
 *   node scripts/sync-cinema.mjs <orazaka checkout>
 *
 * Read, never typed. The films themselves live on Bunny (`products/orazaka/cinema/<film>.{mp4,webm}`, `-poster.webp`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function records(measured) {
  const out = {};
  for (const film of measured.films ?? []) {
    const { media, ...record } = film;
    if (!/^products\/orazaka\/cinema\/[a-z0-9-]+$/.test(media)) throw new Error(`${film.id}: media path ${media} is not under products/orazaka/cinema/`);
    out[media] = record;
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const src = process.argv[2];
  if (!src) {
    console.error("usage: node scripts/sync-cinema.mjs <orazaka checkout>");
    process.exit(1);
  }
  const measured = JSON.parse(fs.readFileSync(path.join(src, "docs/measurements/cinema.json"), "utf8"));
  const out = path.join(root, "src/features/landing/utils/cinema-films.generated.json");
  fs.writeFileSync(out, `${JSON.stringify(records(measured), null, 2)}\n`);
  process.stdout.write(`${Object.keys(records(measured)).length} film(s) recorded\n`);
}
