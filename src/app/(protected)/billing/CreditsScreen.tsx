"use client";

import * as React from "react";
import Link from "next/link";
import { PackIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { useTranslation } from "@/core/context/LocaleContext";
import { CreditsMeter } from "@/features/billing/components/CreditsMeter";
import { usePlan } from "@/features/billing/hooks/usePlan";
import { useWallet } from "@/features/billing/hooks/useWallet";
import { ActivityCharts } from "@/features/insights/components/ActivityCharts";
import { StudiosUsedChart, TimeToResultChart } from "@/features/insights/components/UsageCharts";
import { useInsights } from "@/features/insights/hooks/useInsights";
import { useStudios } from "@/features/studio/hooks/useStudios";

/**
 * Credits & usage: the balance and where it comes from (billing), then what the work used — jobs per day, kinds,
 * Studios, time to a result (the person's own jobs and runs). Composed here, at the app layer, because one feature
 * never imports another (dependency-cruiser, no-feature-cross-import).
 */
export function CreditsScreen() {
  const { t } = useTranslation();
  const w = t.insights;
  const { wallet, available, isLoading: walletLoading } = useWallet();
  const { plan } = usePlan();
  const { jobs, runs, isLoading, hasError } = useInsights();
  const { studios } = useStudios(null);
  const studioLabel = React.useCallback((key: string) => studios.find((s) => s.studioKey === key)?.label ?? key, [studios]);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <span className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-fg">{w.credits.title}</h1>
          <p className="text-sm text-fg-secondary">{w.credits.subtitle}</p>
        </span>
        <Button asChild variant="primary" size="sm">
          <Link href="/packs">
            <PackIcon size={15} />
            {w.credits.getCredits}
          </Link>
        </Button>
      </header>

      <CreditsMeter wallet={wallet} available={available} plan={plan} loading={walletLoading} />

      <section className="flex flex-col gap-4" aria-labelledby="usage-title">
        <header className="flex flex-col gap-1 px-1">
          <h2 id="usage-title" className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{w.activityTitle}</h2>
          <p className="text-[13px] text-fg-secondary">{w.activityDesc}</p>
        </header>
        <ActivityCharts jobs={jobs} loading={isLoading} error={hasError} days={30} />
        <section className="grid gap-4 lg:grid-cols-2">
          <StudiosUsedChart runs={runs} studioLabel={studioLabel} loading={isLoading} error={hasError} />
          <TimeToResultChart jobs={jobs} loading={isLoading} error={hasError} />
        </section>
        <p className="px-1 text-xs text-fg-muted">{w.credits.noTokens}</p>
      </section>
    </article>
  );
}
