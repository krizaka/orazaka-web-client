"use client";

import * as React from "react";
import { BarChart } from "@krizaka/charts/bar";
import { Card } from "@krizaka/ui/card";
import type { Run } from "@krizaka/orazaka-shared";
import { useTranslation } from "@/core/context/LocaleContext";
import { runsByStudio, timeToResultByKind } from "@/core/jobs/jobInsights";
import type { Job } from "@/core/types/jobs.types";

interface StudiosUsedChartProps {
  runs: readonly Run[];
  /** A Studio's name in the reader's language, from its key (the catalogue the page already holds). */
  studioLabel: (studioKey: string) => string;
  loading?: boolean;
  error?: boolean;
}

/** The Studios the person ran, most used first: horizontal bars, the failed runs in the danger colour. */
export function StudiosUsedChart({ runs, studioLabel, loading, error }: Readonly<StudiosUsedChartProps>) {
  const { t } = useTranslation();
  const w = t.insights;
  const studios = React.useMemo(
    () => runsByStudio(runs).slice(0, 8).map((s) => ({ ...s, ok: s.runs - s.failed, studio: studioLabel(s.studioKey) })),
    [runs, studioLabel],
  );
  return (
    <Card.Root>
      <Card.Body padding="lg">
        <BarChart
          title={w.studiosUsed}
          description={w.studiosUsedDesc}
          data={studios}
          x="studio"
          xLabel={w.studioHeader}
          series={[
            { key: "ok", label: w.completed, color: "accent" },
            { key: "failed", label: w.failed, color: "danger" },
          ]}
          format="integer"
          stacked
          horizontal
          height={Math.max(180, studios.length * 40)}
          loading={loading}
          error={error}
          empty={w.noStudioRun}
        />
      </Card.Body>
    </Card.Root>
  );
}

interface TimeToResultChartProps {
  jobs: readonly Job[];
  loading?: boolean;
  error?: boolean;
}

/** The median time from a request to its result, per kind of work, measured on this machine. */
export function TimeToResultChart({ jobs, loading, error }: Readonly<TimeToResultChartProps>) {
  const { t } = useTranslation();
  const w = t.insights;
  const timing = React.useMemo(() => timeToResultByKind(jobs).map((k) => ({ ...k, label: w.kinds[k.kind] })), [jobs, w]);
  return (
    <Card.Root>
      <Card.Body padding="lg">
        <BarChart
          title={w.timeToResult}
          description={w.timeToResultDesc}
          data={timing}
          x="label"
          xLabel={w.kindHeader}
          y="seconds"
          yLabel={w.secondsHeader}
          format={{ style: "unit", unit: "second" }}
          horizontal
          height={Math.max(180, timing.length * 48)}
          loading={loading}
          error={error}
        />
      </Card.Body>
    </Card.Root>
  );
}
