"use client";

import * as React from "react";
import { Job } from "@/core/types/jobs.types";
import { useTranslation } from "@/core/context/LocaleContext";
import { JobRow } from "./JobRow";
import { JobKpiBar } from "./JobKpiBar";
import { Loader } from "@krizaka/ui/loader";
import { Pagination } from "@krizaka/ui/pagination";
import { fill } from "@/core/context/fill";

const PAGE_SIZES = [10, 20, 50] as const;

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
            <tr className="border-b border-border-subtle/60 bg-surface-1/40 text-xs font-bold text-fg-secondary">
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
          <tbody className="divide-y divide-border-subtle/40 text-sm">
            {(() => {
              if (loading && jobs.length === 0) return (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-24 text-fg-muted"
                  >
                    <Loader variant="block" label={t.jobs.loading} delay={0} />
                  </td>
                </tr>
              );
              if (jobs.length === 0) return (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-20 text-fg-muted"
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

      {totalPages > 1 && (
        <footer className="border-t border-border-subtle/60 bg-surface-1/40 p-4">
          <Pagination
            page={currentPage + 1}
            pageCount={totalPages}
            onPageChange={(page) => onPageChange(page - 1)}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZES}
            onPageSizeChange={onPageSizeChange}
            disabled={loading}
            status={`${t.jobs.paginationShowing} ${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, totalElements)} ${t.jobs.paginationOf} ${totalElements} ${t.jobs.paginationTasks}`}
            labels={{
              nav: t.insights.pagination.nav,
              previous: t.jobs.previous,
              next: t.jobs.next,
              page: (page) => fill(t.insights.pagination.page, { page }),
              compact: (page, count) => fill(t.insights.pagination.compact, { page, count }),
              pageSize: t.insights.pagination.pageSize,
            }}
          />
        </footer>
      )}
    </article>
  );
};
