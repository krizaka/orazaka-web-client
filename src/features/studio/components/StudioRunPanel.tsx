"use client";

import { Card } from "@krizaka/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioApi } from "@/services/studio.api";
import { RunForm } from "@/features/studio/components/RunForm";
import { PackKindSchema, type Installation, type Run, type StudioDetail } from "@krizaka/orazaka-shared";

/** Runs the Studio: through its installation, by its key (TOOLKIT), or by installing it first (a VERTICAL never set up). */
async function startFor(studio: StudioDetail, installation: Installation | undefined, inputs: Record<string, unknown>): Promise<Run | null> {
  if (installation) return StudioApi.startRun(installation.id, inputs);
  if (studio.kind === PackKindSchema.enum.TOOLKIT) return StudioApi.startStudioRun(studio.studioKey, inputs);
  const installed = await StudioApi.install(studio.studioKey, {});
  return installed ? StudioApi.startRun(installed.id, inputs) : null;
}

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
 *
 * A VERTICAL Studio nobody has set up yet is installed by its first run (with its settings' defaults, which for most
 * Studios is nothing at all): the Install button was a step that posted an empty form, so it is gone. A TOOLKIT
 * Studio runs by its key, with no installation (ADR-061).
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
      const run = await startFor(studio, installation, inputs);
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
    <Card.Root>
      <Card.Body padding="lg" className="gap-4">
      <h2 className="text-base font-semibold text-fg">{t.studio.runTitle}</h2>
      <RunForm
        studioKey={studio.studioKey}
        inputSchema={studio.inputSchema}
        estimatedCredits={studio.estimatedCredits}
        isSubmitting={isSubmitting}
        onSubmit={(inputs) => void start(inputs)}
      />
      {error && <p role="alert" className="text-xs text-fg-danger">{error}</p>}
      </Card.Body>
    </Card.Root>
  );
}
