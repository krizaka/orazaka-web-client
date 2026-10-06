import React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { useJobStream } from "@/core/context/JobStreamContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { JOB_STATUS } from "@/core/constants/http.constants";
import {
  getJobId,
  isVideo,
  isAudio,
  isImage,
} from "@/app/dashboard/jobs/resultDisplay.utils";

/**
 * Props definition for the ResultDisplay component.
 */
interface ResultDisplayProps {
  payload: unknown;
}

/**
 * Component to defensively format and display local AI generation assets or terminal logs,
 * with support for asynchronous job tracking.
 */
interface JobResultDisplayProps {
  job: { status: string; errorMessage?: string | null; result?: unknown };
  jobId: string;
}

function JobResultDisplay({ job, jobId }: Readonly<JobResultDisplayProps>) {
  const { t } = useTranslation();

  if (job.status === JOB_STATUS.PENDING || job.status === JOB_STATUS.PROCESSING) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-surface-1/50 dark:bg-surface-0/20 border border-dashed border-border-subtle">
        <div className="flex items-center gap-2 text-text-secondary font-semibold text-sm">
          <Icon name="loader" className="h-4 w-4 animate-spin text-accent" />
          <span>{t.playground.taskActive}</span>
        </div>
        <p className="text-xs text-text-muted dark:text-text-secondary">
          {t.playground.status}
          <span className="font-semibold uppercase text-accent">
            {job.status}
          </span>
        </p>
        <p className="text-[10px] text-text-secondary font-mono">
          {t.playground.jobId} {jobId}
        </p>
      </div>
    );
  }

  if (job.status === JOB_STATUS.FAILED) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-status-error/10 border border-status-error/30 text-status-error">
        <div className="flex items-center gap-1.5 font-semibold text-sm">
          <Icon name="alertCircle" className="h-4 w-4 text-status-error" />
          <span>{t.playground.taskFailed}</span>
        </div>
        <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
          {job.errorMessage || t.playground.unknownError}
        </p>
      </div>
    );
  }

  if (job.status === JOB_STATUS.COMPLETED) {
    const resultObj = job.result;
    if (!resultObj) {
      return (
        <div className="flex items-center gap-2 text-text-muted py-2">
          <Icon name="checkCircle" className="h-4 w-4 text-status-success" />
          <span>{t.playground.taskCompletedNoOutput}</span>
        </div>
      );
    }
    return <ResultDisplayInner payload={resultObj} />;
  }

  return null;
}

export function ResultDisplay({ payload }: Readonly<ResultDisplayProps>) {
  const { jobs } = useJobStream();
  const { t } = useTranslation();

  const jobId = getJobId(payload);

  if (jobId) {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return (
        <div className="flex items-center gap-2 text-text-muted py-2">
          <Icon name="loader" className="h-4 w-4 animate-spin text-accent" />
          <span>{t.playground.taskQueued.replace("{jobId}", jobId)}</span>
        </div>
      );
    }
    return <JobResultDisplay job={job} jobId={jobId} />;
  }

  return <ResultDisplayInner payload={payload} />;
}

function ResultDisplayInner({ payload }: Readonly<ResultDisplayProps>) {
  const { t } = useTranslation();
  const p =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : null;
  const rawUrl = p ? (p.url as string) : (payload as string);
  const format = p ? (p.format as string) : undefined;
  const content = p ? (p.content as string) : undefined;
  const analysis = p ? (p.analysis as string) : undefined;

  const absoluteUrl = React.useMemo(() => {
    if (globalThis.window !== undefined && rawUrl?.startsWith("/")) {
      return `${globalThis.location.origin}${rawUrl}`;
    }
    return rawUrl;
  }, [rawUrl]);

  if (p) {
    if ("transcript" in p || "keyframeCount" in p) {
      return (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-status-warning/10 text-status-warning border border-status-warning/20">
              {t.playground.keyframesExtracted}{" "}
              {(p.keyframeCount as number) ?? 0}
            </span>
          </div>
          <div className="rounded-lg bg-surface-1 dark:bg-surface-0/40 p-4 border border-border-subtle text-sm">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest block mb-2">
              {t.playground.transcript}
            </span>
            <p className="text-text-secondary leading-relaxed italic">
              {(p.transcript as string) || t.playground.noDialogueDetected}
            </p>
          </div>
        </div>
      );
    }
  }

  if ((content || analysis) && !rawUrl) {
    return (
      <pre className="mt-2 overflow-x-auto rounded bg-surface-0 p-4 font-mono text-xs text-text-primary whitespace-pre-wrap break-all">
        {content || analysis}
      </pre>
    );
  }

  if (!rawUrl) {
    return (
      <p className="text-text-muted dark:text-text-secondary text-sm">
        {t.playground.noAssetOutput}
      </p>
    );
  }

  if (isVideo(format, rawUrl)) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border-subtle bg-surface-1/50 dark:bg-surface-0/20 p-4">
        <video
          src={absoluteUrl}
          controls
          autoPlay
          muted
          playsInline
          loop
          className="max-h-[512px] w-full max-w-[512px] rounded-md bg-black shadow-md"
        >
          <track kind="captions" />
        </video>
        <span className="mt-2 text-xs text-text-muted dark:text-text-secondary font-semibold uppercase tracking-wider">
          {t.playground.localCPlusPlusInference}
        </span>
      </div>
    );
  }

  if (isAudio(format, rawUrl)) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-border-subtle/80 bg-surface-1/40 dark:bg-surface-1/10 p-6 shadow-sm backdrop-blur-sm transition-all duration-300">
        <audio
          src={absoluteUrl}
          controls
          preload="metadata"
          className="w-full max-w-[400px] rounded-lg shadow-inner focus:outline-none"
        >
          <track kind="captions" />
        </audio>
        <span className="mt-3 text-[10px] text-text-secondary dark:text-text-muted font-semibold uppercase tracking-widest">
          {t.playground.localAudioGeneration}
        </span>
      </div>
    );
  }

  if (isImage(format, rawUrl)) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border-subtle bg-surface-1/50 dark:bg-surface-0/20 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={absoluteUrl}
          alt="Orazaka Framework Local AI Generation"
          className="max-h-[512px] w-full max-w-[512px] rounded-md object-contain shadow-md transition-all duration-300"
          loading="lazy"
        />
        <span className="mt-2 text-xs text-text-muted dark:text-text-secondary font-semibold uppercase tracking-wider">
          {t.playground.localImageGeneration}
        </span>
      </div>
    );
  }

  return (
    <pre className="mt-2 overflow-x-auto rounded bg-surface-0 p-4 font-mono text-xs text-text-primary whitespace-pre-wrap break-all">
      {rawUrl}
    </pre>
  );
}
