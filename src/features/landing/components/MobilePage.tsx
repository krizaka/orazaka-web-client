"use client";

import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { MobileStep } from "@/features/landing/components/MobileStep";
import { STEPS } from "@/features/landing/utils/mobile";
import "@/features/landing/landing.css";

/** /mobile — the four steps of the Orazaka app, each with the job it does for the person using it. */
export function MobilePage() {
  const { t } = useTranslation();
  const m = t.mobile;
  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <SectionBackdrop grid className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-6 px-4 pb-14 pt-14 sm:px-5 lg:pt-20">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">{m.eyebrow}</p>
            <h1 className="max-w-3xl font-display text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">{m.title}</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-pretty text-fg-secondary">{m.lead}</p>
            <p className="font-mono text-xs text-fg-muted">{m.recordedOn}</p>
          </article>
        </SectionBackdrop>

        <section aria-label={m.stepsTitle} className="mx-auto max-w-6xl px-4 py-16 sm:px-5">
          <ol className="space-y-20">
            {STEPS.map((id, i) => (
              <MobileStep key={id} id={id} index={i} reverse={i % 2 === 1} />
            ))}
          </ol>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
