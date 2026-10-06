"use client";

import * as React from "react";
import { Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle, Icon } from "@krizaka/orazaka-design-system";
import type { UserProfile } from "@/services/profile.api";
import type { TranslationDictionary } from "@/core/context/LocaleContext";
import { CopyableField } from "./ProfileViewParts";

interface AccountTabProps {
  profile: UserProfile;
  t: TranslationDictionary;
}

/**
 * Account tab — identity details resolved from the identity context plus a
 * progressively-disclosed raw preferences payload.
 */
export function AccountTab({ profile, t }: Readonly<AccountTabProps>) {
  const [showPrefs, setShowPrefs] = React.useState(false);

  return (
    <section className="space-y-6">
      <Card className="bg-[var(--surface-1)] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <Icon name="shield" className="h-4 w-4 text-[var(--accent)]" />
            {t.profile.accountDetails}
          </CardTitle>
          <CardDescription className="text-[var(--text-muted)]">
            {t.profile.detailsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className="grid gap-5 sm:grid-cols-2">
            <CopyableField label={t.profile.userId} value={profile.id} icon="hash" isMono />
            <CopyableField label={t.profile.username} value={profile.username} icon="user" />
            <CopyableField label={t.profile.email} value={profile.email} icon="mail" />
            <article className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <Icon name="shield" className="h-3 w-3" />
                {t.profile.assignedAuth}
              </p>
              <section className="flex flex-wrap gap-1.5 pt-0.5">
                {profile.authorities && profile.authorities.length > 0 ? (
                  profile.authorities.map((auth) => (
                    <span
                      key={auth}
                      className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-2)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--text-secondary)]"
                    >
                      {auth}
                    </span>
                  ))
                ) : (
                  <span className="text-sm italic text-[var(--text-muted)]">
                    {t.profile.noAuth}
                  </span>
                )}
              </section>
            </article>
          </section>
        </CardContent>
      </Card>

      <Card className="bg-[var(--surface-1)] shadow-sm">
        <button
          type="button"
          onClick={() => setShowPrefs((v) => !v)}
          aria-expanded={showPrefs}
          className="flex w-full items-center justify-between gap-2 p-6 text-left transition-colors hover:bg-[var(--surface-2)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-xl"
        >
          <span className="flex flex-col gap-1">
            <span className="text-base font-semibold text-[var(--text-primary)]">
              {t.profile.prefMetadata}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              {t.profile.prefDesc}
            </span>
          </span>
          <Icon name="chevronDown"
            className={`h-4 w-4 flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
              showPrefs ? "rotate-180" : ""
            }`}
          />
        </button>
        {showPrefs && (
          <CardContent className="animate-in fade-in slide-in-from-top-1 duration-200">
            <pre className="max-h-64 overflow-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-2)] p-4 font-mono text-xs leading-relaxed text-[var(--text-secondary)] scrollbar-thin">
              {JSON.stringify(profile.preferences, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </section>
  );
}
