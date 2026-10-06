"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardContent } from "@krizaka/orazaka-design-system";
import { useTenant } from "@/core/context/TenantContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";
import { ProfileTabs, type ProfileTab } from "./ProfileTabs";
import { AccountTab } from "./AccountTab";
import { AppearanceTab } from "./AppearanceTab";
import { WorkspaceTab } from "./WorkspaceTab";
import { IntegrationsTab } from "./IntegrationsTab";

/**
 * ProfileView — the single home for identity and every former Settings feature,
 * organised as tabs (Account · Appearance · Workspace · Integrations). Workspace
 * is admin-only. A sticky Save bar appears whenever appearance/workspace edits
 * are pending.
 */
export function ProfileView() {
  const { accentClasses } = useTenant();
  const { t } = useTranslation();
  const { profile, isLoading, error } = useProfile();
  const pf = useProfileForm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="h-28 animate-pulse rounded-xl bg-[var(--surface-2)]" />
        <div className="h-12 animate-pulse rounded-xl bg-[var(--surface-2)]" />
        <div className="h-64 animate-pulse rounded-xl bg-[var(--surface-2)]" />
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="mx-auto max-w-5xl rounded-xl border border-[var(--status-error)]/20 bg-[var(--status-error)]/5 p-4 text-[var(--status-error)]">
        <p className="font-semibold">{t.profile.failedLoad}</p>
        <p className="text-sm opacity-80">
          {(error as Error)?.message || t.profile.unauthError}
        </p>
      </section>
    );
  }

  const isAdmin = profile.authorities?.includes("ROLE_ADMIN") ?? false;
  const initials = (profile.username || "U").slice(0, 2).toUpperCase();
  const tier = (() => {
    const auths = profile.authorities || [];
    if (auths.includes("ROLE_ADMIN")) return t.profile.enterpriseTier;
    if (auths.includes("ROLE_USER")) return t.profile.premiumTier;
    return t.profile.freeTier;
  })();

  const tabs: ProfileTab[] = [
    { id: "account", label: t.profile.tabs.account, icon: "profile" },
    { id: "appearance", label: t.profile.tabs.appearance, icon: "sun" },
    ...(isAdmin
      ? ([{ id: "workspace", label: t.profile.tabs.workspace, icon: "system" }] as ProfileTab[])
      : []),
    { id: "integrations", label: t.profile.tabs.integrations, icon: "mcp" },
  ];

  // The URL is the single source of truth for the active tab (deep/universal
  // linking, shareable + browser back/forward). Unknown or unauthorised ids
  // (e.g. ?tab=workspace for a non-admin) gracefully fall back to the first tab.
  const requestedTab = searchParams.get("tab");
  const active =
    requestedTab && tabs.some((tab) => tab.id === requestedTab)
      ? requestedTab
      : tabs[0].id;

  const selectTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Hero header */}
      <Card className="relative overflow-hidden bg-[var(--surface-1)] shadow-sm">
        <figure
          className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${accentClasses.accentGradient} opacity-10`}
        />
        <CardContent className="flex items-center gap-5 pb-6 pt-8">
          <figure
            className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentClasses.accentGradient} text-xl font-bold text-white shadow-lg`}
          >
            {initials}
          </figure>
          <section className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold text-[var(--text-primary)]">
              {profile.username}
            </h1>
            <p className="truncate text-sm text-[var(--text-muted)]">{profile.email}</p>
            <span
              className={`mt-2 inline-flex items-center rounded-full bg-gradient-to-r ${accentClasses.accentGradient} px-3 py-1 text-[10px] font-semibold text-white shadow-sm`}
            >
              {tier}
            </span>
          </section>
        </CardContent>
      </Card>

      {/* Tabs */}
      <ProfileTabs tabs={tabs} active={active} onChange={selectTab} />

      {/* Active panel */}
      <div
        role="tabpanel"
        id={`profile-panel-${active}`}
        aria-labelledby={`profile-tab-${active}`}
        className="pb-24"
      >
        {active === "account" && <AccountTab profile={profile} t={t} />}
        {active === "appearance" && <AppearanceTab pf={pf} />}
        {active === "workspace" && isAdmin && <WorkspaceTab pf={pf} />}
        {active === "integrations" && <IntegrationsTab />}
      </div>

      {/* Sticky Save bar — appears on pending appearance/workspace edits */}
      {pf.isDirty && (
        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-xl border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--surface-1)_92%,transparent)] p-3 pl-4 shadow-lg backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            {t.profile.unsavedChanges}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={pf.discard} disabled={pf.isUpdating}>
              {t.profile.discard}
            </Button>
            <Button size="sm" onClick={pf.save} disabled={pf.isUpdating}>
              {pf.isUpdating ? t.settings.saving : t.profile.saveChanges}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
