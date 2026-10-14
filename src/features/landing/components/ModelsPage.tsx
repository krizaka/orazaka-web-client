"use client";

import { Suspense } from "react";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { ModelsCatalogue } from "@/features/landing/components/ModelsCatalogue";

/** `/models` — the models Orazaka supports, under the family's bar and footer. The filters live in the address, so the catalogue is read inside Suspense. */
export function ModelsPage() {
  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <Suspense fallback={null}>
          <ModelsCatalogue />
        </Suspense>
      </main>
      <LandingFooter />
    </>
  );
}
