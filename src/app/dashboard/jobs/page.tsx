"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/core/context/LocaleContext";
import { useJobStream } from "@/core/context/JobStreamContext";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { Job } from "@/core/types/jobs.types";
import { Button, Icon } from "@krizaka/orazaka-design-system";
import { JobsTable } from "./JobsTable";
import { JobsKpiSummary } from "./JobsKpiSummary";
import { JobModal } from "./JobModal";
import { JobsFilterBar } from "./JobsFilterBar";
import { Suspense } from "react";
import { getSession } from "next-auth/react";
import { JOB_STATUS } from "@/core/constants/http.constants";

const FEATURE_DISPLAY_MAP: Record<string, string> = {
  video: "video",
  image: "image",
  speech: "speech",
};

const getFeatureDisplayName = (key: string): string => {
  const match = Object.keys(FEATURE_DISPLAY_MAP).find((k) => key.includes(k));
  return match ? FEATURE_DISPLAY_MAP[match] : "text";
};

function JobsDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetJobId = searchParams.get("jobId");

  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const { jobs: liveJobs, refreshJobs } = useJobStream();

  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const {
    jobs: pageJobs,
    totalPages,
    totalElements,
    isLoading: loading,
    refresh: refreshJobsQuery,
  } = useJobs(currentPage, pageSize, isAuthenticated);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<
    "all" | "active" | "completed" | "failed"
  >("all");

  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [modalType, setModalType] = React.useState<"payload" | "result" | null>(
    null,
  );

  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  const pageData = React.useMemo(() => {
    return pageJobs.map((j) => liveJobs.find((l) => l.id === j.id) || j);
  }, [pageJobs, liveJobs]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredJobs = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return pageData.filter((job) => {
      const display = getFeatureDisplayName(job.featureKey);
      const match =
        job.featureKey.toLowerCase().includes(query) ||
        display.toLowerCase().includes(query) ||
        job.id.toLowerCase().includes(query);
      if (!match) return false;
      if (activeTab === "active")
        return job.status === JOB_STATUS.PENDING || job.status === JOB_STATUS.PROCESSING;
      if (activeTab === "completed") return job.status === JOB_STATUS.COMPLETED;
      if (activeTab === "failed") return job.status === JOB_STATUS.FAILED;
      return true;
    });
  }, [pageData, searchQuery, activeTab]);

  const handleRefresh = async () => {
    await refreshJobs();
    refreshJobsQuery();
  };

  const handleOpenModal = (job: Job, type: "payload" | "result") => {
    setSelectedJob(job);
    setModalType(type);
  };

  // Auto-open modal when jobId is present in search parameters
  React.useEffect(() => {
    if (targetJobId) {
      const foundJob =
        liveJobs.find((j) => j.id === targetJobId) ||
        pageJobs.find((j) => j.id === targetJobId);
      if (foundJob) {
        const timer = setTimeout(() => {
          setSelectedJob(foundJob);
          setModalType(foundJob.status === JOB_STATUS.COMPLETED ? "result" : "payload");
        }, 0);
        return () => clearTimeout(timer);
      } else {
        getSession()
          .then((session) => {
            const headers: Record<string, string> = {};
            if (session?.user?.id) {
              headers["Authorization"] = `Bearer ${session.user.id}`;
            }
            return fetch(`/api/v1/jobs/${targetJobId}`, { headers });
          })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Job not found");
          })
          .then((job) => {
            setSelectedJob(job);
            setModalType(job.status === JOB_STATUS.COMPLETED ? "result" : "payload");
          })
          .catch((err) => {
            console.error("Failed to auto-load job details from URL:", err);
          });
      }
    }
  }, [targetJobId, liveJobs, pageJobs]);

  if (isLoading || !isAuthenticated) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-text-secondary dark:text-text-muted text-sm animate-pulse">
          {t.dashboard.loading}
        </span>
      </section>
    );
  }

  return (
    <section className="flex h-screen overflow-hidden bg-background transition-colors duration-200">
      <Sidebar />

      <section className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6 scrollbar-thin ambient-grid">
          <section className="mx-auto max-w-6xl space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Header controls */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
                  {t.jobs?.title || "My Tasks"}
                </h2>
                <p className="text-text-muted dark:text-text-secondary text-sm">
                  {t.jobs?.subtitle ||
                    "Track your asynchronous AI runs and background jobs in real-time."}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="rounded-xl flex items-center space-x-2 text-sm font-semibold border-border-subtle dark:hover:bg-surface-1 transition-colors"
                >
                  <Icon name="refresh"
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>{t.jobs.refresh}</span>
                </Button>
              </div>
            </header>

            {/* Filters panel */}
            <JobsFilterBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              t={t}
            />

            {/* AI Consumption KPIs */}
            <JobsKpiSummary jobs={filteredJobs} />

            {/* Jobs Table */}
            <JobsTable
              jobs={filteredJobs}
              loading={loading}
              totalPages={totalPages}
              totalElements={totalElements}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(0);
              }}
              onOpenModal={handleOpenModal}
              copiedId={copiedId}
              onCopy={handleCopy}
            />
          </section>
        </main>
      </section>

      {/* JSON Payload Inspection Modal */}
      <JobModal
        key={`${selectedJob?.id}-${modalType}`}
        job={selectedJob}
        modalType={modalType}
        onClose={() => {
          setSelectedJob(null);
          setModalType(null);
        }}
        copiedId={copiedId}
        onCopy={handleCopy}
      />
    </section>
  );
}

export default function JobsDashboardPage() {
  return (
    <Suspense fallback={null}>
      <JobsDashboardContent />
    </Suspense>
  );
}
