"use client";

import * as React from "react";
import { BarChart } from "@krizaka/charts/bar";
import { DonutChart } from "@krizaka/charts/pie";
import { Card } from "@krizaka/ui/card";
import { fill } from "@/core/context/fill";
import { useTranslation } from "@/core/context/LocaleContext";
import { activityByDay, jobsByKind } from "@/core/jobs/jobInsights";
import type { Job } from "@/core/types/jobs.types";

interface ActivityChartsProps {
  /** The person's recent jobs (newest first, as the API returns them). */
  jobs: readonly Job[];
  /** The jobs are on their way: each chart shows its own skeleton. */
  loading?: boolean;
  /** They could not be read. */
  error?: boolean;
  /** How many days the bars cover. */
  days?: number;
}

/**
 * Two charts of the person's own work: the jobs of each day by outcome (stacked bars — the failures stand out in the
 * danger colour), and what they made by kind (a donut, the total in its hole). Each carries its data table and a
 * written summary (@krizaka/charts), so the figures are readable without the drawing.
 */
export function ActivityCharts({ jobs, loading, error, days = 14 }: Readonly<ActivityChartsProps>) {
  const { t } = useTranslation();
  const w = t.insights;
  const perDay = React.useMemo(() => activityByDay(jobs, days), [jobs, days]);
  const kinds = React.useMemo(() => jobsByKind(jobs).map((k) => ({ ...k, label: w.kinds[k.kind] })), [jobs, w]);
  const empty = !loading && jobs.length === 0;

  return (
    <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <Card.Root>
        <Card.Body padding="lg">
          <BarChart
            title={w.jobsPerDay}
            description={fill(w.jobsPerDayDesc, { days })}
            data={empty ? [] : perDay}
            x="day"
            xFormat="day"
            xLabel={w.day}
            series={[
              { key: "completed", label: w.completed, color: "accent" },
              { key: "failed", label: w.failed, color: "danger" },
              { key: "running", label: w.running, color: "neutral" },
            ]}
            format="integer"
            stacked
            height={220}
            loading={loading}
            error={error}
          />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body padding="lg">
          <DonutChart
            title={w.byKind}
            description={w.byKindDesc}
            data={kinds}
            label="label"
            value="count"
            labelHeader={w.kindHeader}
            valueHeader={w.jobsHeader}
            centerLabel={w.jobsCenter}
            format="integer"
            height={220}
            loading={loading}
            error={error}
          />
        </Card.Body>
      </Card.Root>
    </section>
  );
}
