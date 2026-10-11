"use client";

import type { ComponentType } from "react";
import { CheckIcon, ClockIcon, CloseIcon, ForwardIcon, type IconProps, WarningIcon } from "@krizaka/icons";
import { Spinner } from "@krizaka/ui/spinner";
import { useTranslation } from "@/core/context/LocaleContext";
import type { RunStep, RunStepStatus } from "@krizaka/orazaka-shared";

import { cn } from "@krizaka/ui/cn";

interface RunTimelineProps {
  steps: RunStep[];
}

/** Which glyph each step state shows. Owned here so the row below stays presentational. */
const STEP_ICON: Record<Exclude<RunStepStatus, "RUNNING">, ComponentType<IconProps>> = {
  PENDING: ClockIcon,
  SUCCEEDED: CheckIcon,
  FAILED: WarningIcon,
  SKIPPED: ForwardIcon,
  CANCELLED: CloseIcon,
};

const STEP_TONE: Record<RunStepStatus, string> = {
  PENDING: "text-fg-muted",
  RUNNING: "text-fg-accent",
  SUCCEEDED: "text-fg-success",
  FAILED: "text-fg-danger",
  SKIPPED: "text-fg-muted",
  CANCELLED: "text-fg-muted",
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
      <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{t.studio.runSteps}</h2>
      <ul className="flex flex-col divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-default bg-surface-1">
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
  const { t } = useTranslation();
  const Glyph = step.status === "RUNNING" ? null : STEP_ICON[step.status];
  return (
    <li className="flex items-center gap-2.5 px-4 py-3">
      {Glyph ? <Glyph size={16} className={cn("flex-shrink-0", STEP_TONE[step.status])} /> : <Spinner size="sm" label={t.studio.runRunning} />}
      <span className="text-[13px] font-medium text-fg">
        {step.stepId}
        {step.ordinal > 0 && (
          <span className="text-fg-muted"> #{step.ordinal + 1}</span>
        )}
      </span>
      <span className={cn("ml-auto text-[11px] font-semibold uppercase tracking-wider", STEP_TONE[step.status])}>
        {step.status}
      </span>
      {step.error && (
        <span className="max-w-[40%] truncate text-[11px] text-fg-danger">
          {step.error}
        </span>
      )}
    </li>
  );
}
