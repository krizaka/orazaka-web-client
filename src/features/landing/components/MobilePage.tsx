"use client";

import Image from "next/image";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useTranslation } from "@/core/context/LocaleContext";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { SectionHeading } from "@/features/landing/components/SectionHeading";
import { PhoneClip } from "@/features/landing/components/PhoneClip";
import { CLIPS, SHOTS, shotUrl } from "@/features/landing/utils/mobile";
import "@/features/landing/landing.css";

/** /mobile — every recording and screenshot of the iOS and Android app, with what each one shows and where it was recorded. */
export function MobilePage() {
  const { t } = useTranslation();
  const m = t.mobile;
  return (
    <>
      <LandingNav onHome={false} />
      <main className="min-h-screen bg-surface-0 text-fg">
        <SectionBackdrop grid className="border-b border-border-subtle">
          <article className="mx-auto max-w-6xl space-y-6 px-4 pb-14 pt-14 sm:px-5 lg:pt-20">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg-accent">{m.eyebrow}</p>
            <h1 className="max-w-3xl font-display text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">{m.title}</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-pretty text-fg-secondary">{m.lead}</p>
            <p className="font-mono text-xs text-fg-muted">{m.recordedOn}</p>
          </article>
        </SectionBackdrop>

        <section aria-label={m.clipsTitle} className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-5">
          <SectionHeading eyebrow={m.platforms.ios} title={m.clipsTitle} />
          <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {CLIPS.map((id) => (
              <li key={id}>
                <PhoneClip id={id} label={m.clips[id].label} caption={m.clips[id].caption} />
              </li>
            ))}
          </ul>
        </section>

        {(["ios", "android"] as const).map((platform) => (
          <section key={platform} aria-label={m.platforms[platform]} className="mx-auto max-w-6xl space-y-8 border-t border-border-subtle px-4 py-16 sm:px-5">
            <SectionHeading eyebrow={m.platforms[platform]} title={m.shotsTitle} />
            <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {SHOTS.filter((s) => s.platform === platform).map((s) => (
                <li key={s.id}>
                  <figure className="flex flex-col gap-2">
                    <Image
                      src={shotUrl(s.id)}
                      alt={m.shots[s.id]}
                      width={480}
                      height={1043}
                      sizes="(max-width: 640px) 45vw, 20vw"
                      unoptimized
                      className="h-auto w-full rounded-2xl border border-border-default bg-surface-2"
                    />
                    <figcaption className="text-xs leading-relaxed text-fg-secondary">{m.shots[s.id]}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <LandingFooter />
    </>
  );
}
