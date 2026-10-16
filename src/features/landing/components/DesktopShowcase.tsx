"use client";

import { useEffect, useState } from "react";
import { CheckIcon, PauseIcon, PlayIcon } from "@krizaka/icons";
import { cn } from "@krizaka/ui/cn";
import { useTranslation } from "@/core/context/LocaleContext";
import { ModesScreen, StudioScreen } from "./DesktopModesStudioScreens";
import { FilesScreen, PacksScreen, SagasScreen } from "./DesktopPacksSagasFilesScreens";

const STEP_DURATION_MS = 6000;
const STEP_WIDTHS = ["w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"] as const;

export function DesktopShowcase() {
  const { t } = useTranslation();
  const sc = t.desktop.showcase;
  const steps = sc.steps;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [connectionMode, setConnectionMode] = useState<"local" | "cloud">("local");

  const currentStep = steps[activeIndex] ?? steps[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  return (
    <section aria-label={sc.title} className="space-y-6">
      {/* Interactive Controls & Navigation */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Showcase steps" className="flex flex-wrap items-center gap-2">
          {steps.map((s, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPlaying(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition",
                  isActive
                    ? "border-brand-orazaka bg-brand-orazaka/10 text-fg shadow-sm"
                    : "border-border-default bg-surface-1/70 text-fg-secondary hover:border-border-strong hover:text-fg"
                )}
              >
                <span className="font-mono text-[10px] opacity-70">0{idx + 1}</span>
                <span>{s.tabLabel}</span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-orazaka" />}
              </button>
            );
          })}
        </nav>

        <aside className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-2 rounded-xl border border-border-default bg-surface-1 px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:bg-surface-2 hover:text-fg"
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            <span>{isPlaying ? sc.playbackPause : sc.playbackPlay}</span>
          </button>
          <span className="font-mono text-xs text-fg-muted">
            {sc.stepCounter.replace("{current}", String(activeIndex + 1)).replace("{total}", String(steps.length))}
          </span>
        </aside>
      </header>

      {/* Animated Walkthrough Progress Bar */}
      <figure aria-hidden="true" className="h-1 w-full overflow-hidden rounded-full bg-surface-2">
        <span
          className={cn(
            "block h-full bg-brand-orazaka transition-all duration-500 ease-out",
            STEP_WIDTHS[activeIndex] ?? "w-1/5"
          )}
        />
      </figure>

      {/* Simulated macOS Window Chrome */}
      <article className="overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-border-subtle bg-surface-2/60 px-4 py-3">
          <figure className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-danger border border-danger/60" />
            <span className="h-3 w-3 rounded-full bg-warning border border-warning/60" />
            <span className="h-3 w-3 rounded-full bg-success border border-success/60" />
            <figcaption className="ml-3 font-mono text-xs font-semibold text-fg-secondary">
              Orazaka — Sovereign Desktop Workspace (Apple Silicon)
            </figcaption>
          </figure>
          <aside className="flex items-center gap-2">
            <span className="rounded-md border border-border-subtle bg-surface-0/80 px-2 py-0.5 font-mono text-[11px] text-fg-muted">
              v0.1.0-arm64
            </span>
          </aside>
        </header>

        {/* Feature Screen Canvas */}
        <section className="min-h-[380px] p-4 sm:p-6 bg-gradient-to-b from-surface-1 to-surface-0">
          {activeIndex === 0 && (
            <ModesScreen mode={connectionMode} onToggleMode={setConnectionMode} />
          )}
          {activeIndex === 1 && <StudioScreen />}
          {activeIndex === 2 && <PacksScreen />}
          {activeIndex === 3 && <SagasScreen />}
          {activeIndex === 4 && <FilesScreen />}
        </section>

        {/* Live Feature Explanation and Verifiable Proof Banner */}
        <footer className="border-t border-border-subtle bg-surface-2/70 p-4 sm:p-5">
          <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <header className="space-y-1">
              <aside className="flex items-center gap-2">
                <span className="rounded bg-brand-orazaka/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-brand-orazaka">
                  {currentStep.badge}
                </span>
                <h3 className="font-display text-base font-bold text-fg">
                  {currentStep.headline}
                </h3>
              </aside>
              <p className="text-xs leading-relaxed text-fg-secondary">
                {currentStep.description}
              </p>
            </header>

            <aside className="rounded-xl border border-success/30 bg-success/10 p-3 text-xs text-success md:max-w-sm">
              <header className="flex items-center gap-1.5 font-mono font-bold text-success">
                <CheckIcon size={14} />
                <span>{currentStep.proofBadge}</span>
              </header>
              <p className="mt-1 text-[11px] leading-snug text-success/90">
                {currentStep.proofDetail}
              </p>
            </aside>
          </section>
        </footer>
      </article>
    </section>
  );
}
