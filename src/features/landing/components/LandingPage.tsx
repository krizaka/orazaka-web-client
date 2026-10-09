"use client";

import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { LandingValue } from "@/features/landing/components/LandingValue";
import { LandingHow } from "@/features/landing/components/LandingHow";
import { LandingClosing } from "@/features/landing/components/LandingClosing";

/**
 * The public home page — what a visitor without a session sees at `/`: the promise, the proof, how
 * it works, the Studios, and the two ways in. Every word comes from `t.landing` (en/fr).
 */
export function LandingPage() {
  return (
    <main className="min-h-screen bg-surface-0 text-fg">
      <LandingNav />
      <LandingHero />
      <LandingValue />
      <LandingHow />
      <LandingClosing />
    </main>
  );
}
