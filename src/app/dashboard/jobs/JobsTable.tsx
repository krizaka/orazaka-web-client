"use client";

import * as React from "react";
import { Job } from "@/core/types/jobs.types";
import { useTranslation } from "@/core/context/LocaleContext";
import { JobRow } from "./JobRow";
import { JobKpiBar } from "./JobKpiBar";
import { Button, Icon } from "@krizaka/orazaka-design-system";

export interface JobsTableProps {
  jobs: Job[];
  loading: boolean;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onOpenModal: (job: Job, type: "payload" | "result") => void;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  loading,
  totalPages,
  totalElements,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onOpenModal,
  copiedId,
  onCopy,
}) => {
  const { t } = useTranslation();
  const [expandedErrorJobId, setExpandedErrorJobId] = React.useState<
    string | null
  >(null);

  const toggleExpandError = (jobId: string) => {
    setExpandedErrorJobId((prev) => (prev === jobId ? null : jobId));
  };

  return (
    <article className="glass-card rounded-2xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle/85 dark:border-border-subtle/60 bg-surface-1/50 dark:bg-surface-1/40 text-xs font-bold text-text-muted dark:text-text-secondary">
              <th className="p-4">{t.jobs?.colId || "Job ID"}</th>
              <th className="p-4">{t.jobs?.colType || "Task Type"}</th>
              <th className="p-4">{t.playground?.model || "Model"}</th>
              <th className="p-4">{t.jobs?.colStatus || "Status"}</th>
              <th className="p-4">{t.jobs?.colCreated || "Created At"}</th>
              <th className="p-4">{t.jobs?.colDuration || "Duration"}</th>
              <th className="p-4 text-right">
                {t.jobs?.colActions || "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/80 dark:divide-border-subtle/40 text-sm">
            {(() => {
              if (loading && jobs.length === 0) return (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-24 text-text-secondary dark:text-text-muted"
                >
                  <Icon name="loader" className="w-6 h-6 animate-spin mx-auto mb-2 text-text-secondary" />
                  <span>{t.jobs.loading}</span>
                </td>
              </tr>
              );
              if (jobs.length === 0) return (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-20 text-text-secondary dark:text-text-muted"
                >
                  {t.jobs?.noJobs || "No background tasks found in history."}
                </td>
              </tr>
              );
              return jobs.map((job) => (
                <React.Fragment key={job.id}>
                  <JobRow
                    job={job}
                    copiedId={copiedId}
                    onCopy={onCopy}
                    isExpandedError={expandedErrorJobId === job.id}
                    onToggleExpandError={() => toggleExpandError(job.id)}
                    onOpenModal={onOpenModal}
                  />
                  <JobKpiBar job={job} />
                </React.Fragment>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <footer className="flex items-center justify-between p-4 border-t border-border-subtle/80 dark:border-border-subtle/60 bg-surface-1/50 dark:bg-surface-1/40 text-xs font-semibold text-text-muted dark:text-text-secondary">
          <div className="flex items-center space-x-4">
            <span>
              {t.jobs.paginationShowing} {currentPage * pageSize + 1} -{" "}
              {Math.min((currentPage + 1) * pageSize, totalElements)}{" "}
              {t.jobs.paginationOf} {totalElements} {t.jobs.paginationTasks}
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              className="border border-border-subtle bg-transparent rounded-lg p-1 text-xs focus:outline-none"
            >
              <option value={10}>10 {t.jobs.perPage}</option>
              <option value={20}>20 {t.jobs.perPage}</option>
              <option value={50}>50 {t.jobs.perPage}</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              disabled={currentPage === 0 || loading}
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              className="h-8 px-2.5 rounded-lg border border-border-subtle hover:bg-surface-2 dark:hover:bg-surface-2 disabled:opacity-40"
            >
              <Icon name="chevronLeft" className="w-4 h-4 mr-1" />
              <span>{t.jobs.previous}</span>
            </Button>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-surface-2 border border-border-subtle/70 dark:border-border-subtle/60 text-text-secondary font-bold">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              disabled={currentPage === totalPages - 1 || loading}
              onClick={() =>
                onPageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              className="h-8 px-2.5 rounded-lg border border-border-subtle hover:bg-surface-2 dark:hover:bg-surface-2 disabled:opacity-40"
            >
              <span>{t.jobs.next}</span>
              <Icon name="chevronRight" className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </footer>
      )}
    </article>
  );
};
