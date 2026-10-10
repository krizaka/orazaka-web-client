"use client";

import { useState } from "react";
import { format, formatISO, parseISO, subMinutes } from "date-fns";
import { PlayIcon } from "@krizaka/icons";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
import { EmptyState } from "@krizaka/ui/empty-state";
import { useTranslation } from "@/core/context/LocaleContext";
import type { AutomationJob } from "@/features/automation/components/liveJobGrid.types";

const TONE = {
  PENDING_APPROVAL: "warning",
  APPROVED: "accent",
  RUNNING: "accent",
  COMPLETED: "success",
  FAILED: "danger",
  AWAITING_CLI_EXECUTION: "neutral",
} as const satisfies Record<AutomationJob["status"], string>;

// Demo data for development.
const DEMO_JOBS: AutomationJob[] = [
  {
    id: "job-001",
    connectorType: "JIRA",
    action: "CREATE_TICKET",
    status: "PENDING_APPROVAL",
    userId: "user-1",
    createdAt: formatISO(new Date()),
    payload: { project: "ORAZAKA", summary: "Deploy automation pipeline" },
  },
  {
    id: "job-002",
    connectorType: "CLI_AGENT",
    action: "SORT_FILES",
    status: "PENDING_APPROVAL",
    userId: "user-1",
    createdAt: formatISO(new Date()),
    payload: { directory: "~/Photos", pattern: "*.jpg" },
  },
  {
    id: "job-003",
    connectorType: "WHATSAPP",
    action: "SEND_NOTIFICATION",
    status: "RUNNING",
    userId: "user-1",
    createdAt: formatISO(subMinutes(new Date(), 1)),
    payload: { recipient: "+1234567890", message: "Build completed" },
  },
  {
    id: "job-004",
    connectorType: "SLACK",
    action: "POST_SUMMARY",
    status: "COMPLETED",
    userId: "user-1",
    createdAt: formatISO(subMinutes(new Date(), 2)),
    payload: { channel: "#deployments" },
  },
];

/** A job's state: the @krizaka/ui badge in its status tone, its dot pulsing while it runs. */
export function AutomationStatusBadge({ status }: Readonly<{ status: AutomationJob["status"] }>) {
  const { t } = useTranslation();
  return (
    <Badge tone={TONE[status]} size="md" dot pulse={status === "RUNNING"}>
      {t.automation.jobStatus[status]}
    </Badge>
  );
}

/** The jobs awaiting approval or running: one @krizaka/ui card each, approve or revoke. */
export default function LiveJobGrid() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<AutomationJob[]>(DEMO_JOBS);

  const approve = async (jobId: string) => {
    setJobs((previous) => previous.map((j) => (j.id === jobId ? { ...j, status: "APPROVED" as const } : j)));
    // Optimistic: the job is already shown approved.
    await fetch(`/api/v1/jobs/${jobId}/approve`, { method: "POST" }).catch(() => undefined);
  };

  const revoke = async (jobId: string) => {
    setJobs((previous) => previous.filter((j) => j.id !== jobId));
    await fetch(`/api/v1/jobs/${jobId}/revoke`, { method: "POST" }).catch(() => undefined);
  };

  const count = (status: AutomationJob["status"]) => jobs.filter((j) => j.status === status).length;

  return (
    <section id="live-job-grid" className="flex flex-col gap-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <hgroup className="flex flex-col gap-1">
          <h2 className="hud-title text-2xl text-fg">{t.automation.jobsTitle}</h2>
          <p className="text-sm text-fg-secondary">{t.automation.jobsSubtitle}</p>
        </hgroup>
        <dl className="flex gap-6">
          <Stat label={t.automation.pending} value={count("PENDING_APPROVAL")} />
          <Stat label={t.automation.running} value={count("RUNNING")} />
        </dl>
      </header>

      {jobs.length === 0 ? (
        <EmptyState title={t.automation.empty} />
      ) : (
        <ul className="stagger-children flex flex-col gap-3">
          {jobs.map((job) => (
            <li key={job.id} id={`job-card-${job.id}`}>
              <Card.Root className={job.status === "PENDING_APPROVAL" ? "border-warning/50" : undefined}>
                <Card.Body padding="md" className="gap-3 p-5">
                  <header className="flex items-start justify-between gap-3">
                    <span className="flex flex-col gap-0.5">
                      <span className="hud-label">{job.connectorType}</span>
                      <Card.Title className="line-clamp-none font-mono text-sm group-hover:text-fg">{job.action}</Card.Title>
                    </span>
                    <AutomationStatusBadge status={job.status} />
                  </header>
                  <span className="hud-label">{t.automation.payload}</span>
                  <code className="block whitespace-pre-wrap rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs text-fg-secondary">
                    {JSON.stringify(job.payload, null, 2)}
                  </code>
                  <Card.Footer className="justify-between">
                    <time dateTime={job.createdAt} className="font-mono" suppressHydrationWarning>
                      {format(parseISO(job.createdAt), "HH:mm:ss")}
                    </time>
                    {job.status === "PENDING_APPROVAL" && (
                      <span className="flex gap-2">
                        <Button id={`revoke-${job.id}`} variant="ghost" size="sm" onClick={() => revoke(job.id)}>
                          {t.automation.revoke}
                        </Button>
                        <Button id={`approve-${job.id}`} size="sm" onClick={() => approve(job.id)}>
                          <PlayIcon size={14} />
                          {t.automation.approve}
                        </Button>
                      </span>
                    )}
                  </Card.Footer>
                </Card.Body>
              </Card.Root>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <span className="flex flex-col items-end">
      <dt className="hud-label">{label}</dt>
      <dd className="font-display text-xl font-bold tabular-nums text-fg">{value}</dd>
    </span>
  );
}
