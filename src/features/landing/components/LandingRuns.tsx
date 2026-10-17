"use client";

import * as React from "react";
import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { DeviceFrame, StepShowcase, type ShowcaseStep, type StepShowcaseLabels } from "@krizaka/ui/step-showcase";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@krizaka/ui/tabs";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { mediaUrl } from "@/core/media/cdn";
import { STEPS as MOBILE_STEPS, clipUrls, type Appearance } from "@/core/mobile/mobile";
import { DesktopCapture } from "@/features/landing/components/DesktopCapture";
import { SectionHeading } from "@/features/landing/components/SectionHeading";

/** The web steps, recorded by scripts/record-web-steps.mjs on dev.orazaka.com (products/orazaka/web on the CDN). */
const WEB_STEPS = ["workspace", "studio", "results"] as const;
const DEVICES = ["web", "mobile", "mac"] as const;

/** The page's look, so the recordings match it: `html.light` is the light theme (ThemeProvider). */
function subscribe(notify: () => void) {
  const mo = new MutationObserver(notify);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}
function useAppearance(): Appearance {
  return React.useSyncExternalStore(subscribe, () => (document.documentElement.classList.contains("light") ? "light" : "dark"), () => "dark");
}

function webStep(id: (typeof WEB_STEPS)[number], appearance: Appearance) {
  const base = `products/orazaka/web/step-${id}-${appearance}`;
  return { poster: mediaUrl(`${base}-poster.webp`), video: { webm: mediaUrl(`${base}.webm`), mp4: mediaUrl(`${base}.mp4`) } };
}

/**
 * Where it runs — one engine on every device: tabs Web · Mobile · Mac, each the real app in its frame (@krizaka/ui's
 * StepShowcase: the steps beside it, each recording then the next, only while in view, no native controls). The Mac
 * shows its one real capture until its recording exists — never an invented step. `#how` (the bar's « How it works »)
 * and `#platform` (« Web ») land here.
 */
export function LandingRuns() {
  const { t } = useTranslation();
  const r = t.landing.runs;
  const appearance = useAppearance();
  const labels: StepShowcaseLabels = { play: r.play, pause: r.pause, step: (n, total) => fill(r.step, { n, total }) };
  const web: ShowcaseStep[] = WEB_STEPS.map((id) => ({ id, ...r.web[id], ...webStep(id, appearance) }));
  const mobile: ShowcaseStep[] = MOBILE_STEPS.map((id) => {
    const u = clipUrls(id, appearance);
    return { id, title: t.mobile.steps[id].goal, description: t.mobile.steps[id].short, alt: t.mobile.steps[id].alt, poster: u.poster, video: { webm: u.webm, mp4: u.mp4 } };
  });

  return (
    <SectionBackdrop id="how" className="scroll-mt-16 border-t border-border-subtle">
      <article id="platform" className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-5 lg:py-28">
        <SectionHeading eyebrow={r.eyebrow} title={r.title} lead={r.lead} />
        <TabsRoot defaultValue="web" className="space-y-8">
          <TabsList aria-label={r.eyebrow} className="mx-auto w-fit">
            {DEVICES.map((d) => (
              <TabsTrigger key={d} value={d}>
                {r.tabs[d]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="web">
            <StepShowcase label={fill(r.label, { device: r.tabs.web })} device="browser" deviceTitle="dev.orazaka.com" steps={web} labels={labels} />
          </TabsContent>
          <TabsContent value="mobile" className="space-y-6">
            <StepShowcase label={fill(r.label, { device: r.tabs.mobile })} device="phone" steps={mobile} labels={labels} />
            <Link href="/docs/mobile" className="inline-flex items-center gap-1 text-sm font-medium text-fg-accent hover:underline">
              {r.mobileMore}
              <ForwardIcon size={16} />
            </Link>
          </TabsContent>
          <TabsContent value="mac">
            <div className="grid items-center gap-8 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-10">
              <div className="order-2 space-y-4 md:order-1">
                <h3 className="font-display text-xl font-semibold text-fg">{r.mac.title}</h3>
                <p className="text-sm leading-relaxed text-fg-secondary">{r.mac.body}</p>
                <Button asChild variant="secondary" size="md" shape="pill">
                  <Link href="/desktop">
                    {r.mac.cta}
                    <ForwardIcon size={16} />
                  </Link>
                </Button>
              </div>
              <DeviceFrame kind="desktop" title="Orazaka" className="order-1 md:order-2">
                <DesktopCapture alt={r.mac.alt} sizes="(min-width: 768px) 40rem, 92vw" className="h-full w-full object-cover object-top" />
              </DeviceFrame>
            </div>
          </TabsContent>
        </TabsRoot>
        <p className="text-center text-xs text-fg-secondary">{r.recorded}</p>
      </article>
    </SectionBackdrop>
  );
}
