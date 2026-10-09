"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { Job } from "@/core/types/jobs.types";
import {
  type ChipDef,
  extractModel,
  extractProvider,
  extractInferenceDuration,
  extractOutputFormat,
  extractVoice,
  extractExtraMetrics,
} from "@/app/dashboard/jobs/jobKpiBar.utils";

import { cn } from "@krizaka/ui/cn";

interface JobKpiBarProps {
  job: Job;
  /** When true, shows userId column (admin view) */
  showUser?: boolean;
}

/**
 * Inline KPI bar rendering consumption metrics per job.
 * Glassmorphism chips with gradient accents and hover micro-animations.
 *
 * Extracted data sources:
 * - payload.model → AI model consumed
 * - payload.provider → inference provider
 * - payload.voice → TTS voice used
 * - result.durationMs → inference duration
 * - result.format → output format
 * - result.metrics → extra analytics (keyframes, tokens, etc.)
 */
export const JobKpiBar: React.FC<JobKpiBarProps> = ({ job, showUser }) => {
  const model = extractModel(job);
  const provider = extractProvider(job);
  const inferenceDuration = extractInferenceDuration(job);
  const outputFormat = extractOutputFormat(job);
  const voice = extractVoice(job);
  const extraMetrics = extractExtraMetrics(job);

  const chips: ChipDef[] = [];

  if (model) {
    chips.push({
      icon: <Icon name="cpu" className="w-3 h-3" />,
      label: "MODEL",
      value: model,
      gradient: "from-accent/20 to-accent/5",
      border: "border-accent/15",
      text: "text-accent",
      glow: "hover:shadow-accent/10",
    });
  }

  if (provider) {
    chips.push({
      icon: <Icon name="layers" className="w-3 h-3" />,
      label: "PROVIDER",
      value: provider,
      gradient: "from-accent/20 to-accent/5",
      border: "border-accent/15",
      text: "text-accent",
      glow: "hover:shadow-accent/10",
    });
  }

  if (inferenceDuration) {
    chips.push({
      icon: <Icon name="timer" className="w-3 h-3" />,
      label: "INFERENCE",
      value: inferenceDuration,
      gradient: "from-warning/20 to-warning/5",
      border: "border-warning/15",
      text: "text-warning",
      glow: "hover:shadow-warning/10",
    });
  }

  if (outputFormat) {
    chips.push({
      icon: <Icon name="fileOutput" className="w-3 h-3" />,
      label: "OUTPUT",
      value: outputFormat.toUpperCase(),
      gradient: "from-success/20 to-success/5",
      border: "border-success/15",
      text: "text-success",
      glow: "hover:shadow-success/10",
    });
  }

  if (voice) {
    chips.push({
      icon: <Icon name="zap" className="w-3 h-3" />,
      label: "VOICE",
      value: voice,
      gradient: "from-accent/20 to-accent/5",
      border: "border-accent/15",
      text: "text-accent",
      glow: "hover:shadow-accent/10",
    });
  }

  if (showUser && job.userId) {
    chips.push({
      icon: <Icon name="user" className="w-3 h-3" />,
      label: "USER",
      value:
        job.userId.length > 12 ? `${job.userId.substring(0, 12)}…` : job.userId,
      gradient: "from-surface-3/15 to-surface-3/5",
      border: "border-border-subtle/10",
      text: "text-fg-secondary",
      glow: "hover:shadow-surface-3/10",
    });
  }

  if (extraMetrics.length > 0) {
    extraMetrics.forEach((m) => {
      chips.push({
        icon: <Icon name="gauge" className="w-3 h-3" />,
        label: m.key.toUpperCase(),
        value: m.value,
        gradient: "from-warning/15 to-warning/5",
        border: "border-warning/12",
        text: "text-warning",
        glow: "hover:shadow-warning/10",
      });
    });
  }

  if (chips.length === 0) return null;

  return (
    <tr className="bg-transparent">
      <td
        colSpan={7}
        className="px-4 py-1.5 border-t border-fg/2"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip, i) => (
            <span
              key={`${chip.label}-${i}`}
              className={cn(
                "group/chip relative overflow-hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r",
                chip.gradient,
                "border",
                chip.border,
                "backdrop-blur-sm",
                chip.text,
                "text-[10px] font-semibold tracking-wide transition-all duration-200 hover:scale-[1.04]",
                chip.glow,
                "hover:shadow-md cursor-default"
              )}
              title={`${chip.label}: ${chip.value}`}
            >
              {/* Shimmer effect on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover/chip:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-fg/8 to-transparent pointer-events-none" />

              <span className="relative z-10 flex items-center gap-1">
                {chip.icon}
                <span className="opacity-50 text-[9px]">{chip.label}</span>
                <span className="font-bold">{chip.value}</span>
              </span>
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
};

