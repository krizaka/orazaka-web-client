import * as React from "react";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";

import { cn } from "@krizaka/ui/cn";

/**
 * Properties required by the {@link MetricsGrid} component.
 */
interface MetricsGridProps {
  /** Object containing workspace utilization metrics. */
  metrics: {
    /** Total active concurrent chat sessions. */
    activeSessions: number;
    /** Cumulative token budget used. */
    tokensUsed: number;
    /** Total saved memory nodes. */
    memoryNodes: number;
  };
  /** Aesthetic CSS configuration for active accent colors. */
  accentClasses: {
    /** CSS text color class utility. */
    text: string;
  };
  /** Dictionary containing local dashboard translation string values. */
  t: {
    dashboard: {
      activeSessions: string;
      runningParallel: string;
      tokensUsed: string;
      estimatedCumulative: string;
      memoryNodes: string;
      contextSaved: string;
    };
  };
}

/** Animated count-up hook — renders target value immediately, then animates transitions */
function useCountUp(target: number, durationMs = 800): number {
  const [value, setValue] = React.useState(target);
  const prevTargetRef = React.useRef(target);
  const isFirstRenderRef = React.useRef(true);

  React.useEffect(() => {
    // Skip animation on first render — state already initialized with target
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevTargetRef.current = target;
      return;
    }

    const from = prevTargetRef.current;
    prevTargetRef.current = target;

    if (target <= 0 || from === target) {
      setValue(target <= 0 ? 0 : target);
      return;
    }

    const startTime = performance.now();
    let frameId: number;
    let cancelled = false;

    const animate = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [target, durationMs]);

  return value;
}

/** Single metric card definition */
interface MetricDef {
  icon: IconName;
  labelKey: "activeSessions" | "tokensUsed" | "memoryNodes";
  descKey: "runningParallel" | "estimatedCumulative" | "contextSaved";
  value: number;
  format: (v: number) => string;
  delta?: number; // percentage change
}

/**
 * MetricsGrid renders the top summary cards for active sessions, token counts, and memory nodes.
 * Features animated count-up values, mini trend arrows, and design-token-compliant styling.
 *
 * @param props - Component React properties.
 * @returns The React component representing the metrics grid display.
 */
export function MetricsGrid({ metrics, accentClasses, t }: Readonly<MetricsGridProps>) {
  const metricDefs: MetricDef[] = [
    {
      icon: "chat",
      labelKey: "activeSessions",
      descKey: "runningParallel",
      value: metrics.activeSessions,
      format: (v) => v.toString(),
      delta: 12,
    },
    {
      icon: "spark",
      labelKey: "tokensUsed",
      descKey: "estimatedCumulative",
      value: metrics.tokensUsed,
      format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString()),
      delta: 8,
    },
    {
      icon: "memory",
      labelKey: "memoryNodes",
      descKey: "contextSaved",
      value: metrics.memoryNodes,
      format: (v) => v.toLocaleString(),
      delta: -3,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metricDefs.map((metric) => (
        <MetricCard
          key={metric.labelKey}
          metric={metric}
          accentText={accentClasses.text}
          label={t.dashboard[metric.labelKey]}
          desc={t.dashboard[metric.descKey]}
        />
      ))}
    </div>
  );
}

/** Individual metric card with count-up animation and trend indicator */
function MetricCard({
  metric,
  accentText,
  label,
  desc,
}: {
  metric: MetricDef;
  accentText: string;
  label: string;
  desc: string;
}) {
  const animatedValue = useCountUp(metric.value);

  const deltaColor =
    metric.delta === undefined
      ? ""
      : metric.delta > 0
        ? "text-success"
        : metric.delta < 0
          ? "text-danger"
          : "text-fg-muted";

  const deltaArrow =
    metric.delta === undefined ? "" : metric.delta > 0 ? "↑" : metric.delta < 0 ? "↓" : "→";

  return (
    <article className="glass-card rounded-lg p-(--orazaka-space-card) hover:border-border-default hover-lift transition-all duration-200">
      {/* Header row */}
      <header className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
          {label}
        </span>
        <div className="p-1.5 rounded-sm bg-surface-2">
          <Icon name={metric.icon} size={14} className="text-fg-muted" />
        </div>
      </header>

      {/* Value with count-up animation */}
      <p className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-extrabold tracking-tight font-mono", accentText)}>
          {metric.format(animatedValue)}
        </span>
        {metric.delta !== undefined && (
          <span className={cn("text-xs font-semibold", deltaColor)}>
            {deltaArrow} {Math.abs(metric.delta)}%
          </span>
        )}
      </p>

      {/* Description */}
      <p className="text-[11px] text-fg-muted mt-1.5">{desc}</p>

      {/* Mini sparkline */}
      <svg
        viewBox="0 0 80 16"
        className="w-full h-3 mt-3 opacity-25"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,12 10,10 20,8 30,11 40,6 50,9 60,4 70,7 80,5"
          fill="none"
          stroke="var(--kz-accent)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </article>
  );
}
