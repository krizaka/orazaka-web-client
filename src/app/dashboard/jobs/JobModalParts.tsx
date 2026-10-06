"use client";

import * as React from "react";
import { parseISO } from "date-fns";
import { Icon } from "@krizaka/orazaka-design-system";
import type { IconName } from "@krizaka/orazaka-design-system";
import { useTenant } from "@/core/context/TenantContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { JOB_STATUS } from "@/core/constants/http.constants";

/** Shared status-to-stage-index resolver — used by ProgressTimeline and StageLabels */
const resolveStatusIndex = (s: string): number => {
  if (s === JOB_STATUS.COMPLETED || s === JOB_STATUS.FAILED) return 2;
  if (s === JOB_STATUS.PROCESSING || s === JOB_STATUS.PENDING) return 1;
  return 0;
};

/* ─── Fluid Progress Bar ─── */
export function ProgressTimeline({ status }: Readonly<{ status: string }>) {
  const { t } = useTranslation();

  const stages: { key: string; label: string; icon: IconName }[] = [
    {
      key: "submitted",
      label: t.jobs?.colCreated || "Submitted",
      icon: "upload",
    },
    {
      key: "processing",
      label: t.jobs?.running || "Processing",
      icon: "loader",
    },
    {
      key: "done",
      label:
        status === JOB_STATUS.FAILED
          ? t.jobs?.statusFailed || "Failed"
          : t.jobs?.statusCompleted || "Completed",
      icon: status === JOB_STATUS.FAILED ? "error" : "checkCircle",
    },
  ];

  const currentIdx = resolveStatusIndex(status);

  return (
    <section className="flex items-center gap-1 px-1">
      {stages.map((stage, i) => {
        const isDone = i < currentIdx;
        const stageIconName: IconName = isDone ? "check" : stage.icon;
        const isActive = i === currentIdx;
        const isFailed = stage.key === "done" && status === JOB_STATUS.FAILED;

        return (
          <React.Fragment key={stage.key}>
            {/* Node */}
            <div
              className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-500 ${(() => {
                if (isDone)
                  return isFailed
                    ? "bg-status-error/10 text-status-error"
                    : "bg-status-success/10 text-status-success";
                if (isActive)
                  return isFailed
                    ? "bg-status-error/10 text-status-error"
                    : "bg-[var(--accent-soft)] text-[var(--accent)]";
                return "bg-[var(--surface-2)] text-[var(--text-muted)]";
              })()}`}
            >
              {isActive &&
                !isDone &&
                status !== JOB_STATUS.FAILED &&
                status !== JOB_STATUS.COMPLETED && (
                  <span className="absolute inset-0 rounded-xl bg-[var(--accent)] opacity-[0.06] animate-pulse" />
                )}
              <Icon
                name={stageIconName}
                className={`w-4 h-4 relative z-10 ${isActive && (status === JOB_STATUS.PROCESSING || status === JOB_STATUS.PENDING) ? "animate-spin" : ""}`}
              />
            </div>

            {/* Connector */}
            {i < stages.length - 1 && (
              <div className="flex-1 h-[2px] rounded-full bg-[var(--surface-3)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${(() => {
                    if (isDone || (isActive && i < currentIdx))
                      return isFailed
                        ? "bg-status-error w-full"
                        : "bg-[var(--accent)] w-full";
                    if (isActive)
                      return "bg-[var(--accent)] w-1/2 animate-pulse";
                    return "w-0";
                  })()}`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </section>
  );
}

/* ─── Stage Labels Row ─── */
export function StageLabels({ status }: Readonly<{ status: string }>) {
  const { t } = useTranslation();

  const labels = [
    t.jobs?.colCreated || "Submitted",
    t.jobs?.running || "Processing",
    status === JOB_STATUS.FAILED
      ? t.jobs?.statusFailed || "Failed"
      : t.jobs?.statusCompleted || "Completed",
  ];

  const currentIdx = resolveStatusIndex(status);

  return (
    <section className="flex justify-between px-3 mt-1.5">
      {labels.map((label, i) => (
        <span
          key={label}
          className={`text-[10px] font-medium transition-colors duration-300 ${
            i <= currentIdx
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          {label}
        </span>
      ))}
    </section>
  );
}

/* ─── Status Badge (compact) ─── */
export function StatusPill({ status }: Readonly<{ status: string }>) {
  const map: Record<string, { cls: string; label: string; dot: string }> = {
    COMPLETED: { cls: "bg-status-success/10 text-status-success", label: "Completed", dot: "bg-status-success" },
    FAILED: { cls: "bg-status-error/10 text-status-error", label: "Failed", dot: "bg-status-error" },
    PROCESSING: { cls: "bg-status-warning/10 text-status-warning", label: "Processing", dot: "bg-status-warning" },
    PENDING: { cls: "bg-accent/10 text-accent", label: "Pending", dot: "bg-accent" },
  };
  const style = map[status] || map.PENDING;
  const dotColor = style.dot;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${style.cls}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === JOB_STATUS.PROCESSING || status === JOB_STATUS.PENDING ? "animate-pulse" : ""
        } ${dotColor}`}
      />
      {style.label}
    </span>
  );
}

/* ─── Live Elapsed Counter ─── */
export function LiveElapsed({
  createdAt,
  updatedAt,
  isLive,
}: Readonly<{
  createdAt?: string;
  updatedAt?: string;
  isLive: boolean;
}>) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const startTime = createdAt ? parseISO(createdAt).getTime() : 0;
  const endTime = (() => {
    if (isLive) return now;
    if (updatedAt) return parseISO(updatedAt).getTime();
    return startTime;
  })();
  const diffMs = endTime - startTime;

  const formatElapsed = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  };

  const elapsed = formatElapsed(diffMs);

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-mono tabular-nums">
      <Icon name="timer" className="w-3 h-3" />
      {elapsed}
      {isLive && (
        <span className="w-1 h-1 rounded-full bg-status-warning animate-pulse" />
      )}
    </span>
  );
}

/* ─── Tab Item ─── */
export type TabKey = "payload" | "result" | "error";

export function PillTab({
  label,
  icon,
  isActive,
  variant = "default",
  onClick,
}: Readonly<{
  label: string;
  icon: IconName;
  isActive: boolean;
  variant?: "default" | "error";
  onClick: () => void;
}>) {
  const { accentClasses } = useTenant();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${(() => {
          if (!isActive) return "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-2)]";
          if (variant === "error") return "bg-status-error/10 text-status-error shadow-sm";
          return `bg-[var(--accent-soft)] ${accentClasses.text} shadow-sm`;
        })()}`}
    >
      <Icon name={icon} className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
