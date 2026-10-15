/**
 * @file translations.models.types.ts
 * @description The shape of the /models dictionary (translations.models.ts), apart so the dictionary types do not import it back.
 */

export interface ModelsDictionary {
  nav: string;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string };
  sovereign: { title: string; local: string; provider: string };
  filters: { label: string; capability: string; where: string; all: string };
  capabilities: Record<"chat" | "reasoning" | "vision" | "code" | "embeddings" | "image" | "video" | "speech-to-text" | "text-to-speech", string>;
  where: { local: string; provider: string; localLong: string; providerLong: string };
  status: { default: string; available: string; planned: string };
  columns: { model: string; vendor: string; does: string; runs: string; licence: string; context: string; status: string; verified: string };
  licence: { open: string; proprietary: string; commercial: string; conditions: string; nonCommercial: string };
  context: { tokens: string; none: string };
  verified: { never: string };
  count: string;
  countOne: string;
  empty: string;
  table: { caption: string; filters: string; clear: string; sortBy: string };
  docs: { title: string; lead: string; catalogue: string; catalogueLead: string; routing: string; routingLead: string; cta: string };
  home: { eyebrow: string; title: string; lead: string; more: string; providers: string; cta: string };
}
