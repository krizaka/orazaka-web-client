"use client";

import { MotionObserver } from "@krizaka/ui";
import { useTranslation } from "@/core/context/LocaleContext";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { LandingSovereignty } from "@/features/landing/components/LandingSovereignty";
import { LandingPlatform } from "@/features/landing/components/LandingPlatform";
import { LandingCompare } from "@/features/landing/components/LandingCompare";
import { LandingHow } from "@/features/landing/components/LandingHow";
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
      <MotionObserver />
      <LandingNav />
      <main className="min-h-screen bg-surface-0 text-fg">
        <LandingHero />
        <LandingSovereignty />
        <LandingPlatform />
        <LandingCompare />
        <LandingHow />
        <LandingStudios />
        <LandingClosing eyebrow={c.eyebrow} title={c.title} lead={c.lead} primary={c.primary} secondary={c.secondary} />
      </main>
      <LandingFooter />
    </>
  );
}
