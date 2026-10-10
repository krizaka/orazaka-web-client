"use client";

import { CheckIcon, GlobeIcon, LocalIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/**
 * Cost & control: the same questions asked of a cloud assistant and of Orazaka. A table on a wide screen; on a
 * phone each question is a card with both answers, labelled, so nothing depends on a column header.
 */
export function LandingCompare() {
  const { t } = useTranslation();
  const c = t.landing.compare;

  return (
    <SectionBackdrop direction="up" dome={false} animated={false}>
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

        <table data-reveal className="w-full border-separate border-spacing-0 text-left">
          <caption className="sr-only">{c.title}</caption>
          <thead className="hidden lg:table-header-group">
            <tr>
              <th scope="col" className="w-[28%] pb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-secondary">{c.topic}</th>
              <th scope="col" className="pb-4 pr-6">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-fg-secondary">
                  <GlobeIcon size={18} />
                  {c.cloud}
                </span>
              </th>
              <th scope="col" className="rounded-t-2xl border border-b-0 border-accent/30 bg-accent-soft px-6 pb-4 pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-fg">
                  <LocalIcon size={18} className="text-fg-accent" nodeColor="var(--kz-accent)" />
                  {c.orazaka}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((row, i) => (
              <tr key={row.topic} className="mb-4 block rounded-2xl border border-border-subtle bg-surface-1/80 p-5 lg:mb-0 lg:table-row lg:border-0 lg:bg-transparent lg:p-0">
                <th scope="row" className="block pb-3 text-base font-semibold text-fg lg:table-cell lg:border-t lg:border-border-subtle lg:py-6 lg:pr-6 lg:align-top">
                  {row.topic}
                </th>
                <td className="block pb-3 text-sm leading-relaxed text-fg-secondary lg:table-cell lg:border-t lg:border-border-subtle lg:py-6 lg:pr-6 lg:align-top">
                  <span className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-fg-secondary lg:hidden">{c.cloud}</span>
                  {row.cloud}
                </td>
                <td
                  className={
                    i === c.rows.length - 1
                      ? "block rounded-xl bg-accent-soft p-3 text-sm leading-relaxed text-fg lg:table-cell lg:rounded-none lg:rounded-b-2xl lg:border lg:border-t-0 lg:border-accent/30 lg:px-6 lg:py-6 lg:align-top"
                      : "block rounded-xl bg-accent-soft p-3 text-sm leading-relaxed text-fg lg:table-cell lg:rounded-none lg:border-x lg:border-accent/30 lg:px-6 lg:py-6 lg:align-top"
                  }
                >
                  <span className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-fg-accent lg:hidden">{c.orazaka}</span>
                  <span className="flex gap-2">
                    <CheckIcon size={16} className="mt-0.5 shrink-0 text-fg-accent" />
                    {row.orazaka}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </SectionBackdrop>
  );
}
