/**
 * @file showcase.ts
 * @description The demo recordings and the packs of the home page. Data is `showcase.generated.json`
 * (scripts/sync-showcase.mjs); the media live on Bunny — a URL is `<cdn>/<root>/<path>.<hash>.<ext>` and never
 * changes content. `NEXT_PUBLIC_MEDIA_CDN_URL` switches the host (read at build).
 */
import data from "./showcase.generated.json";
import type { Locale } from "@/core/context/translations.types";

export const MEDIA_CDN_URL = (process.env.NEXT_PUBLIC_MEDIA_CDN_URL || "https://krizaka-assets.b-cdn.net").replace(/\/+$/, "");

type Ext = "webm" | "mp4" | "jpg";

export interface Clip {
  id: string;
  label: string;
  caption: string;
  webm: string;
  mp4: string;
  poster: string;
}

export interface Pack {
  key: string;
  label: string;
  tagline: string;
  studios: number;
  /** The heading of this pack in `/docs/packs` (the English label, slugged) — the card leads to its own section. */
  anchor: string;
}

const url = (id: string, ext: Ext, hash: string) => `${MEDIA_CDN_URL}/${data.cdnRoot}/products/orazaka/tour/${id}.${hash}.${ext}`;

export function clipsFor(locale: Locale): Clip[] {
  return data.clips.map((c) => ({
    id: c.id,
    label: c.text[locale].label,
    caption: c.text[locale].caption,
    webm: url(c.id, "webm", c.hash.webm),
    mp4: url(c.id, "mp4", c.hash.mp4),
    poster: url(c.id, "jpg", c.hash.jpg),
  }));
}

const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function packsFor(locale: Locale): Pack[] {
  return data.packs.map((p) => ({
    key: p.key,
    label: p.text[locale].label,
    tagline: p.text[locale].tagline,
    studios: p.studios,
    anchor: slug(p.text.en.label),
  }));
}
