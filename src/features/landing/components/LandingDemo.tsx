"use client";

import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { clipsFor } from "@/features/landing/utils/showcase";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/**
 * The recordings of the real application (signed in as the demo persona), played in place on demand: nothing
 * loads before the visitor presses play (`preload="none"`, a poster stands in). Media are on the CDN.
 */
export function LandingDemo() {
  const { t, locale } = useTranslation();
  const d = t.landing.demo;
  const clips = clipsFor(locale);

  return (
    <SectionBackdrop id="demo" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={d.eyebrow} title={d.title} lead={d.lead} />
        <ul className="grid gap-6 md:grid-cols-2">
          {clips.map((c) => (
            <li key={c.id} id={`demo-${c.id}`} data-reveal className="scroll-mt-20 flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-1/85 p-4 backdrop-blur-md">
              <figure className="space-y-3">
                <video controls playsInline preload="none" poster={c.poster} aria-label={c.label} className="aspect-[16/10] w-full rounded-xl border border-border-subtle bg-surface-2 object-cover">
                  <source src={c.webm} type="video/webm" />
                  <source src={c.mp4} type="video/mp4" />
                </video>
                <figcaption className="space-y-1">
                  <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{c.label}</span>
                  <span className="block text-sm leading-relaxed text-fg-secondary">{c.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </article>
    </SectionBackdrop>
  );
}
