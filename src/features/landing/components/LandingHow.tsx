"use client";

import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/LandingValue";

/** Icons of the studio examples, in the order of the copy. */
const STUDIO_ICONS: IconName[] = ["fileJson", "video", "search", "image"];

/**
 * How it works (three commands, from install to first answer) and the Studios — the ready-made
 * workflows that turn the engine into business results.
 */
export function LandingHow() {
  const { t } = useTranslation();
  const how = t.landing.how;
  const st = t.landing.studios;

  return (
    <>
      <section id="how" className="scroll-mt-20 border-y border-border-subtle bg-surface-1">
        <article className="mx-auto max-w-6xl space-y-10 px-5 py-24">
          <SectionHeading eyebrow={how.eyebrow} title={how.title} />
          <ol className="grid gap-4 md:grid-cols-3">
            {how.steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-0 p-6">
                <span className="font-mono text-xs font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-semibold text-fg">{step.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-fg-secondary">{step.body}</p>
                <code className="block overflow-x-auto rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 font-mono text-xs text-fg">
                  <span className="select-none text-fg-muted">$ </span>
                  {step.command}
                </code>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section id="studios" className="mx-auto max-w-6xl scroll-mt-20 space-y-10 px-5 py-24">
        <SectionHeading eyebrow={st.eyebrow} title={st.title} lead={st.lead} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {st.items.map((item, i) => (
            <li key={item.title} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-1 p-5">
              <Icon name={STUDIO_ICONS[i]} size={18} className="text-accent" />
              <h3 className="font-semibold text-fg">{item.title}</h3>
              <p className="text-sm leading-relaxed text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
