import type { Metadata } from "next";
import { FeaturePage } from "@/features/landing/components/FeaturePage";
import { features } from "@/core/context/translations.features";

export const metadata: Metadata = {
  title: `Orazaka — ${features.en.pages["absolute-privacy"].name}`,
  description: features.en.pages["absolute-privacy"].lead,
};

/** /features/absolute-privacy — one of the three feature pages linked from the home page. */
export default function Page() {
  return <FeaturePage id="absolute-privacy" />;
}
