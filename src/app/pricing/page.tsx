import type { Metadata } from "next";
import { PricingEditions } from "@/features/landing/components/PricingEditions";
import { translations } from "@/core/context/translations";

const m = translations.en.pricing.meta;

export const metadata: Metadata = {
  title: m.title,
  description: m.description,
  alternates: { canonical: "/pricing" },
};

/** `/pricing` — the editions of Orazaka (krizaka/orazaka#447). No price is typed: the price catalogue holds none for Orazaka, so none is shown. */
export default function Page() {
  return <PricingEditions />;
}
