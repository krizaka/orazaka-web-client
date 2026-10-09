"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useAuth } from "@/core/hooks/useAuth";
import type { Job } from "@/core/types/jobs.types";
import { JobsApi } from "@/services/jobs.api";
import { toast } from "@krizaka/ui/toast";
import { parseISO } from "date-fns";
import { useChatStreamClient } from "@/core/hooks/useChatStreamClient";
import { useJobSSE } from "@/core/hooks/useJobSSE";
import { useJobReconciliation } from "@/core/hooks/useJobReconciliation";
import { JOB_STATUS } from "@/core/constants/http.constants";
import type { JobStreamContextType } from "@/core/context/jobStream.types";
import { usePlaygroundState } from "@/core/hooks/usePlaygroundState";

const JobStreamContext = createContext<JobStreamContextType | undefined>(
  undefined,
);

/**
 * Global React Context Provider establishing a persistent EventSource stream
 * pointing to the BFF proxy. Tracks and broadcasts all async task progress.
 */
export function JobStreamProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobProgress, setJobProgress] = useState<Record<string, number>>({});
  const jobsRef = useRef<Job[]>([]);
  useEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);

  const [activeConversationId, setActiveConversationId] = useState<string>("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveConversationId("");
  }, [user?.id, isAuthenticated]);

  const {
    playgroundInputs,
    setPlaygroundInput,
    playgroundResults,
    setPlaygroundResult,
    activeJobIdByNodeId,
    setActiveJobIdForNode,
  } = usePlaygroundState();
  const [videoAnalysisJobId, setVideoAnalysisJobId] = useState<string | null>(
    null,
  );

  const [chatInput, setChatInput] = useState<string>("");
  const {
    isChatStreaming,
    chatPipeline,
    chatStageProgress,
    startChatStream,
    stopChatStream,
  } = useChatStreamClient();

  const [videoAnalysisIsUploading, setVideoAnalysisIsUploading] =
    useState<boolean>(false);
  const [videoAnalysisError, setVideoAnalysisError] = useState<string | null>(
    null,
  );

  const [ragQuery, setRagQuery] = useState<string>("");
  const [ragResult, setRagResult] = useState<string | null>(null);
  const [ragIsPending, setRagIsPending] = useState<boolean>(false);
  const [ragError, setRagError] = useState<string | null>(null);

  const activeJobsCount = jobs.filter(
    (j) => j.status === JOB_STATUS.PENDING || j.status === JOB_STATUS.PROCESSING,
  ).length;

  const lastJobs = [...jobs]
    .sort(
      (a, b) =>
        parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime(),
    )
    .slice(0, 5);

  /** A job's progression, announced by the platform Toaster (mounted once in Providers). */
  const addToast = React.useCallback((message: string, type: "info" | "success" | "error") => {
    toast[type](message, { duration: 5000 });
  }, []);

  const fetchJobs = React.useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const pageData = await JobsApi.fetchPage(0, 20);
      setJobs(pageData.content);
      const initialProgress: Record<string, number> = {};
      pageData.content.forEach((job) => {
        if (job.progress !== undefined) {
          initialProgress[job.id] = job.progress;
        }
      });
      setJobProgress(initialProgress);
    } catch (err) {
      console.error("Failed to load jobs history", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchJobs();
    } else {
       
      setJobs([]);
    }
  }, [isAuthenticated, fetchJobs]);

  const hasActiveJobs = activeJobsCount > 0;

  const handleJobUpdate = React.useCallback((updatedJob: Job) => {
    setJobs((prev) => {
      const index = prev.findIndex((j) => j.id === updatedJob.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedJob;
        return updated;
      }
      return [updatedJob, ...prev];
    });
  }, []);

  const handleJobProgress = React.useCallback(
    (jobId: string, progress: number) => {
      setJobs((prev) => {
        const index = prev.findIndex((j) => j.id === jobId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], progress };
          return updated;
        }
        return prev;
      });
      setJobProgress((prev) => ({ ...prev, [jobId]: progress }));
    },
    [],
  );

  useJobSSE(isAuthenticated, hasActiveJobs, {
    onJobUpdate: handleJobUpdate,
    onJobProgress: handleJobProgress,
    onToast: addToast,
    getJobs: () => jobsRef.current,
  });

  // Safety net for missed SSE events: re-sync the job list from the DB on tab
  // focus and while jobs are in flight, so completions are never lost.
  useJobReconciliation(isAuthenticated, hasActiveJobs, fetchJobs);

  const contextValue = useMemo<JobStreamContextType>(() => ({
    jobs,
    activeJobsCount,
    lastJobs,
    refreshJobs: fetchJobs,
    activeConversationId,
    setActiveConversationId,
    playgroundInputs,
    setPlaygroundInput,
    playgroundResults,
    setPlaygroundResult,
    activeJobIdByNodeId,
    setActiveJobIdForNode,
    videoAnalysisJobId,
    setVideoAnalysisJobId,
    chatInput,
    setChatInput,
    isChatStreaming,
    chatPipeline,
    chatStageProgress,
    startChatStream,
    stopChatStream,
    videoAnalysisIsUploading,
    setVideoAnalysisIsUploading,
    videoAnalysisError,
    setVideoAnalysisError,
    ragQuery,
    setRagQuery,
    ragResult,
    setRagResult,
    ragIsPending,
    setRagIsPending,
    ragError,
    setRagError,
    jobProgress,
  }), [
    jobs, activeJobsCount, lastJobs, fetchJobs,
    activeConversationId, playgroundInputs, setPlaygroundInput,
    playgroundResults, setPlaygroundResult, activeJobIdByNodeId,
    setActiveJobIdForNode, videoAnalysisJobId, chatInput, isChatStreaming,
    chatPipeline, chatStageProgress, startChatStream, stopChatStream,
    videoAnalysisIsUploading,
    videoAnalysisError, ragQuery, ragResult, ragIsPending, ragError,
    jobProgress,
  ]);

  return (
    <JobStreamContext.Provider value={contextValue}>
      {children}
    </JobStreamContext.Provider>
  );
}

export function useJobStream() {
  const context = useContext(JobStreamContext);
  if (context === undefined) {
    throw new Error("useJobStream must be used within a JobStreamProvider");
  }
  return context;
}
