"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
  AgentIcon,
  CreditsIcon,
  EyeOffIcon,
  ForwardIcon,
  KnowledgeIcon,
  LocalIcon,
  ServerIcon,
  ShieldIcon,
  type IconProps,
} from "@krizaka/icons";
import { ChatShowcase } from "@krizaka/orazaka-design-system";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { FEATURE_IDS, type FeatureId } from "@/features/landing/components/features";

/** The icons of each page's three points, in the order of the copy. */
const POINT_ICONS: Record<FeatureId, ComponentType<IconProps>[]> = {
  "absolute-privacy": [LocalIcon, EyeOffIcon, ServerIcon],
  "unified-engine": [ShieldIcon, KnowledgeIcon, CreditsIcon],
  "infinite-reach": [AgentIcon, ShieldIcon, ServerIcon],
};

/** What the feature means for a team: three points, each with its signature icon. */
export function FeaturePoints({ id }: Readonly<{ id: FeatureId }>) {
  const { t } = useTranslation();
  const page = t.features.pages[id];
  return (
    <SectionBackdrop direction="up" dome={false}>
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-24">
        <SectionHeading eyebrow={page.name} title={t.features.pointsTitle} />
        <ul className="grid gap-4 md:grid-cols-3">
          {page.points.map((point, i) => {
            const Icon = POINT_ICONS[id][i];
            return (
              <li key={point.title} data-reveal className="kz-spotlight kz-lift flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-1/80 p-6 backdrop-blur-sm">
                <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-accent/25 bg-accent-soft text-fg-accent">
                  <Icon size={22} nodeColor="var(--kz-accent)" />
                </span>
                <h3 className="relative text-lg font-semibold text-fg">{point.title}</h3>
                <p className="relative text-sm leading-relaxed text-fg-secondary">{point.body}</p>
              </li>
            );
          })}
        </ul>
      </article>
    </SectionBackdrop>
  );
}

/** The path of a request, step by step, beside the sovereign chat answering it. */
export function FeatureFlow({ id }: Readonly<{ id: FeatureId }>) {
  const { t, locale } = useTranslation();
  const page = t.features.pages[id];
  return (
    <SectionBackdrop dome={false} grid animated={false}>
      <article className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-5 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <section className="space-y-8">
          <SectionHeading eyebrow={page.kicker} title={page.flowTitle} />
          <ol className="relative space-y-6 border-l border-accent/30 pl-6">
            {page.flow.map((step, i) => (
              <li key={step.title} data-reveal className="relative">
                <span className="absolute -left-[37px] grid h-6 w-6 place-items-center rounded-full border border-accent/50 bg-surface-0 font-mono text-xs font-semibold text-fg-accent">
                  {i + 1}
                </span>
                <span className="block font-semibold text-fg">{step.title}</span>
                <span className="block text-sm leading-relaxed text-fg-secondary">{step.body}</span>
              </li>
            ))}
          </ol>
        </section>
        <figure className="flex flex-col items-center gap-4">
          <ChatShowcase key={locale} className="w-full" labels={page.chat.labels} question={page.chat.question} answer={page.chat.answer} pipeline={page.chat.pipeline} />
          <figcaption className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-fg-secondary">
            <ShieldIcon size={14} className="text-fg-accent" nodeColor="var(--kz-accent)" />
            {page.demoLabel}
          </figcaption>
        </figure>
      </article>
    </SectionBackdrop>
  );
}

/** The two other feature pages. */
export function FeatureOthers({ id }: Readonly<{ id: FeatureId }>) {
  const { t } = useTranslation();
  const others = FEATURE_IDS.filter((other) => other !== id);
  return (
    <nav aria-label={t.features.others} className="mx-auto max-w-6xl space-y-6 px-4 py-16 sm:px-5">
      <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">{t.features.others}</h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {others.map((other) => {
          const page = t.features.pages[other];
          return (
            <li key={other}>
              <Link
                href={`/features/${other}`}
                className="kz-spotlight kz-lift group flex h-full flex-col gap-2 rounded-2xl border border-border-subtle bg-surface-1 p-6 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="relative font-mono text-xs uppercase tracking-[0.14em] text-fg-secondary">{page.name}</span>
                <span className="relative text-xl font-semibold text-fg">
                  {page.titleLead} {page.titleAccent}
                </span>
                <ForwardIcon size={18} className="relative mt-auto text-fg-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
