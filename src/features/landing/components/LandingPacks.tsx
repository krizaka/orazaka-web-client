"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { packsFor } from "@/features/landing/utils/showcase";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** The packs Orazaka ships, read from the generated architecture data (never a hand-written list). */
export function LandingPacks() {
  const { t, locale } = useTranslation();
  const p = t.landing.packs;
  const packs = packsFor(locale);

  return (
    <SectionBackdrop id="packs" className="border-t border-border-subtle">
      <article className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <li key={pack.key} data-reveal className="flex flex-col gap-2 rounded-2xl border border-border-default bg-surface-1/85 p-6 backdrop-blur-md">
              <h3 className="font-semibold text-fg">{pack.label}</h3>
              <p className="text-sm leading-relaxed text-fg-secondary">{pack.tagline}</p>
              <p className="mt-auto pt-3 font-mono text-xs uppercase tracking-[0.14em] text-fg-accent">{p.studios.replace("{count}", String(pack.studios))}</p>
            </li>
          ))}
        </ul>
        <Button asChild variant="secondary" size="lg" shape="pill">
          <Link href="/docs/packs">
            {p.more}
            <ForwardIcon size={18} />
          </Link>
        </Button>
      </article>
    </SectionBackdrop>
  );
}
