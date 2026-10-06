"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioApi } from "@/services/studio.api";
import { RunForm } from "@/features/studio/components/RunForm";
import type { Installation, StudioDetail } from "@krizaka/orazaka-shared";

interface StudioRunPanelProps {
  studio: StudioDetail;
  /** Absent for a TOOLKIT Studio, whose installation is derived and has no id (ADR-061). */
  installation?: Installation;
}

/**
 * The run form for an installed Studio, and the navigation to its live run.
 *
 * A started run redirects to its own screen rather than rendering progress inline:
 * a run outlives this page, and a user who navigates away must be able to come back
 * to it by URL.
 */
export function StudioRunPanel({ studio, installation }: Readonly<StudioRunPanelProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async (inputs: Record<string, unknown>) => {
    setSubmitting(true);
    setError(null);
    try {
      const run = installation
        ? await StudioApi.startRun(installation.id, inputs)
        : await StudioApi.startStudioRun(studio.studioKey, inputs);
      if (run) {
        router.push(`/studios/runs/${run.id}`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.studio.loadError);
    } finally {
      setSubmitting(false);
    }
  };

  if (installation?.status === "PAUSED" || installation?.status === "REVOKED") {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 p-4 border border-[var(--border-subtle)] bg-[var(--surface-1)]">
      <h2 className="text-[13px] font-semibold text-[var(--text-primary)]">{t.studio.runTitle}</h2>
      <RunForm
        inputSchema={studio.inputSchema}
        estimatedCredits={studio.estimatedCredits}
        isSubmitting={isSubmitting}
        onSubmit={(inputs) => void start(inputs)}
      />
      {error && <p className="text-[11px] text-[var(--status-error)]">{error}</p>}
    </section>
  );
}
