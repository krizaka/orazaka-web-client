import { Icon } from "@krizaka/orazaka-design-system";
import { JobStatus } from "@/core/types/jobs.types";
import { JOB_STATUS } from "@/core/constants/http.constants";

/** Pill badge for a job's status (icon + label, theme-token colored). */
export function JobStatusBadge({ status }: Readonly<{ status: JobStatus }>) {
  switch (status) {
    case JOB_STATUS.PENDING:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
          <Icon name="timer" className="w-3.5 h-3.5 mr-1 text-[var(--text-muted)]" />
          PENDING
        </span>
      );
    case JOB_STATUS.PROCESSING:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/15 animate-pulse">
          <Icon name="loader" className="w-3.5 h-3.5 mr-1 text-accent animate-spin" />
          PROCESSING
        </span>
      );
    case JOB_STATUS.COMPLETED:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-status-success/10 text-status-success border border-status-success/15">
          <Icon name="checkCircle" className="w-3.5 h-3.5 mr-1 text-status-success" />
          COMPLETED
        </span>
      );
    case JOB_STATUS.FAILED:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-status-error/10 text-status-error border border-status-error/15">
          <Icon name="warning" className="w-3.5 h-3.5 mr-1 text-status-error" />
          FAILED
        </span>
      );
    default:
      return null;
  }
}
