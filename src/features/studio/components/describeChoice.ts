import type { Choice } from "@/features/studio/hooks/useInputSchema";

/** The words a picker needs, passed translated (the `studio.form` messages). */
export interface ChoiceWords {
  local: string;
  cloud: string;
  fast: string;
  balanced: string;
  slow: string;
  about: string;
  perRun: string;
  free: string;
}

/** Formats US cents as a price a person reads: 8 → "$0.08". */
export function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * The line under a choice: where it runs, how fast, about how long, what it costs — "Cloud · Fast · about 8 s · $0.08 per
 * run". A model that is off says why instead. Facts the catalogue does not have are left out rather than guessed.
 */
export function describeChoice(choice: Choice, words: ChoiceWords): string {
  const meta = choice.meta;
  if (!meta) {
    return "";
  }
  if (!meta.available && meta.unavailableReason) {
    return meta.unavailableReason;
  }
  const parts: string[] = [];
  if (meta.runsOn) parts.push(words[meta.runsOn]);
  if (meta.speed) parts.push(words[meta.speed]);
  if (meta.typicalSeconds !== null) parts.push(words.about.replace("{n}", String(meta.typicalSeconds)));
  if (meta.priceCents !== null) parts.push(words.perRun.replace("{price}", dollars(meta.priceCents)));
  else if (meta.runsOn === "local") parts.push(words.free);
  return parts.join(" · ");
}
