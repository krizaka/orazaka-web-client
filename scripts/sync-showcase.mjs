#!/usr/bin/env node
/**
 * Writes `src/features/landing/utils/showcase.generated.json` — the demo recordings and the packs the home page shows.
 *
 *   node scripts/sync-showcase.mjs <path to a krizaka-com checkout>
 *
 * Everything is read, never typed: the recordings' words from scripts/showcase-words.json, their
 * hashes from `lib/cdn-manifest.json` (the media live on Bunny, never here), the packs from the generated
 * `app/data/architecture.json` (a pack with status DRAFT is never shown). Never hand-edit the output.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = process.argv[2];
if (!site) {
  console.error("usage: node scripts/sync-showcase.mjs <krizaka-com checkout>");
  process.exit(1);
}
const read = (p) => JSON.parse(fs.readFileSync(path.join(site, p), "utf8"));
const manifest = read("lib/cdn-manifest.json");
const arch = read("app/data/architecture.json");

// The words are this app's own (scripts/showcase-words.json): krizaka.com no longer carries the Orazaka tour.
const words = JSON.parse(fs.readFileSync(path.join(root, "scripts/showcase-words.json"), "utf8"));
// krizaka.com's CDN manifest no longer names the Orazaka tour (the site draws it no more): a recording's hashes then
// stay those of the previous generation, which are the files already on Bunny.
const outFile = path.join(root, "src/features/landing/utils/showcase.generated.json");
const previous = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, "utf8")) : { clips: [] };
const clips = words.clips.map((c) => {
  const hash = (ext) => {
    const h = manifest.files[`products/orazaka/tour/${c.id}.${ext}`] ?? previous.clips.find((x) => x.id === c.id)?.hash?.[ext];
    if (!h) throw new Error(`products/orazaka/tour/${c.id}.${ext} is not in the CDN manifest`);
    return h;
  };
  const text = (l) => ({ label: c[l].label, caption: c[l].caption, origin: c[l].origin });
  const notes = (l) => c.notes.map((n) => ({ at: n.at, text: n[l] }));
  return {
    id: c.id,
    duration: c.duration,
    hash: { webm: hash("webm"), mp4: hash("mp4"), jpg: hash("jpg") },
    text: { en: { ...text("en"), notes: notes("en") }, fr: { ...text("fr"), notes: notes("fr") } },
  };
});

const shown = arch.packs.filter((p) => p.status === "PUBLISHED" && p.showcase);
const packs = shown.map((p) => {
  if (!p.category) throw new Error(`pack ${p.key} has no category (catalog.categoryKey in its pack.yaml)`);
  return {
    key: p.key,
    category: p.category,
    studios: p.studios.length,
    text: { en: { label: p.text.en.label, tagline: p.text.en.tagline }, fr: { label: p.text.fr.label, tagline: p.text.fr.tagline } },
  };
});

// The shelves, only those a shown pack stands on: weight from the pack.yaml, words from the packs' i18n (`category:`).
const categories = [...new Set(shown.map((p) => p.category))]
  .map((key) => {
    const owners = shown.filter((p) => p.category === key);
    const words = (l) => {
      const t = owners.map((p) => p.categoryText?.[l]).find((x) => x?.label);
      if (!t) throw new Error(`category ${key} has no ${l} label in its packs' i18n`);
      return { label: t.label, description: t.description ?? "" };
    };
    return { key, sortWeight: Math.max(...owners.map((p) => (p.categorySortWeight ?? 0))), text: { en: words("en"), fr: words("fr") } };
  })
  .sort((a, b) => b.sortWeight - a.sortWeight || a.key.localeCompare(b.key));

const out = { cdnRoot: manifest.root ?? previous.cdnRoot, clips, categories, packs };
fs.writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`);
process.stdout.write(`${clips.length} clips, ${packs.length} packs in ${categories.length} categories\n`);
