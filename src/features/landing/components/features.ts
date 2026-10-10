import type { IsoSceneName } from "@/features/landing/iso/IsoScene";
import type { FeaturesDictionary } from "@/core/context/translations.landing.types";

/** The feature pages, in the order of the home page pillars. Their words are `t.features.pages[id]`. */
export const FEATURE_IDS = ["absolute-privacy", "unified-engine", "infinite-reach"] as const;
export type FeatureId = keyof FeaturesDictionary["pages"] & (typeof FEATURE_IDS)[number];

/** The illustration of each feature page. */
export const FEATURE_SCENES: Record<FeatureId, IsoSceneName> = {
  "absolute-privacy": "privacy",
  "unified-engine": "engine",
  "infinite-reach": "reach",
};
