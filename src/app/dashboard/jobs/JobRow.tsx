"use client";

import * as React from "react";
import {
  parseISO,
  differenceInMilliseconds,
  formatDistanceToNow,
} from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useTranslation } from "@/core/context/LocaleContext";
import { Job } from "@/core/types/jobs.types";
import { Button, Icon } from "@krizaka/orazaka-design-system";
import { JOB_STATUS } from "@/core/constants/http.constants";
import { JobStatusBadge } from "@/app/dashboard/jobs/JobStatusBadge";

import { cn } from "@krizaka/ui/cn";

export interface JobRowProps {
  job: Job;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  isExpandedError: boolean;
  onToggleExpandError: () => void;
  onOpenModal: (job: Job, type: "payload" | "result") => void;
}

export const JobRow: React.FC<JobRowProps> = ({
  job,
  copiedId,
  onCopy,
  isExpandedError,
  onToggleExpandError,
  onOpenModal,
}) => {
  const { locale, t } = useTranslation();

  const getDuration = (j: Job) => {
    const start = parseISO(j.createdAt);
    const end = parseISO(j.updatedAt);
    const diff = differenceInMilliseconds(end, start);
    if (diff < 0) return "0s";
    if (diff < 1000) return `${diff}ms`;
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const getFeatureDisplayName = (featureKey: string) => {
    // Specific analysis keys first — otherwise "…video.analysis" matches the
    // generic "video" rule and is mislabelled as "Video Generation".
    if (featureKey.includes("video.analysis") || featureKey.includes("video_analysis"))
      return t.notifications.videoAnalysis;
    if (featureKey.includes("video")) return t.notifications.videoGen;
    if (featureKey.includes("image")) return t.notifications.imageGen;
    if (featureKey.includes("speech")) return t.notifications.speechGen;
    return t.notifications.textGen;
  };

  const formatDate = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: locale === "fr" ? fr : enUS,
      });
    } catch {
      return "—";
    }
  };

  return (
    <React.Fragment>
      <tr className="hover:bg-surface-2/50 transition-colors">
        {/* Job ID column */}
        <td className="p-4 font-mono text-[11px]">
          <div className="flex items-center space-x-1.5 text-fg-secondary">
            <span title={job.id}>{job.id.substring(0, 8)}...</span>
            <button
              onClick={() => onCopy(job.id, job.id)}
              className="p-1 text-fg-muted hover:text-fg rounded-md transition-colors"
              aria-label="Copy full job ID"
            >
              {copiedId === job.id ? (
                <Icon name="check" className="w-3.5 h-3.5 text-success" />
              ) : (
                <Icon name="copy" className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </td>

        {/* Task Type / Feature column */}
        <td className="p-4">
          <div className="font-semibold text-[13px] text-fg">
            {getFeatureDisplayName(job.featureKey)}
          </div>
          <div
            className="text-[10px] text-fg-muted font-mono truncate max-w-xs mt-0.5"
            title={job.featureKey}
          >
            {job.featureKey}
          </div>
        </td>

        {/* Model column */}
        <td className="p-4">
          {job.payload?.model ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-soft border border-accent/15 text-[11px] font-bold text-accent font-mono tracking-tight">
              {typeof job.payload.model === "string"
                ? job.payload.model
                : JSON.stringify(job.payload.model)}
            </span>
          ) : (
            <span className="text-[11px] text-fg-muted italic">
              —
            </span>
          )}
        </td>

        {/* Status Badge column */}
        <td className="p-4"><JobStatusBadge status={job.status} /></td>

        {/* Created At column — relative */}
        <td
          className="p-4 text-fg-muted text-[11px]"
          title={job.createdAt}
        >
          {formatDate(job.createdAt)}
        </td>

        {/* Duration column */}
        <td className="p-4 font-medium text-fg-secondary text-[11px]">
          {job.status === JOB_STATUS.PENDING || job.status === JOB_STATUS.PROCESSING ? (
            <div className="space-y-1">
              <span className="text-accent animate-pulse font-semibold text-[11px]">
                {t.jobs.running}
              </span>
              {/* Mini progress bar */}
              <div className="h-1 w-16 rounded-full bg-surface-3 overflow-hidden">
                <span className="block h-full w-1/2 rounded-full bg-accent animate-pulse" />
              </div>
            </div>
          ) : (
            getDuration(job)
          )}
        </td>

        {/* Action buttons column */}
        <td className="p-4 text-right space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenModal(job, "payload")}
            className="text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors"
            title={t.jobs.viewPayload}
          >
            <Icon name="code" className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={job.status !== JOB_STATUS.COMPLETED}
            onClick={() => onOpenModal(job, "result")}
            className="text-fg-muted hover:text-fg hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent disabled:pointer-events-none transition-colors"
            title={t.jobs.viewResult}
          >
            <Icon name="eye" className="w-4 h-4" />
          </Button>

          {job.status === JOB_STATUS.FAILED && job.errorMessage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpandError}
              className={cn("transition-colors", isExpandedError
                ? "bg-danger/20 text-danger"
                : "text-danger hover:text-danger hover:bg-surface-2/80")}
              title={t.jobs.viewErrorLogs}
            >
              <Icon name="terminal" className="w-4 h-4" />
            </Button>
          )}
        </td>
      </tr>

      {/* Collapsible Error Row */}
      {job.status === JOB_STATUS.FAILED && isExpandedError && job.errorMessage && (
        <tr className="bg-danger/5 animate-in fade-in slide-in-from-top-1 duration-200">
          <td
            colSpan={7}
            className="p-4 border-t border-border-subtle/40"
          >
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-danger uppercase tracking-wider flex items-center">
                  <Icon name="warning" className="w-3.5 h-3.5 mr-1.5" />
                  {t.jobs?.errorDetails || "Error details:"}
                </span>
                <button
                  onClick={() =>
                    onCopy(job.errorMessage || "", `err-${job.id}`)
                  }
                  className="text-xs font-semibold text-danger hover:text-danger flex items-center space-x-1"
                >
                  {copiedId === `err-${job.id}` ? (
                    <>
                      <Icon name="check" className="w-3 h-3 text-success" />
                      <span className="text-success">{t.jobs.copied}</span>
                    </>
                  ) : (
                    <>
                      <Icon name="copy" className="w-3 h-3" />
                      <span>{t.jobs.copyError}</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs font-mono text-danger overflow-x-auto whitespace-pre-wrap leading-relaxed max-w-full">
                {job.errorMessage}
              </pre>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};
