import type { RunArtefact } from "@krizaka/orazaka-shared";

/** An artefact as the Studio service serves it: the label in each language the pack wrote (`labels`), besides the base one. */
type LocalisedArtefact = RunArtefact & { labels?: Record<string, string> };

/** The artefact's label in the page's language: the pack's words for it, else English, else the blueprint's own label. */
export function artefactLabel(artefact: LocalisedArtefact, locale: string): string {
  const labels = artefact.labels ?? {};
  return labels[locale]?.trim() || labels.en?.trim() || artefact.label;
}
