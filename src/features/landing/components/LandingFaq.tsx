"use client";

import { Section } from "@krizaka/ui/page";
import { useTranslation } from "@/core/context/LocaleContext";

/** FAQPage structured data for the visible questions — the markup describes exactly what is on the page. */
export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) };
}

/** Native disclosure elements (keyboard operable, no script) with the matching FAQPage JSON-LD. */
export function LandingFaq() {
  const { t } = useTranslation();
  const f = t.landing.faq;
  return (
    <Section id="faq" eyebrow={f.eyebrow} title={f.title} headingSize="sm" reveal divider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(f.items)).replace(/</g, "\\u003c") }} />
      <div className="mx-auto flex max-w-3xl flex-col gap-2" data-testid="faq">
        {f.items.map((item) => (
          <details key={item.q} className="group rounded-xl border border-border-default bg-surface-1 px-4 open:bg-surface-2">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-base font-semibold text-fg [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden className="shrink-0 text-fg-accent transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="m-0 max-w-[70ch] pb-4 text-sm leading-relaxed text-fg-secondary">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
