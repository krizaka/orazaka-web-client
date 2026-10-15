"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { PhoneClip } from "@/core/mobile/PhoneClip";
import { STEPS } from "@/core/mobile/mobile";

/**
 * The Orazaka app on a phone: its four steps in phone frames (a swipeable row on a phone, four columns on a
 * desktop), then the way to the explained journey at /docs/mobile. Played on demand, never by themselves.
 */
export function LandingMobile() {
  const { t } = useTranslation();
  const m = t.mobile;
  return (
    <SectionBackdrop id="mobile" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={m.eyebrow} title={m.title} lead={m.lead} />
        <ul tabIndex={0} aria-label={m.stepsTitle} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          {STEPS.map((id) => (
            <li key={id} data-reveal className="w-[70vw] max-w-[15rem] shrink-0 snap-center sm:w-[15rem] lg:w-auto lg:max-w-none">
              <PhoneClip id={id} label={m.steps[id].goal} alt={m.steps[id].alt} caption={m.steps[id].short} />
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-fg-secondary">
          <Button asChild variant="secondary" size="md" shape="pill">
            <Link href="/docs/mobile">
              {m.all}
              <ForwardIcon size={16} />
            </Link>
          </Button>
          <span>{m.recordedOn}</span>
        </p>
      </article>
    </SectionBackdrop>
  );
}
