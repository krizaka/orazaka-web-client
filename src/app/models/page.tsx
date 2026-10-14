import type { Metadata } from "next";
import { ModelsPage } from "@/features/landing/components/ModelsPage";
import { translations } from "@/core/context/translations";

const m = translations.en.models.meta;

export const metadata: Metadata = {
  title: m.title,
  description: m.description,
  alternates: { canonical: "/models" },
};

/** `/models` — the models Orazaka supports, read from the registry its routing uses (see scripts/sync-models.mjs). */
export default function Page() {
  return <ModelsPage />;
}
