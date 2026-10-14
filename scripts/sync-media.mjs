#!/usr/bin/env node
/**
 * Writes `src/core/media/media.generated.json` — the content hashes of the media this site shows from the CDN
 * (the home captures, the mobile recordings and the "Made here" gallery under `site/products/orazaka/`).
 *
 *   node scripts/sync-media.mjs <path to a krizaka-com checkout>
 *
 * Read from krizaka.com's `lib/cdn-manifest.json` (where `scripts/cdn-assets.mjs` records an upload), never typed.
 * The media live on Bunny, never here. Never hand-edit the output.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = process.argv[2];
if (!site) {
  console.error("usage: node scripts/sync-media.mjs <krizaka-com checkout>");
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(path.join(site, "lib/cdn-manifest.json"), "utf8"));
const AREAS = ["products/orazaka/mobile/", "products/orazaka/gallery/", "products/orazaka/home/"];
const files = Object.fromEntries(Object.entries(manifest.files).filter(([k]) => AREAS.some((a) => k.startsWith(a))).sort(([a], [b]) => a.localeCompare(b)));
if (!Object.keys(files).length) throw new Error("no Orazaka media in the manifest");
fs.writeFileSync(path.join(root, "src/core/media/media.generated.json"), `${JSON.stringify({ cdnRoot: manifest.root, files }, null, 2)}\n`);
process.stdout.write(`${Object.keys(files).length} media recorded\n`);
