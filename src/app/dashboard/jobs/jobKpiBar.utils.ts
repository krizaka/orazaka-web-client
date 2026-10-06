import type { ReactNode } from "react";
import { differenceInMilliseconds, parseISO } from "date-fns";
import type { Job } from "@/core/types/jobs.types";
import { resolveProviderFromFeature } from "@/core/constants/capability.constants";
import { JOB_STATUS } from "@/core/constants/http.constants";
export interface ChipDef {
  icon: ReactNode;
  label: string;
  value: string;
  gradient: string;
  border: string;
  text: string;
  glow: string;
}

// ── Extraction utilities ──────────────────────────

export function extractModel(job: Job): string | null {
  const p = job.payload;
  if (p?.model && typeof p.model === "string") return p.model;
  const r = job.result;
  if (r?.metadata && typeof r.metadata === "object") {
    const meta = r.metadata as Record<string, unknown>;
    if (meta.model && typeof meta.model === "string") return meta.model;
  }
  return null;
}

export function extractProvider(job: Job): string | null {
  const p = job.payload;
  if (p?.provider && typeof p.provider === "string") return p.provider;
  return resolveProviderFromFeature(job.featureKey);
}

export function extractInferenceDuration(job: Job): string | null {
  const r = job.result;
  if (r?.durationMs && typeof r.durationMs === "number") {
    return formatMs(r.durationMs);
  }
  if (job.status === JOB_STATUS.COMPLETED && job.createdAt && job.updatedAt) {
    try {
      const diff = differenceInMilliseconds(
        parseISO(job.updatedAt),
        parseISO(job.createdAt),
      );
      if (diff >= 0) return formatMs(diff);
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function extractOutputFormat(job: Job): string | null {
  const r = job.result;
  if (r?.format && typeof r.format === "string") return r.format;
  return null;
}

export function extractVoice(job: Job): string | null {
  const p = job.payload;
  if (p?.voice && typeof p.voice === "string") return p.voice;
  return null;
}

export function extractExtraMetrics(job: Job): { key: string; value: string }[] {
  const r = job.result;
  const results: { key: string; value: string }[] = [];

  if (r?.metrics && typeof r.metrics === "object") {
    const metrics = r.metrics as Record<string, unknown>;
    Object.entries(metrics).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        results.push({
          key: key.replace(/([A-Z])/g, " $1").trim(),
          value:
            typeof val === "string" ||
            typeof val === "number" ||
            typeof val === "boolean"
              ? String(val)
              : JSON.stringify(val),
        });
      }
    });
  }

  if (r?.keyframeCount && typeof r.keyframeCount === "number") {
    results.push({ key: "Keyframes", value: String(r.keyframeCount) });
  }

  return results;
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.floor(ms / 1000);
  if (secs < 60) return `${secs}.${Math.round((ms % 1000) / 100)}s`;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return `${mins}m ${remSecs}s`;
}
