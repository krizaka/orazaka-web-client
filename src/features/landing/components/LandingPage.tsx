"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { LandingPage as LandingTemplate } from "@krizaka/ui/landing-page";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { useTranslation } from "@/core/context/LocaleContext";
import { DemoHashRedirect } from "@/features/landing/components/DemoHashRedirect";
import { FeatureShot } from "@/features/landing/components/FeatureShot";
import { HeroTake } from "@/features/landing/components/HeroTake";
import { LandingCompare } from "@/features/landing/components/LandingCompare";
import { LandingFamily } from "@/features/landing/components/LandingFamily";
import { LandingFaq } from "@/features/landing/components/LandingFaq";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingPlatforms } from "@/features/landing/components/LandingPlatforms";
import { LandingRecords } from "@/features/landing/components/LandingRecords";
import { useEntries } from "@/features/landing/components/useEntries";
import type { MeasuredRuns } from "@/features/landing/utils/measured-runs";
import "@/features/landing/landing.css";

const NO_RUNS: MeasuredRuns = { ok: 0, all: 0, models: 0, day: null };

/**
 * The public home page, on the product landing template of @krizaka/ui (the one of Yomizaka's redesign): one statement, one
 * line, one action and a quiet second one, beside the real chat answering — a recording of the app, not a mock-up. Then the
 * figures (counted from the published measured runs), three things it does on real screens, the proof as run records,
 * where it runs, the products that run on it, the honest comparison, the questions, the closing call. Every word comes
 * from `t.landing` (en/fr); the details live on their pages (/models, /gallery, /desktop, /docs).
 */
export function LandingPage({ measured = NO_RUNS }: Readonly<{ measured?: MeasuredRuns }>) {
  const { t, locale } = useTranslation();
  const h = t.landing.hero;
  const f = t.landing.features;
  const entries = useEntries();
  const primary = entries.primary(t.landing.cta.primary);
  const closing = entries.primary(t.landing.cta.primary);

  return (
    <>
      <LandingNav />
      <DemoHashRedirect />
      <main id="main" className="bg-surface-0 text-fg">
        <LandingTemplate
          className="landing-home"
          title={h.title}
          lead={h.lead}
          visualLabel={h.visualLabel}
          visual={<HeroTake />}
          actions={
            <>
              <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
                <Link href={primary.href}>
                  {primary.label}
                  <ForwardIcon size={16} strokeWidth={2.25} />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
                <Link href="/gallery">{h.secondary}</Link>
              </Button>
            </>
          }
          proofs={[
            { value: <NumberTicker value={measured.ok} locale={locale} />, label: t.landing.figures.runs },
            { value: <NumberTicker value={measured.models} locale={locale} />, label: t.landing.figures.models },
            { value: <NumberTicker value={0} locale={locale} />, label: t.landing.figures.telemetry },
          ]}
          featuresHeading={{ eyebrow: f.eyebrow, title: f.title, lead: f.lead }}
          features={[
            { id: "studios", size: "lg", title: f.items.studios.title, text: f.items.studios.text, visual: <FeatureShot id="studios" alt={f.items.studios.alt} /> },
            { id: "records", size: "sm", title: f.items.records.title, text: f.items.records.text, visual: <FeatureShot id="records" alt={f.items.records.alt} /> },
            { id: "home", size: "sm", title: f.items.home.title, text: f.items.home.text, visual: <FeatureShot id="home" alt={f.items.home.alt} /> },
          ]}
          closing={{
            title: t.landing.cta.title,
            body: t.landing.cta.body,
            actions: (
              <>
                <Button asChild variant="primary" size="lg">
                  <Link href={closing.href}>{closing.label}</Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <a href="https://www.krizaka.com/contact?topic=orazaka">{t.landing.nav.talk}</a>
                </Button>
              </>
            ),
          }}
        >
          <LandingRecords measured={measured} />
          <LandingPlatforms />
          <LandingFamily />
          <LandingCompare />
          <LandingFaq />
        </LandingTemplate>
      </main>
      <LandingFooter />
    </>
  );
}
