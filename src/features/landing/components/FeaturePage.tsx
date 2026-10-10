"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { MotionObserver } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { IsoScene } from "@/features/landing/iso/IsoScene";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingClosing } from "@/features/landing/components/LandingClosing";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { FeatureFlow, FeatureOthers, FeaturePoints } from "@/features/landing/components/FeatureSections";
import { FEATURE_SCENES, type FeatureId } from "@/features/landing/components/features";
import "@/features/landing/landing.css";

/**
 * A feature page (/features/<id>), in the language of the home page: the promise beside its isometric
 * illustration, what it means for a team, the path of a request with the sovereign chat answering, the other
 * features and the call to action. Every word comes from `t.features` (en/fr).
 */
export function FeaturePage({ id }: Readonly<{ id: FeatureId }>) {
  const { t } = useTranslation();
  const f = t.features;
  const page = f.pages[id];

  return (
    <>
      <MotionObserver />
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <SectionBackdrop grid className="border-b border-border-subtle">
          <article className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:pb-24 lg:pt-20">
            <header className="space-y-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">
                {f.eyebrow} · {page.kicker}
              </p>
              <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-tight text-balance text-fg sm:text-6xl">
                {page.titleLead} <span className="text-fg-accent">{page.titleAccent}</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-pretty text-fg-secondary">{page.lead}</p>
              <nav className="flex flex-wrap gap-3" aria-label={f.ctaPrimary}>
                <Button asChild variant="primary" size="lg" shape="pill" className="kz-sheen">
                  <Link href="/register">
                    {f.ctaPrimary}
                    <ForwardIcon size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" shape="pill" variant="secondary">
                  <Link href="/">{f.ctaSecondary}</Link>
                </Button>
              </nav>
            </header>
            <figure data-reveal className="mx-auto w-full max-w-xl">
              <IsoScene scene={FEATURE_SCENES[id]} />
            </figure>
          </article>
        </SectionBackdrop>

        <FeaturePoints id={id} />
        <FeatureFlow id={id} />
        <FeatureOthers id={id} />
        <LandingClosing
          eyebrow={page.name}
          title={f.ctaTitle}
          lead={f.ctaLead}
          primary={f.ctaPrimary}
          secondary={f.ctaSecondary}
          secondaryHref="/"
        />
      </main>
      <LandingFooter />
    </>
  );
}
