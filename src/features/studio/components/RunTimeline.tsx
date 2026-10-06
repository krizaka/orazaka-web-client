"use client";

import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import type { RunStep, RunStepStatus } from "@krizaka/orazaka-shared";

interface RunTimelineProps {
  steps: RunStep[];
}

/** Which glyph each step state shows. Owned here so the row below stays presentational. */
const STEP_ICON: Record<RunStepStatus, IconName> = {
  PENDING: "history",
  RUNNING: "loader",
  SUCCEEDED: "check",
  FAILED: "error",
  SKIPPED: "arrowRight",
  CANCELLED: "close",
};

const STEP_TONE: Record<RunStepStatus, string> = {
  PENDING: "text-[var(--text-muted)]",
  RUNNING: "text-[var(--accent)]",
  SUCCEEDED: "text-[var(--status-success)]",
  FAILED: "text-[var(--status-error)]",
  SKIPPED: "text-[var(--text-muted)]",
  CANCELLED: "text-[var(--text-muted)]",
};

/**
 * The per-step live timeline.
 *
 * Fan-out instances are shown individually rather than collapsed: when three of five
 * photos succeeded and two failed, "describe: partial" tells the user nothing they
 * can act on, while five rows tell them exactly which images to replace.
 */
export function RunTimeline({ steps }: Readonly<RunTimelineProps>) {
  const { t } = useTranslation();

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="hud-label text-[10px] text-[var(--text-muted)]">{t.studio.runSteps}</h2>
      <ul className="flex flex-col divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)]">
        {steps.map((step) => (
          <RunTimelineRow key={`${step.stepId}-${step.ordinal}`} step={step} />
        ))}
      </ul>
    </section>
  );
}

interface RunTimelineRowProps {
  step: RunStep;
}

/** One node of the DAG. A sub-component so the list above stays a list. */
function RunTimelineRow({ step }: Readonly<RunTimelineRowProps>) {
  return (
    <li className="flex items-center gap-2.5 p-3">
      <Icon
        name={STEP_ICON[step.status]}
        size={14}
        className={`flex-shrink-0 ${STEP_TONE[step.status]} ${
          step.status === "RUNNING" ? "animate-spin" : ""
        }`}
      />
      <span className="text-[12px] font-medium text-[var(--text-primary)]">
        {step.stepId}
        {step.ordinal > 0 && (
          <span className="text-[var(--text-muted)]"> #{step.ordinal + 1}</span>
        )}
      </span>
      <span className={`hud-label text-[10px] ml-auto ${STEP_TONE[step.status]}`}>
        {step.status}
      </span>
      {step.error && (
        <span className="text-[10px] text-[var(--status-error)] max-w-[40%] truncate">
          {step.error}
        </span>
      )}
    </li>
  );
}
