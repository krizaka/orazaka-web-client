/**
 * @file docs.ts
 * @description Reads the documentation published on this site: `content/docs/index.json` and its markdown, both
 * written by `scripts/sync-docs.mjs` from Orazaka's generated docs (never hand-edited).
 */
import fs from "node:fs";
import path from "node:path";

export interface DocEntry {
  slug: string;
  title: string;
  category: string;
  order: number;
  audience: string;
  intro: string;
  file: string;
}

const DIR = path.join(process.cwd(), "content", "docs");

export const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting started",
  architecture: "Architecture",
  "core-features": "Core features",
  api: "API & contracts",
  operations: "Operations",
  guidelines: "Guidelines",
};

export function listDocs(): DocEntry[] {
  return JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf8")) as DocEntry[];
}

export function readDoc(slug: string): { entry: DocEntry; body: string } | null {
  const entry = listDocs().find((d) => d.slug === slug);
  if (!entry) return null;
  return { entry, body: fs.readFileSync(path.join(DIR, entry.file), "utf8") };
}

/** Groups the published docs by category, in reading order. */
export function groupDocs(docs: DocEntry[]): { category: string; label: string; docs: DocEntry[] }[] {
  const order = Object.keys(CATEGORY_LABELS);
  const groups = new Map<string, DocEntry[]>();
  for (const d of docs) groups.set(d.category, [...(groups.get(d.category) ?? []), d]);
  return [...groups.entries()]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([category, list]) => ({ category, label: CATEGORY_LABELS[category] ?? category, docs: [...list].sort((a, b) => a.order - b.order) }));
}

/**
 * Where a link of a doc leads: a published doc (`/docs/<slug>`), an external or in-page link as is, anything else
 * (a repository path that is not published here) null — rendered as plain text, never a dead link.
 */
export function resolveDocLink(href: string, published: ReadonlySet<string>): string | null {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const m = /^(?:\.{1,2}\/)*(?:docs\/)?\/?([A-Za-z0-9_]+)\.md(#.*)?$/.exec(href) ?? /^\/docs\/([a-z0-9_]+)(#.*)?$/.exec(href);
  if (!m) return null;
  const slug = m[1].toLowerCase();
  return published.has(slug) ? `/docs/${slug}${m[2] ?? ""}` : null;
}
