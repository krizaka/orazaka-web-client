"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { AiIcon, CheckIcon, EyeOffIcon, ForwardIcon, LocalIcon, ShieldIcon, type IconProps } from "@krizaka/icons";
import { ChatShowcase } from "@krizaka/orazaka-design-system";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { ProductCapture } from "@/features/landing/components/ProductCapture";

/** Icons of the four proofs, in the order of the copy. */
const PROOF_ICONS: ComponentType<IconProps>[] = [LocalIcon, AiIcon, ShieldIcon, EyeOffIcon];

/**
 * The promise in one screen: who it is for, what it does, why it is safe — and the sovereign chat answering on
 * the visitor's side of the fold, in front of the real workspace (blurred: depth of field). Below, the four facts
 * that are true of every install.
 */
export function LandingHero() {
  const { t, locale } = useTranslation();
  const h = t.landing.hero;
  const chat = t.landing.chat;

  return (
    <SectionBackdrop grid media={<ProductCapture name="dashboard" eager className="landing-hero-capture" />} className="landing-hero border-b border-border-subtle">
      <article className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 sm:px-5 lg:grid-cols-[1.08fr_1fr] lg:gap-16 lg:pb-20 lg:pt-24">
        <header className="space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-1/70 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-secondary backdrop-blur">
            <LocalIcon size={14} className="text-fg-accent" nodeColor="var(--kz-accent)" />
            {h.kicker}
          </p>
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-balance text-fg sm:text-6xl lg:text-[4.25rem]">
            {h.titleLead} <span className="text-fg-accent">{h.titleAccent}</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-fg-secondary">{h.lead}</p>
          <nav className="flex flex-wrap gap-3" aria-label={h.primaryCta}>
            <Button asChild variant="primary" size="lg" shape="pill" className="kz-sheen">
              <Link href="/register">
                {h.primaryCta}
                <ForwardIcon size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" shape="pill" variant="secondary">
              <Link href="/login">{h.secondaryCta}</Link>
            </Button>
          </nav>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-secondary">
            {h.trust.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <CheckIcon size={15} className="text-success" />
                {item}
              </li>
            ))}
          </ul>
        </header>

        <figure className="flex flex-col items-center gap-4">
          <ChatShowcase
            key={locale}
            className="w-full"
            labels={chat.labels}
            question={chat.question}
            answer={chat.answer}
            pipeline={chat.pipeline}
          />
          <figcaption className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-fg-secondary">
            <ShieldIcon size={14} className="text-fg-accent" nodeColor="var(--kz-accent)" />
            {h.demoLabel}
          </figcaption>
        </figure>
      </article>

      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 pb-14 sm:px-5 lg:grid-cols-4 lg:pb-20">
        {t.landing.proof.map((p, i) => {
          const Icon = PROOF_ICONS[i];
          return (
            <div key={p.label} data-reveal className="flex flex-col gap-2 border-t border-border-default py-6 pr-5 sm:pr-8">
              <dt className="flex items-center gap-2.5 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                <Icon size={22} className="text-fg-accent" nodeColor="var(--kz-accent)" />
                {p.value}
              </dt>
              <dd className="text-sm leading-snug text-fg-secondary">{p.label}</dd>
            </div>
          );
        })}
      </dl>
    </SectionBackdrop>
  );
}
