"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useTenant } from "@/core/context/TenantContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { useChatStream } from "@/features/chat-session/hooks/useChatStream";
import { Skeleton, Icon } from "@krizaka/orazaka-design-system";

import { InterceptorPipeline } from "@/features/dashboard/components/InterceptorPipeline";
import { MetricsGrid } from "@/features/dashboard/components/MetricsGrid";
import { SystemHealthHud } from "@/features/dashboard/components/SystemHealthHud";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentSessions } from "@/features/dashboard/components/RecentSessions";

/**
 * HomePage — Command Center Dashboard.
 * 3-section layout: Pipeline → Metrics+Health → Actions+Sessions.
 *
 * @returns The rendered React element for the dashboard view.
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { accentClasses } = useTenant();
  const { locale, t } = useTranslation();

  // Use useChatStream to fetch the threads list for the activity panel.
  const { threads } = useChatStream("dashboard");

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Active sessions = live count of active job-stream (SSE) connections, polled
  // from the admin endpoint. Only admins may read it; regular users fall back to
  // their local thread count in the metrics block below.
  const [activeConnections, setActiveConnections] = React.useState<number | null>(
    null,
  );

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin" || !user?.id) return;
    const poll = async () => {
      try {
        const res = await fetch("/api/v1/jobs/active-connections", {
          headers: { Authorization: `Bearer ${user.id}` },
        });
        if (res.ok) setActiveConnections(await res.json());
      } catch {
        // Transient fetch failure — keep the previously displayed value.
      }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.role, user?.id]);

  // Deferred creation: land in the empty composer; the thread is persisted only
  // once the first message is sent (avoids empty "New Memory Block" threads).
  const handleStartNewChat = () => {
    router.push("/chat");
  };

  const formatDate = (timestamp: number) => {
    try {
      return format(timestamp, "MMM d, HH:mm", {
        locale: locale === "fr" ? fr : enUS,
      });
    } catch {
      return "";
    }
  };

  // Time-of-day greeting icon (SVG, not emoji — governance §4/§8).
  const greetingIcon = new Date().getHours() < 18 ? "sun" : "moon";

  if (isLoading || !isAuthenticated) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[var(--surface-0)] ambient-grid">
        <div className="w-full max-w-6xl px-6 space-y-8">
          {/* Skeleton header */}
          <div className="space-y-2">
            <Skeleton variant="text" width="40%" height="2rem" />
            <Skeleton variant="text" width="60%" />
          </div>
          {/* Skeleton pipeline */}
          <Skeleton variant="rect" height="5rem" />
          {/* Skeleton grid */}
          <section className="grid gap-6 md:grid-cols-3">
            <Skeleton variant="rect" height="8rem" />
            <Skeleton variant="rect" height="8rem" />
            <Skeleton variant="rect" height="8rem" />
          </section>
        </div>
      </section>
    );
  }

  // Get most recent 3 threads to show in activity panel
  const recentThreads = [...(threads || [])]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  // Active sessions is the live connection count for admins (see effect above);
  // regular users see their local thread count. Tokens/memory remain placeholder
  // figures pending a dedicated metrics endpoint.
  const metrics = {
    activeSessions:
      user?.role === "admin" ? activeConnections ?? 0 : threads?.length || 0,
    tokensUsed: 12450,
    memoryNodes: 847,
  };

  return (
    <section className="flex h-screen overflow-hidden bg-[var(--surface-0)] transition-colors duration-200">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6 scrollbar-thin ambient-grid">
          <div className="mx-auto max-w-6xl space-y-6 stagger-children">
            {/* ── Section 1: Welcome Header ──────────────────── */}
            <header className="flex items-baseline justify-between">
              <div className="space-y-1">
                <h2 className="fluid-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                  <Icon name={greetingIcon} className="h-6 w-6 text-[var(--accent)]" />
                  {t.dashboard.welcome},{" "}
                  <span className="text-[var(--accent)]">
                    {user?.name || "Admin"}
                  </span>
                </h2>
                <p className="text-[var(--text-secondary)] fluid-sm">
                  {t.dashboard.overview}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                {/* Sovereignty status — threads the shared on-prem motif */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-success)] motion-safe:animate-pulse" />
                  Local · sovereign
                </span>
                <kbd className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)]">
                  ⌘K
                </kbd>
              </div>
            </header>

            {/* ── Section 2: Interceptor Pipeline (admin only) ── */}
            {user?.role === "admin" && <InterceptorPipeline />}

            {/* ── Section 3: Metrics + System Health ─────────── */}
            <div className="grid gap-6 lg:grid-cols-4">
              <section className="lg:col-span-3">
                <MetricsGrid
                  metrics={metrics}
                  accentClasses={accentClasses}
                  t={t}
                />
              </section>
              <section className="lg:col-span-1">
                <SystemHealthHud />
              </section>
            </div>

            {/* ── Section 4: Quick Actions + Recent Sessions ── */}
            <div className="grid gap-6 md:grid-cols-3">
              <QuickActions
                onStartNewChat={handleStartNewChat}
                onResumeProfile={() => router.push("/profile")}
                onConfigureSettings={() => router.push("/profile")}
                accentClasses={accentClasses}
                t={t}
              />
              <RecentSessions
                recentThreads={recentThreads}
                onStartNewChat={handleStartNewChat}
                onResumeSession={(id) =>
                  router.push(`/chat?conversationId=${id}`)
                }
                formatDate={formatDate}
                t={t}
              />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
