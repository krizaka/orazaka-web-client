"use client";

import { useTranslation } from "@/core/context/LocaleContext";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { GalleryFeatured } from "@/features/landing/components/GalleryFeatured";
import { LandingMobile } from "@/features/landing/components/LandingMobile";
import { LandingSovereignty } from "@/features/landing/components/LandingSovereignty";
import { LandingPlatform } from "@/features/landing/components/LandingPlatform";
import { LandingCompare } from "@/features/landing/components/LandingCompare";
import { LandingHow } from "@/features/landing/components/LandingHow";
import { LandingDemo } from "@/features/landing/components/LandingDemo";
import { LandingPacks } from "@/features/landing/components/LandingPacks";
import { LandingModels } from "@/features/landing/components/LandingModels";
import { LandingStudios } from "@/features/landing/components/LandingStudios";
import { LandingClosing } from "@/features/landing/components/LandingClosing";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import "@/features/landing/landing.css";

/**
 * The public home page — what a visitor without a session sees at `/`: the promise and the live sovereign chat,
 * why it matters (privacy, cost, control), the platform, the comparison, how it works, the Studios, and the two
 * ways in. Each section glides from one brand tint to the next (SectionBackdrop). Every word comes from
 * `t.landing` (en/fr).
 */
export function LandingPage() {
  const { t } = useTranslation();
  const c = t.landing.cta;

  return (
    <>
      <LandingNav />
      <main className="min-h-screen bg-surface-0 text-fg">
        <LandingHero />
        <GalleryFeatured />
        <LandingSovereignty />
        <LandingPlatform />
        <LandingCompare />
        <LandingHow />
        <LandingDemo />
        <LandingMobile />
        <LandingStudios />
        <LandingPacks />
        <LandingModels />
        <LandingClosing eyebrow={c.eyebrow} title={c.title} lead={c.lead} primary={c.primary} secondary={c.secondary} />
      </main>
      <LandingFooter />
    </>
  );
}
