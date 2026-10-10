"use client";

import * as React from "react";
import Link from "next/link";
import { useTenant } from "@/core/context/TenantContext";
import { useJobStream } from "@/core/context/JobStreamContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { MODEL_CATEGORY } from "@/core/constants/capability.constants";
import { CheckIcon, NotificationIcon, WarningIcon } from "@krizaka/icons";
import { JOB_STATUS } from "@/core/constants/http.constants";

import { cn } from "@krizaka/ui/cn";
import { Popover } from "@krizaka/ui/popover";
import type { Job } from "@/core/types/jobs.types";

export interface NotificationBellProps {
  bellOpen: boolean;
  onToggle: (open: boolean) => void;
}

/**
 * The background-task bell: a @krizaka/ui Popover (Radix — placed against the bell, closed by Escape or an outside
 * click, focus returned to the bell). Its open state stays controlled by the Header, which closes its other menus
 * when this one opens.
 */
export const NotificationBell: React.FC<NotificationBellProps> = ({
  bellOpen,
  onToggle,
}) => {
  const { accentClasses } = useTenant();
  const { activeJobsCount, lastJobs } = useJobStream();
  const { t } = useTranslation();

  return (
    <Popover.Root open={bellOpen} onOpenChange={onToggle}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id="notification-bell"
          className="relative rounded-xl p-2 text-fg-muted transition-all duration-200 hover:bg-surface-1/50 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t.notifications.region}
        >
          <NotificationIcon size={20} />
          {activeJobsCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-danger text-[10px] font-bold text-on-accent">
              {activeJobsCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Content align="end" className="w-80 p-1.5">
        <header className="flex items-center justify-between border-b border-border-subtle/80 px-3 py-2">
          <span className="text-sm font-semibold">{t.notifications.title}</span>
          {activeJobsCount > 0 && (
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", accentClasses.bgSoft, accentClasses.text)}>
              {activeJobsCount} {t.notifications.active}
            </span>
          )}
        </header>
        <section className="scrollbar-thin max-h-64 overflow-y-auto py-1">
          {lastJobs.length === 0 ? (
            <p className="py-6 text-center text-xs text-fg-muted">{t.notifications.noTasks}</p>
          ) : (
            <ul className="divide-y divide-border-subtle/40">
              {lastJobs.map((job) => (
                <JobItem key={job.id} job={job} onSelect={() => onToggle(false)} />
              ))}
            </ul>
          )}
        </section>
        <footer className="border-t border-border-subtle/80 p-1.5">
          <Link
            href="/dashboard/jobs"
            onClick={() => onToggle(false)}
            className="block rounded-lg py-1.5 text-center text-xs font-semibold transition-colors hover:bg-surface-2/80"
          >
            {t.notifications.viewAll}
          </Link>
        </footer>
      </Popover.Content>
    </Popover.Root>
  );
};

/** One recent job: its status, what it generates, a link to it. */
function JobItem({ job, onSelect }: Readonly<{ job: Job; onSelect: () => void }>) {
  const { t } = useTranslation();
  const featureName = (() => {
    if (job.featureKey.includes(MODEL_CATEGORY.VIDEO)) return t.notifications.videoGen;
    if (job.featureKey.includes(MODEL_CATEGORY.IMAGE)) return t.notifications.imageGen;
    if (job.featureKey.includes(MODEL_CATEGORY.SPEECH)) return t.notifications.speechGen;
    return t.notifications.textGen;
  })();
  const status = (() => {
    if (job.status === JOB_STATUS.PROCESSING || job.status === JOB_STATUS.PENDING) {
      return <span className="mt-0.5 block h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-border-subtle border-t-fg-secondary" />;
    }
    if (job.status === JOB_STATUS.COMPLETED) {
      return <CheckIcon size={16} className="mt-0.5 flex-shrink-0 text-success" />;
    }
    return <WarningIcon size={16} className="mt-0.5 flex-shrink-0 text-danger" />;
  })();

  return (
    <li className="rounded-lg transition-colors hover:bg-surface-2/40">
      <Link href={`/dashboard/jobs?jobId=${job.id}`} onClick={onSelect} className="flex w-full items-start space-x-2.5 p-3 text-left text-xs">
        {status}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-fg-secondary">{featureName}</span>
          <span className="mt-0.5 block truncate font-mono text-fg-muted">{job.id.substring(0, 8)}...</span>
        </span>
      </Link>
    </li>
  );
}
