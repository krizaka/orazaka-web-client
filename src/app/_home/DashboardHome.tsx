"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Skeleton, Icon } from "@krizaka/orazaka-design-system";
import { useAuth } from "@/core/hooks/useAuth";
import { Greeting } from "@/core/components/Greeting";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/core/context/LocaleContext";
import { useChatStream } from "@/features/chat-session/hooks/useChatStream";
import { useWallet } from "@/features/billing/hooks/useWallet";
import { useInstallations } from "@/features/studio/hooks/useInstallations";
import { InterceptorPipeline } from "@/features/dashboard/components/InterceptorPipeline";
import { WorkspaceSummary } from "@/features/dashboard/components/WorkspaceSummary";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentSessions } from "@/features/dashboard/components/RecentSessions";
import { JobsGallery } from "@/app/dashboard/jobs/JobsGallery";
import { CreditsMeter } from "@/features/billing/components/CreditsMeter";
import { usePlan } from "@/features/billing/hooks/usePlan";
import { ActivityCharts } from "@/features/insights/components/ActivityCharts";
import { StudiosUsedChart } from "@/features/insights/components/UsageCharts";
import { useInsights } from "@/features/insights/hooks/useInsights";
import { useStudios } from "@/features/studio/hooks/useStudios";
import { jobMediaUrl } from "@/core/jobs/jobMedia";
import { ChatIcon, ImageIcon, StudioIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import Link from "next/link";
import { INTL_LOCALES } from "@/core/constants/locale.constants";

const DATE_LOCALES = { fr, en: enUS } as const;

/**
 * The signed-in home: greeting, the interceptor pipeline (admins), the workspace's real figures, the credits and
 * the charts of the person's own work (jobs per day, kinds, Studios used), the latest creations, quick actions and
 * the latest conversations.
 */
export function DashboardHome() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { locale, t } = useTranslation();
  const { threads } = useChatStream("dashboard");
  const { wallet, available, isLoading: walletLoading } = useWallet();
  const { installations } = useInstallations();
  const { jobs, runs, isLoading: insightsLoading, hasError } = useInsights(isAuthenticated);
  const { plan } = usePlan(isAuthenticated);
  const { studios } = useStudios(null);
  const studioLabel = React.useCallback((key: string) => studios.find((s) => s.studioKey === key)?.label ?? key, [studios]);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  // Deferred creation: land in the empty composer; the thread is persisted only
  // once the first message is sent (avoids empty threads).
  const handleStartNewChat = () => router.push("/chat");

  const formatDate = (timestamp: number) => {
    try {
      return format(timestamp, "MMM d, HH:mm", { locale: DATE_LOCALES[locale] });
    } catch {
      return "";
    }
  };

  // Time-of-day greeting icon (SVG, not emoji — governance §4/§8).
  const greetingIcon = new Date().getHours() < 18 ? "sun" : "moon";

  if (isLoading || !isAuthenticated) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-surface-0 ambient-grid">
        <article className="w-full max-w-6xl px-6 space-y-8">
          <Skeleton variant="text" width="40%" height="2rem" />
          <Skeleton variant="rect" height="5rem" />
          <section className="grid gap-6 md:grid-cols-3">
            <Skeleton variant="rect" height="8rem" />
            <Skeleton variant="rect" height="8rem" />
            <Skeleton variant="rect" height="8rem" />
          </section>
        </article>
      </section>
    );
  }

  const recentThreads = [...(threads || [])].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);

  return (
    <section className="flex h-screen overflow-hidden bg-surface-0 transition-colors duration-200">
      <Sidebar />

      <section className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6 scrollbar-thin ambient-grid">
          <article className="mx-auto max-w-6xl space-y-6 stagger-children">
            <header className="flex items-baseline justify-between">
              <section className="space-y-1">
                <h2 className="fluid-2xl font-bold tracking-tight text-fg flex items-center gap-2">
                  <Icon name={greetingIcon} className="h-6 w-6 text-accent" />
                  <span>
                    <Greeting />
                  </span>
                </h2>
                <p className="text-fg-secondary fluid-sm">{t.dashboard.overview}</p>
              </section>
              <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-1 px-2.5 py-1 text-[11px] font-medium text-fg-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
                {t.dashboard.sovereignBadge}
              </span>
            </header>

            {user?.role === "admin" && <InterceptorPipeline />}

            <WorkspaceSummary
              figures={{
                conversations: threads?.length ?? 0,
                credits: wallet ? available : null,
                studios: installations.length,
              }}
              locale={INTL_LOCALES[locale]}
              labels={t.dashboard}
            />

            <ActivityCharts jobs={jobs} loading={insightsLoading} error={hasError} />

            <section className="grid gap-4 lg:grid-cols-2">
              <CreditsMeter wallet={wallet} available={available} plan={plan} loading={walletLoading} href="/billing" />
              <StudiosUsedChart runs={runs} studioLabel={studioLabel} loading={insightsLoading} error={hasError} />
            </section>

            {jobs.some((job) => jobMediaUrl(job)) && (
              <section className="flex flex-col gap-3">
                <header className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{t.showcase.dashboard.latestCreations}</h3>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/dashboard/jobs">{t.showcase.dashboard.seeAll}</Link>
                  </Button>
                </header>
                <JobsGallery jobs={jobs} limit={3} onOpen={(job) => router.push(`/dashboard/jobs?jobId=${job.id}`)} />
              </section>
            )}

            <section className="grid gap-6 md:grid-cols-3">
              <QuickActions
                title={t.dashboard.quickActions}
                actions={[
                  { icon: ChatIcon, label: t.dashboard.startNewChat, desc: t.dashboard.startNewChatDesc, onClick: handleStartNewChat },
                  { icon: StudioIcon, label: t.showcase.dashboard.studios, desc: t.showcase.dashboard.studiosDesc, onClick: () => router.push("/studios") },
                  { icon: ImageIcon, label: t.showcase.dashboard.creations, desc: t.showcase.dashboard.creationsDesc, onClick: () => router.push("/dashboard/jobs") },
                ]}
              />
              <RecentSessions
                recentThreads={recentThreads}
                onStartNewChat={handleStartNewChat}
                onResumeSession={(id) => router.push(`/chat?conversationId=${id}`)}
                formatDate={formatDate}
                t={t}
              />
            </section>
          </article>
        </main>
      </section>
    </section>
  );
}
