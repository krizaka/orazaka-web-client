"use client";

import * as React from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import type { UserProfile } from "@/services/profile.api";
import type { TranslationDictionary } from "@/core/context/LocaleContext";
import { CopyableField } from "./ProfileViewParts";

import { Card } from "@krizaka/ui/card";
import { cn } from "@krizaka/ui/cn";

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
      <Card.Root className="bg-surface-1 shadow-sm">
        <Card.Body padding="lg" className="gap-1.5">
          <Card.Title className="line-clamp-none tracking-tight group-hover:text-fg flex items-center gap-2 text-base font-semibold text-fg">
            <Icon name="shield" className="h-4 w-4 text-accent" />
            {t.profile.accountDetails}
          </Card.Title>
          <Card.Description className="line-clamp-none text-sm text-fg-muted">
            {t.profile.detailsDesc}
          </Card.Description>
        </Card.Body>
        <Card.Body padding="lg" className="block pt-0">
          <section className="grid gap-5 sm:grid-cols-2">
            <CopyableField label={t.profile.userId} value={profile.id} icon="hash" isMono />
            <CopyableField label={t.profile.username} value={profile.username} icon="user" />
            <CopyableField label={t.profile.email} value={profile.email} icon="mail" />
            <article className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                <Icon name="shield" className="h-3 w-3" />
                {t.profile.assignedAuth}
              </p>
              <section className="flex flex-wrap gap-1.5 pt-0.5">
                {profile.authorities && profile.authorities.length > 0 ? (
                  profile.authorities.map((auth) => (
                    <span
                      key={auth}
                      className="inline-flex items-center rounded-lg border border-border-subtle bg-surface-2 px-2.5 py-1 font-mono text-[11px] font-medium text-fg-secondary"
                    >
                      {auth}
                    </span>
                  ))
                ) : (
                  <span className="text-sm italic text-fg-muted">
                    {t.profile.noAuth}
                  </span>
                )}
              </section>
            </article>
          </section>
        </Card.Body>
      </Card.Root>

      <Card.Root className="bg-surface-1 shadow-sm">
        <button
          type="button"
          onClick={() => setShowPrefs((v) => !v)}
          aria-expanded={showPrefs}
          className="flex w-full items-center justify-between gap-2 p-6 text-left transition-colors hover:bg-surface-2/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <span className="flex flex-col gap-1">
            <span className="text-base font-semibold text-fg">
              {t.profile.prefMetadata}
            </span>
            <span className="text-sm text-fg-secondary">
              {t.profile.prefDesc}
            </span>
          </span>
          <Icon name="chevronDown"
            className={cn(
              "h-4 w-4 flex-shrink-0 text-fg-muted transition-transform duration-200",
              showPrefs ? "rotate-180" : ""
            )}
          />
        </button>
        {showPrefs && (
          <Card.Body
            padding="lg"
            className="block pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
            <pre className="max-h-64 overflow-auto rounded-xl border border-border-subtle bg-surface-2 p-4 font-mono text-xs leading-relaxed text-fg-secondary scrollbar-thin">
              {JSON.stringify(profile.preferences, null, 2)}
            </pre>
          </Card.Body>
        )}
      </Card.Root>
    </section>
  );
}
