"use client";

import { useTranslation } from "@/core/context/LocaleContext";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { GalleryFeatured } from "@/features/landing/components/GalleryFeatured";
import { LandingOutcomes } from "@/features/landing/components/LandingOutcomes";
import { LandingRuns } from "@/features/landing/components/LandingRuns";
import { LandingCompare } from "@/features/landing/components/LandingCompare";
import { LandingTrust } from "@/features/landing/components/LandingTrust";
import { DemoHashRedirect } from "@/features/landing/components/DemoHashRedirect";
import { LandingClosing } from "@/features/landing/components/LandingClosing";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import "@/features/landing/landing.css";

/**
 * The public home page — one story, six sections, each answering one question in order (docs/ux/information-
 * architecture.md of the workspace): what is it (the hero and a live answer) · what can I do with it (the
 * prompt → image → video showcase, four Studio outcomes, the packs) · where does it run (Web · Mobile · Mac, the real
 * app) · why own it (the comparison) · can I trust it (code, measured runs, docs) · how do I start. Every word comes
 * from `t.landing` (en/fr); the details live on their pages (/models, /gallery, /desktop, /docs).
 */
export function LandingPage() {
  const { t } = useTranslation();
  const c = t.landing.cta;
  const w = t.landing.what;

  return (
    <>
      <LandingNav />
      <DemoHashRedirect />
      <main className="min-h-screen bg-surface-0 text-fg">
        <LandingHero />
        <GalleryFeatured heading={{ eyebrow: w.eyebrow, title: w.title, lead: w.lead }}>
          <LandingOutcomes />
        </GalleryFeatured>
        <LandingRuns />
        <LandingCompare />
        <LandingTrust />
        <LandingClosing eyebrow={c.eyebrow} title={c.title} lead={c.lead} primary={c.primary} secondary={c.secondary} />
      </main>
      <LandingFooter />
    </>
  );
}
