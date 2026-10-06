"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import {
  AI_PERSONAS,
  AI_PERSONA_LABELS,
  type AiPersona,
} from "@/constants/settings.constants";
import { FieldLabel, SelectField } from "./ProfileFormParts";
import type { UseProfileForm } from "@/features/profile/hooks/useProfileForm";

/**
 * Workspace tab (admin-only) — tenant branding (Inversion of Control) plus the
 * default assistant persona. Edits flow through the shared Profile Save bar.
 */
export function WorkspaceTab({ pf }: Readonly<{ pf: UseProfileForm }>) {
  const { t } = useTranslation();
  const { form, setField } = pf;

  return (
    <Card className="bg-[var(--surface-1)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">
          {t.profile.workspaceTitle}
        </CardTitle>
        <CardDescription className="text-[var(--text-muted)]">
          {t.profile.workspaceDesc}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="workspace-name">{t.settings.appName}</FieldLabel>
          <Input
            id="workspace-name"
            value={form.themeName}
            onChange={(e) => setField("themeName", e.target.value)}
            placeholder={t.settings.appNamePlaceholder}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="workspace-tagline">{t.settings.tagline}</FieldLabel>
          <Input
            id="workspace-tagline"
            value={form.themeTagline}
            onChange={(e) => setField("themeTagline", e.target.value)}
            placeholder={t.settings.taglinePlaceholder}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="workspace-tenant">{t.settings.tenantId}</FieldLabel>
            <Input
              id="workspace-tenant"
              value={form.tenantId}
              onChange={(e) => setField("tenantId", e.target.value)}
              placeholder={t.settings.tenantIdPlaceholder}
            />
          </div>

          <SelectField
            id="workspace-persona"
            label={t.settings.aiPersona}
            value={form.aiPersona}
            onChange={(e) => setField("aiPersona", e.target.value as AiPersona)}
          >
            {AI_PERSONAS.map((p) => (
              <option key={p} value={p}>
                {
                  t.settings[
                    AI_PERSONA_LABELS[p].split(".")[1] as keyof typeof t.settings
                  ] as string
                }
              </option>
            ))}
          </SelectField>
        </div>
      </CardContent>
    </Card>
  );
}
