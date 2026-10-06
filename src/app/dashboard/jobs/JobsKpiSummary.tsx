/* eslint-disable */
"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { Job } from "@/core/types/jobs.types";
import { useTranslation } from "@/core/context/LocaleContext";
import { computeJobStats } from "./jobStats.utils";
import { AnimatedCounter } from "./AnimatedCounter";

interface JobsKpiSummaryProps {
  jobs: Job[];
}

interface CardDef {
  icon: React.ReactNode;
  label: string;
  value: number;
  valueSuffix: string;
  displayOverride?: string;
  sub: string;
  gradient: string;
  glow: string;
  iconBg: string;
  accent: string;
}

/**
 * Aggregated KPI summary banner with Jarvis-grade glassmorphism.
 * Each card features animated counters, gradient borders, and glow effects.
 */
export const JobsKpiSummary: React.FC<JobsKpiSummaryProps> = ({ jobs }) => {
  const { t } = useTranslation();
  const stats = React.useMemo(() => computeJobStats(jobs), [jobs]);

  const cards: CardDef[] = [
    {
      icon: <Icon name="activity" className="w-4 h-4" />,
      label: t.jobs.kpiTotalJobs,
      value: stats.total,
      valueSuffix: "",
      sub: `${stats.completed} completed`,
      gradient: "from-surface-3/20 via-surface-3/10 to-transparent",
      glow: "shadow-surface-3/5",
      iconBg: "bg-surface-3/10",
      accent: "text-text-primary",
    },
    {
      icon: <Icon name="trendingUp" className="w-4 h-4" />,
      label: t.jobs.kpiSuccessRate,
      value:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      valueSuffix: "%",
      sub: `${stats.failed} failed`,
      gradient:
        stats.completed / Math.max(stats.total, 1) > 0.8
          ? "from-status-success/20 via-status-success/5 to-transparent"
          : "from-status-warning/20 via-status-warning/5 to-transparent",
      glow:
        stats.completed / Math.max(stats.total, 1) > 0.8
          ? "shadow-status-success/10"
          : "shadow-status-warning/10",
      iconBg:
        stats.completed / Math.max(stats.total, 1) > 0.8
          ? "bg-status-success/10"
          : "bg-status-warning/10",
      accent:
        stats.completed / Math.max(stats.total, 1) > 0.8
          ? "text-status-success"
          : "text-status-warning",
    },
    {
      icon: <Icon name="timer" className="w-4 h-4" />,
      label: "Avg. Duration",
      value: stats.avgMs,
      valueSuffix: "",
      displayOverride: stats.avgDuration,
      sub: `max ${stats.maxDuration}`,
      gradient: "from-accent/20 via-accent/5 to-transparent",
      glow: "shadow-accent/10",
      iconBg: "bg-accent/10",
      accent: "text-accent",
    },
    {
      icon: <Icon name="cpu" className="w-4 h-4" />,
      label: t.jobs.kpiModelsUsed,
      value: stats.uniqueModels,
      valueSuffix: "",
      sub: stats.topModel || "—",
      gradient: "from-accent/20 via-accent/5 to-transparent",
      glow: "shadow-accent/10",
      iconBg: "bg-accent/10",
      accent: "text-accent",
    },
    {
      icon: <Icon name="chartBar" className="w-4 h-4" />,
      label: t.jobs.kpiCapabilities,
      value: stats.uniqueFeatures,
      valueSuffix: "",
      sub: stats.topFeature || "—",
      gradient: "from-status-warning/20 via-status-warning/5 to-transparent",
      glow: "shadow-status-warning/10",
      iconBg: "bg-status-warning/10",
      accent: "text-status-warning",
    },
    {
      icon: <Icon name="zap" className="w-4 h-4" />,
      label: t.jobs.kpiTotalInference,
      value: stats.totalMs,
      valueSuffix: "",
      displayOverride: stats.totalDuration,
      sub: `across ${stats.completed} jobs`,
      gradient: "from-accent/20 via-accent/5 to-transparent",
      glow: "shadow-accent/10",
      iconBg: "bg-accent/10",
      accent: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`
            group relative overflow-hidden
            flex flex-col gap-1.5 p-4 rounded-2xl
            bg-white/[0.03] dark:bg-white/[0.02]
            border border-white/[0.06]
            backdrop-blur-xl
            ${card.glow} shadow-lg
            transition-all duration-300
            hover:scale-[1.03] hover:shadow-xl
            hover:border-white/[0.12]
            hover:bg-white/[0.05]
          `}
          style={{
            animationDelay: `${i * 60}ms`,
          }}
        >
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Content */}
          <section className="relative z-10 flex flex-col gap-1.5">
            {/* Icon + Label */}
            <header className="flex items-center gap-1.5">
              <figure
                className={`${card.iconBg} p-1 rounded-md ${card.accent} transition-transform duration-300 group-hover:scale-110`}
              >
                {card.icon}
              </figure>
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-text-muted dark:text-text-secondary">
                {card.label}
              </span>
            </header>

            {/* Value */}
            <figure
              className={`text-xl font-black tracking-tight ${card.accent} transition-colors duration-300`}
            >
              {card.displayOverride ? (
                card.displayOverride
              ) : (
                <AnimatedCounter value={card.value} suffix={card.valueSuffix} />
              )}
            </figure>

            {/* Sub text */}
            <footer className="text-[10px] text-text-muted font-medium truncate">
              {card.sub}
            </footer>
          </section>

          {/* Glow dot */}
          <div
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${card.accent.replace("text-", "bg-")} opacity-40 blur-[2px] group-hover:opacity-70 transition-opacity duration-500`}
          />
        </div>
      ))}
    </div>
  );
};
