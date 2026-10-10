"use client";

import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/**
 * How it works: the three steps, and the three commands in a terminal — what a team really types, from install
 * to the first answer.
 */
export function LandingHow() {
  const { t } = useTranslation();
  const how = t.landing.how;

  return (
    <SectionBackdrop id="how" dome={false} animated={false} className="scroll-mt-16">
      <article className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-5 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <section className="space-y-10">
          <SectionHeading eyebrow={how.eyebrow} title={how.title} lead={how.lead} />
          <ol className="space-y-6">
            {how.steps.map((step, i) => (
              <li key={step.title} data-reveal className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent-soft font-mono text-sm font-semibold text-fg-accent">
                  {i + 1}
                </span>
                <span className="space-y-1">
                  <span className="block text-lg font-semibold text-fg">{step.title}</span>
                  <span className="block text-sm leading-relaxed text-fg-secondary">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <figure data-reveal className="theme-dark overflow-hidden rounded-2xl border border-border-default bg-surface-0 shadow-lg">
          <figcaption className="flex items-center gap-1.5 border-b border-border-subtle bg-surface-1 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-fg-muted/50" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-fg-muted/50" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" aria-hidden="true" />
            <span className="ml-3 font-mono text-xs text-fg-secondary">{how.terminal}</span>
          </figcaption>
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-8 text-fg sm:p-6">
            {how.steps.map((step, i) => (
              <code key={step.command} className="block">
                <span className="select-none text-fg-accent">$ </span>
                {step.command}
                {i === how.steps.length - 1 && <span aria-hidden="true" className="landing-caret ml-1 inline-block h-4 w-2 translate-y-0.5 bg-accent" />}
              </code>
            ))}
          </pre>
        </figure>
      </article>
    </SectionBackdrop>
  );
}
