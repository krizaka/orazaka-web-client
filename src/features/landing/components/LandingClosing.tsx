"use client";

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

/** The last call to action of a public page: the Orazaka mark under its light dome, a promise and the two ways in. */
export function LandingClosing({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  secondaryHref = "/login",
}: Readonly<{ eyebrow: string; title: string; lead: string; primary: string; secondary: string; secondaryHref?: string }>) {
  return (
    <SectionBackdrop grid className="border-t border-border-subtle">
      <article data-reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-5 lg:py-32">
        <OrazakaLogo size={104} />
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-fg sm:text-5xl">{title}</h2>
        <p className="max-w-xl text-base leading-relaxed text-pretty text-fg-secondary sm:text-lg">{lead}</p>
        <nav className="flex flex-wrap justify-center gap-3" aria-label={primary}>
          <Button asChild variant="primary" size="lg" shape="pill" className="kz-sheen">
            <Link href="/register">
              {primary}
              <ForwardIcon size={18} />
            </Link>
          </Button>
          <Button asChild size="lg" shape="pill" variant="ghost">
            <Link href={secondaryHref}>{secondary}</Link>
          </Button>
        </nav>
      </article>
    </SectionBackdrop>
  );
}
