"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import type { InterceptorConfig } from "@/app/dashboard/admin/pipelineConfig.types";

import { cn } from "@krizaka/ui/cn";

interface PipelineInterceptorRowProps {
  item: InterceptorConfig;
  idx: number;
  dragIdx: number | null;
  disabledLabel: string;
  enabledLabel: string;
  onDragStart: (idx: number) => void;
  onDragOver: (e: React.DragEvent, idx: number) => void;
  onDragEnd: () => void;
  onToggle: (idx: number) => void;
}

/** Draggable, toggle-able interceptor row for the pipeline-config list. */
export function PipelineInterceptorRow({
  item,
  idx,
  dragIdx,
  disabledLabel,
  enabledLabel,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggle,
}: Readonly<PipelineInterceptorRowProps>) {
  return (
    <li
      data-selected={dragIdx === idx}
      aria-label={`Interceptor ${item.displayLabel}`}
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragOver={(e) => onDragOver(e, idx)}
      onDragEnd={onDragEnd}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing",
        (() => {
          if (dragIdx === idx) return "border-warning bg-warning/20 shadow-lg scale-[1.01]";
          if (item.enabled) return "border-border-subtle bg-surface-0 hover:border-border-subtle";
          return "border-border-subtle bg-surface-1/50 opacity-60";
        })()
      )}
    >
      {/* Drag handle */}
      <div className="flex-shrink-0 text-fg-muted group-hover:text-fg-secondary transition-colors">
        <Icon name="grip" className="w-4 h-4" />
      </div>

      {/* Order badge */}
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md bg-warning/10 text-warning text-[11px] font-bold tabular-nums">
        {item.executionOrder}
      </span>

      {/* Label & description */}
      <article className="flex-1 min-w-0">
        <header className="flex items-center gap-2">
          <span className="text-sm font-semibold text-fg truncate">
            {item.displayLabel}
          </span>
          <span className="text-fg-muted font-mono text-fg-secondary hidden sm:inline">
            {item.interceptorKey}
          </span>
        </header>
        {item.description && (
          <p className="text-fg-muted text-fg-secondary truncate mt-0.5">
            {item.description}
          </p>
        )}
      </article>

      {/* Disabled badge */}
      {!item.enabled && (
        <span className="flex-shrink-0 text-fg-muted font-semibold uppercase tracking-wider text-fg-secondary bg-surface-2 px-2 py-0.5 rounded-full">
          {disabledLabel}
        </span>
      )}

      {/* Toggle */}
      <button
        onClick={() => onToggle(idx)}
        className={cn(
          "relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200",
          item.enabled ? "bg-warning" : "bg-surface-3"
        )}
        aria-label={`${enabledLabel} ${item.displayLabel}`}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-fg-on-media shadow-sm transition-transform duration-200",
            item.enabled ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </li>
  );
}
