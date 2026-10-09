"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioLoadError, StudioLoading } from "./StudioAsyncState";
import { useStudioRun } from "@/features/studio/hooks/useStudioRun";
import { RunTimeline } from "@/features/studio/components/RunTimeline";
import { RunOutputs } from "@/features/studio/components/RunOutputs";
import { StudioApi } from "@/services/studio.api";
import { isTerminalRun, type RunStatus } from "@krizaka/orazaka-shared";

interface RunScreenProps {
  runId: string;
}

/**
 * The live run screen: state, per-step timeline, results.
 *
 * The approve and cancel actions live here rather than on the timeline because they
 * act on the run, not on a node — and a cancel offered next to a step invites the
 * user to think they are cancelling only that step.
 */
export function RunScreen({ runId }: Readonly<RunScreenProps>) {
  const { t } = useTranslation();
  const { run, isLoading, hasError, reload } = useStudioRun(runId);

  if (isLoading) {
    return <StudioLoading />;
  }

  if (hasError || !run) {
    return <StudioLoadError />;
  }

  const headline: Record<RunStatus, string> = {
    PENDING_APPROVAL: t.studio.runAwaitingInput,
    RUNNING: t.studio.runRunning,
    AWAITING_INPUT: t.studio.runAwaitingInput,
    SUCCEEDED: t.studio.runSucceeded,
    FAILED: t.studio.runFailed,
    CANCELLED: t.studio.runCancelled,
    COMPENSATING: t.studio.runFailed,
  };

  const act = async (action: () => Promise<void>) => {
    await action();
    reload();
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/studios"
        className="inline-flex items-center gap-1.5 self-start text-[11px] font-medium text-fg-muted hover:text-fg transition-colors duration-150"
      >
        <Icon name="arrowLeft" size={13} />
        {t.studio.back}
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="text-[15px] font-semibold tracking-[-0.02em] text-fg">
          {headline[run.status]}
        </h1>
        <span className="hud-label text-[10px] text-fg-muted">
          {run.studioKey} · {run.blueprintVersion} ·{" "}
          {format(new Date(run.startedAt), "dd MMM yyyy HH:mm")}
        </span>
        {run.errorMessage && (
          <p className="text-[11px] text-danger">{run.errorMessage}</p>
        )}
      </header>

      {!isTerminalRun(run.status) && (
        <div className="flex items-center gap-2">
          {run.status === "AWAITING_INPUT" && (
            <button
              type="button"
              onClick={() => void act(() => StudioApi.approveRun(run.id))}
              className="h-8 px-3 text-[12px] font-medium border border-accent text-accent hover:bg-surface-2 transition-colors duration-150"
            >
              {t.studio.approve}
            </button>
          )}
          <button
            type="button"
            onClick={() => void act(() => StudioApi.cancelRun(run.id))}
            className="h-8 px-3 text-[12px] font-medium text-fg-muted hover:text-danger transition-colors duration-150"
          >
            {t.studio.cancelRun}
          </button>
        </div>
      )}

      <RunTimeline steps={run.steps} />
      <RunOutputs outputs={run.outputs} />
    </div>
  );
}
