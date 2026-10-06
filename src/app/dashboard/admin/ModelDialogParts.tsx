"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { MODEL_CATEGORY } from "@/core/constants/capability.constants";

/* ─── Category metadata ─── */
export const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  [MODEL_CATEGORY.SPEECH]: {
    icon: "🎙️",
    color:
      "bg-accent/10 border-accent/20 text-accent",
  },
  [MODEL_CATEGORY.IMAGE]: {
    icon: "🎨",
    color:
      "bg-status-success/10 border-status-success/20 text-status-success",
  },
  [MODEL_CATEGORY.VIDEO]: {
    icon: "🎬",
    color: "bg-accent/10 border-accent/20 text-accent",
  },
  [MODEL_CATEGORY.VISION]: {
    icon: "👁️",
    color:
      "bg-status-warning/10 border-status-warning/20 text-status-warning",
  },
  [MODEL_CATEGORY.AUDIO]: {
    icon: "🔊",
    color: "bg-accent/10 border-accent/20 text-accent",
  },
  theme: {
    icon: "🎨",
    color: "bg-status-error/10 border-status-error/20 text-status-error",
  },
  code: {
    icon: "⚡",
    color: "bg-accent/10 border-accent/20 text-accent",
  },
};

/* ─── Tooltip ─── */
export function Tooltip({ text }: Readonly<{ text: string }>) {
  const [show, setShow] = React.useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        aria-label="Help"
      >
        <Icon name="info" className="h-3.5 w-3.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-[11px] leading-snug rounded-lg bg-[var(--surface-3)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-lg max-w-52 text-center z-50 animate-in fade-in zoom-in-95 duration-150 whitespace-normal">
          {text}
        </span>
      )}
    </span>
  );
}

/* ─── Category Selector Grid ─── */
export function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
  disabled,
}: Readonly<{
  categories: { value: string; label: string }[];
  selectedCategory: string;
  onSelect: (value: string) => void;
  disabled: boolean;
}>) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat.value] || CATEGORY_META.code;
        const isSelected = selectedCategory === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(cat.value)}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
              isSelected
                ? `${meta.color} border-current shadow-sm scale-[1.02]`
                : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:bg-[var(--surface-2)]"
            }`}
          >
            <span className="text-base">{meta.icon}</span>
            <span className="truncate w-full text-center leading-tight">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
