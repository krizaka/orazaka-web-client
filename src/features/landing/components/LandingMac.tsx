"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { DesktopCapture } from "@/features/desktop/components/DesktopCapture";

/** "On your Mac": a compact band with the real control panel of Orazaka Desktop and the way to /desktop. */
export function LandingMac() {
  const { t } = useTranslation();
  const b = t.desktop.band;
  return (
    <SectionBackdrop id="mac" className="border-t border-border-subtle">
      <article className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-5 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:py-20">
        <div className="space-y-6">
          <SectionHeading eyebrow={b.eyebrow} title={b.title} lead={b.lead} />
          <Button asChild variant="secondary" size="lg" shape="pill">
            <Link href="/desktop">
              {b.cta}
              <ForwardIcon size={18} />
            </Link>
          </Button>
        </div>
        <figure data-reveal className="overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-lg">
          <DesktopCapture alt={b.alt} sizes="(min-width: 1152px) 640px, 100vw" className="h-auto w-full" />
        </figure>
      </article>
    </SectionBackdrop>
  );
}
