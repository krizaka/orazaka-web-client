"use client";

import * as React from "react";
import type { JobModalProps } from "@/app/dashboard/jobs/jobModal.types";
import { Button, Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { ResultDisplay } from "@/app/dashboard/jobs/ResultDisplay";
import {
  ProgressTimeline,
  StageLabels,
  StatusPill,
  LiveElapsed,
  PillTab,
} from "./JobModalParts";
import type { TabKey } from "./JobModalParts";
import { JOB_STATUS } from "@/core/constants/http.constants";

/* ═══════════════════════════════════════════════
   MAIN MODAL COMPONENT
   ═══════════════════════════════════════════════ */
export const JobModal: React.FC<JobModalProps> = ({
  job,
  modalType,
  onClose,
  copiedId,
  onCopy,
}) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = React.useState<TabKey>(
    modalType === "result" ? "result" : "payload",
  );

  /* Keyboard shortcuts: Esc to close, ←/→ to switch tabs */
  React.useEffect(() => {
    if (!job) return;

    const tabs: TabKey[] = ["payload"];
    if (job.status === JOB_STATUS.COMPLETED) tabs.push("result");
    if (job.status === JOB_STATUS.FAILED && job.errorMessage) tabs.push("error");

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const curIdx = tabs.indexOf(activeTab);
        const nextIdx = Math.max(0, Math.min(tabs.length - 1, curIdx + dir));
        setActiveTab(tabs[nextIdx]);
      }
    };

    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [job, activeTab, onClose]);

  if (!job || !modalType) return null;

  const getDisplayData = () => {
    if (activeTab === "payload") return JSON.stringify(job.payload, null, 2);
    if (activeTab === "result") return JSON.stringify(job.result, null, 2);
    return job.errorMessage || "No error details available";
  };

  const dataToDisplay = getDisplayData();
  const isLive = job.status === JOB_STATUS.PROCESSING || job.status === JOB_STATUS.PENDING;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-in fade-in duration-200 w-full h-full m-0 max-w-none max-h-none border-none bg-transparent"
      aria-label={`Job ${job.id} details`}
    >
      {/* Backdrop dismiss button — accessible and native */}
      <button
        type="button"
        className="fixed inset-0 w-full h-full bg-transparent border-none cursor-default"
        aria-label={t.a11y.closeDialog}
        onClick={onClose}
      />
      <article
        className="glass-card rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-3 duration-300 text-fg relative z-10"
      >
        {/* ── Header ── */}
        <header className="flex items-center justify-between p-5 border-b border-border-subtle">
          <section className="flex items-center gap-3">
            <StatusPill status={job.status} />
            <section className="flex flex-col">
              <h3 className="font-semibold text-[13px] text-fg">
                {t.jobs?.title || "Task Details"}
              </h3>
              <span className="text-[10px] text-fg-muted font-mono">
                {job.featureKey}
              </span>
            </section>
          </section>
          <section className="flex items-center gap-3">
            <LiveElapsed
              createdAt={job.createdAt}
              updatedAt={job.updatedAt}
              isLive={isLive}
            />
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-2 text-fg-muted hover:text-fg transition-all duration-150"
              aria-label={t.a11y.closeDetails}
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </section>
        </header>

        {/* ── Progress Timeline ── */}
        <section className="px-5 py-3 border-b border-border-subtle">
          <ProgressTimeline status={job.status} />
          <StageLabels status={job.status} />
        </section>

        {/* ── Pill Tabs ── */}
        <section className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border-subtle bg-surface-0/50">
          <PillTab
            label={t.jobs?.payloadModalTitle || "Input"}
            icon="fileJson"
            isActive={activeTab === "payload"}
            onClick={() => setActiveTab("payload")}
          />
          {job.status === JOB_STATUS.COMPLETED && (
            <PillTab
              label={t.jobs?.resultModalTitle || "Output"}
              icon="fileOutput"
              isActive={activeTab === "result"}
              onClick={() => setActiveTab("result")}
            />
          )}
          {job.status === JOB_STATUS.FAILED && job.errorMessage && (
            <PillTab
              label={t.jobs?.errorDetails || "Error"}
              icon="warning"
              isActive={activeTab === "error"}
              variant="error"
              onClick={() => setActiveTab("error")}
            />
          )}
          {/* Keyboard hint */}
          <span className="ml-auto text-[9px] text-fg-muted font-mono hidden sm:inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border-subtle text-[8px]">
              ←
            </kbd>{" "}
            <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border-subtle text-[8px]">
              →
            </kbd>{" "}
            switch
          </span>
        </section>

        {/* ── Content ── */}
        <section className="p-5 overflow-y-auto flex-1 space-y-4 scrollbar-thin">
          {/* Meta bar */}
          <section className="flex flex-wrap items-center justify-between gap-3 text-[11px] glass-card p-3 rounded-xl">
            <section className="flex items-center gap-2">
              <span className="font-semibold text-fg-muted">ID</span>
              <span className="font-mono text-fg-secondary bg-surface-2 px-2 py-0.5 rounded-md">
                {job.id}
              </span>
            </section>
            <button
              onClick={() => onCopy(String(job.id), "modal-id")}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors"
            >
              {copiedId === "modal-id" ? (
                <Icon name="check" className="w-3 h-3 text-success" />
              ) : (
                <Icon name="copy" className="w-3 h-3" />
              )}
              {copiedId === "modal-id" ? t.jobs?.copied || "Copied" : "Copy ID"}
            </button>
          </section>

          {activeTab === "result" ? (
            <section className="flex flex-col gap-4">
              <section className="p-4 rounded-xl border border-border-subtle bg-surface-2">
                <ResultDisplay payload={job.result} />
              </section>
              <details className="text-[11px] text-fg-muted">
                <summary className="cursor-pointer select-none font-semibold hover:text-fg-secondary transition-colors">
                  Show Raw JSON Output
                </summary>
                <section className="relative mt-2">
                  <pre className="bg-surface-2 text-fg p-4 rounded-xl overflow-auto text-[11px] font-mono max-h-64 leading-relaxed border border-border-subtle scrollbar-thin">
                    {dataToDisplay}
                  </pre>
                  <button
                    onClick={() => onCopy(dataToDisplay, "modal-json")}
                    className="absolute top-3 right-3 p-1.5 bg-surface-3 hover:bg-surface-3 border border-border-subtle text-fg-muted hover:text-fg rounded-lg transition-colors"
                  >
                    {copiedId === "modal-json" ? (
                      <Icon name="check" className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Icon name="copy" className="w-3.5 h-3.5" />
                    )}
                  </button>
                </section>
              </details>
            </section>
          ) : (
            <section className="relative">
              <pre className="bg-surface-2 text-fg p-4 rounded-xl overflow-auto text-[11px] font-mono max-h-96 leading-relaxed border border-border-subtle scrollbar-thin">
                {dataToDisplay}
              </pre>
              <button
                onClick={() => onCopy(dataToDisplay, "modal-json")}
                className="absolute top-3 right-3 p-1.5 bg-surface-3 hover:bg-surface-3 border border-border-subtle text-fg-muted hover:text-fg rounded-lg transition-colors"
              >
                {copiedId === "modal-json" ? (
                  <Icon name="check" className="w-3.5 h-3.5 text-success" />
                ) : (
                  <Icon name="copy" className="w-3.5 h-3.5" />
                )}
              </button>
            </section>
          )}
        </section>

        {/* ── Footer ── */}
        <footer className="flex justify-between items-center gap-3 p-4 border-t border-border-subtle">
          <span className="text-[9px] text-fg-muted font-mono hidden sm:block">
            <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border-subtle text-[8px]">
              Esc
            </kbd>{" "}
            close
          </span>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-[11px] font-semibold border-border-default"
          >
            {t.admin?.cancel || "Close"}
          </Button>
        </footer>
      </article>
    </dialog>
  );
};
