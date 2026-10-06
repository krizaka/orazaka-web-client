"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { PipelineInterceptorRow } from "@/app/dashboard/admin/PipelineInterceptorRow";
import type { InterceptorConfig } from "@/app/dashboard/admin/pipelineConfig.types";

interface PipelineConfigCardProps {
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export function PipelineConfigCard({ fetchWithAuth }: Readonly<PipelineConfigCardProps>) {
  const { t } = useTranslation();
  const pl = t.admin.pipeline;

  const [interceptors, setInterceptors] = React.useState<InterceptorConfig[]>(
    [],
  );
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [dragIdx, setDragIdx] = React.useState<number | null>(null);
  const [dirty, setDirty] = React.useState(false);

  const showToast = React.useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  const loadConfig = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/v1/pipeline/interceptors");
      if (!res.ok) throw new Error(pl.errorLoading);
      const data: InterceptorConfig[] = await res.json();
      setInterceptors(data);
      setDirty(false);
    } catch {
      showToast("error", pl.errorLoading);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, pl, showToast]);

  React.useEffect(() => {
    const initConfig = async () => {
      await loadConfig();
    };
    initConfig();
  }, [loadConfig]);

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, overIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === overIdx) return;
    const updated = [...interceptors];
    const [dragged] = updated.splice(dragIdx, 1);
    updated.splice(overIdx, 0, dragged);
    const reordered = updated.map((item, i) => ({
      ...item,
      executionOrder: i + 1,
    }));
    setInterceptors(reordered);
    setDragIdx(overIdx);
    setDirty(true);
  };

  const handleDragEnd = () => setDragIdx(null);

  const handleToggle = (idx: number) => {
    setInterceptors((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, enabled: !item.enabled } : item,
      ),
    );
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetchWithAuth("/api/v1/pipeline/interceptors", {
        method: "PUT",
        body: JSON.stringify(interceptors),
      });
      if (!res.ok) throw new Error(pl.errorSaving);
      const saved: InterceptorConfig[] = await res.json();
      setInterceptors(saved);
      setDirty(false);
      showToast("success", pl.savedSuccess);
    } catch {
      showToast("error", pl.errorSaving);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm(pl.resetConfirm)) return;
    setSaving(true);
    try {
      const res = await fetchWithAuth(
        "/api/v1/pipeline/interceptors/reset",
        { method: "POST" },
      );
      if (!res.ok) throw new Error(pl.errorSaving);
      const defaults: InterceptorConfig[] = await res.json();
      setInterceptors(defaults);
      setDirty(false);
      showToast("success", pl.savedSuccess);
    } catch {
      showToast("error", pl.errorSaving);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-card-bg/70 border border-card-border rounded-2xl p-6 shadow-sm backdrop-blur-lg">
        <article className="animate-pulse space-y-3">
          <span className="h-5 w-56 bg-surface-3 dark:bg-surface-2 rounded block" />
          <span className="h-3 w-80 bg-surface-3 dark:bg-surface-2 rounded block" />
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-14 bg-surface-2 dark:bg-surface-1 rounded-xl block"
            />
          ))}
        </article>
      </section>
    );
  }

  return (
    <section className="bg-card-bg/70 border border-card-border rounded-2xl p-6 shadow-sm backdrop-blur-lg relative">
      {/* Toast */}
      {toast && (
        <aside
          className={`absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 ${
            toast.type === "success"
              ? "bg-status-success/40 text-status-success border border-status-success"
              : "bg-status-error/40 text-status-error border border-status-error"
          }`}
        >
          {toast.type === "success" ? (
            <Icon name="checkCircle" className="w-4 h-4" />
          ) : (
            <Icon name="alertCircle" className="w-4 h-4" />
          )}
          {toast.message}
        </aside>
      )}

      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <article>
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-status-warning/10 text-status-warning">
              ⚡
            </span>
            {pl.title}
          </h3>
          <p className="text-xs text-text-muted dark:text-text-secondary mt-0.5">
            {pl.subtitle}
          </p>
        </article>
        <nav className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border-subtle text-text-muted dark:text-text-secondary hover:bg-surface-2 dark:hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            <Icon name="refresh" className="w-3.5 h-3.5" />
            {pl.resetToDefault}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-status-warning hover:bg-status-warning text-white shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Icon name="loader" className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Icon name="save" className="w-3.5 h-3.5" />
            )}
            {saving ? pl.saving : pl.saveOrder}
          </button>
        </nav>
      </header>

      {/* Drag hint */}
      <div className="flex items-center gap-1.5 mb-3 text-[11px] text-text-secondary dark:text-text-muted">
        <Icon name="info" className="w-3 h-3" />
        {pl.dragHint}
      </div>

      {/* Interceptor list */}
      <ul className="space-y-1.5">
        {interceptors.map((item, idx) => (
          <PipelineInterceptorRow
            key={item.interceptorKey}
            item={item}
            idx={idx}
            dragIdx={dragIdx}
            disabledLabel={pl.disabled}
            enabledLabel={pl.enabledLabel}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onToggle={handleToggle}
          />
        ))}
      </ul>
    </section>
  );
}
