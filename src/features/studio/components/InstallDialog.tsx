"use client";

import { useState } from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { useConfigSchema, type ConfigField } from "@/features/studio/hooks/useConfigSchema";

interface InstallDialogProps {
  configSchema: string | null;
  initialConfig?: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (config: Record<string, string>) => void;
  onCancel: () => void;
}

/**
 * The install dialog: the Studio's configuration, asked once.
 *
 * The form is generated from the Studio's config schema, so shipping a new
 * profession stays an admin action rather than a frontend release (ADR-034).
 *
 * Inputs stay blocked while the request is in flight (ERR-126) — a double submit
 * would be idempotent server-side, but a user who cannot tell whether their click
 * registered will click again, and the second click deserves an answer rather than
 * a race.
 */
export function InstallDialog({
  configSchema,
  initialConfig,
  isSubmitting,
  onSubmit,
  onCancel,
}: Readonly<InstallDialogProps>) {
  const { t } = useTranslation();
  const fields = useConfigSchema(configSchema);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const seeded: Record<string, string> = {};
    for (const field of fields) {
      seeded[field.key] = initialConfig?.[field.key] ?? field.defaultValue;
    }
    return seeded;
  });

  const submit = () => {
    const filled = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value.trim() !== ""),
    );
    onSubmit(filled);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-[var(--border-subtle)] bg-[var(--surface-1)]">
      <header className="flex flex-col gap-0.5">
        <h2 className="text-[13px] font-semibold text-[var(--text-primary)]">
          {t.studio.configTitle}
        </h2>
        <p className="text-[11px] text-[var(--text-muted)]">{t.studio.configSubtitle}</p>
      </header>

      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <ConfigInput
            key={field.key}
            field={field}
            value={values[field.key] ?? ""}
            disabled={isSubmitting}
            onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-8 px-3 text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors duration-150 disabled:opacity-50"
        >
          {t.studio.cancel}
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className="h-8 px-3 inline-flex items-center gap-1.5 text-[12px] font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors duration-150 disabled:opacity-50"
        >
          {isSubmitting && <Icon name="loader" size={13} className="animate-spin" />}
          {isSubmitting ? t.studio.installing : t.studio.save}
        </button>
      </div>
    </div>
  );
}

interface ConfigInputProps {
  field: ConfigField;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

/** One generated field. A sub-component so the dialog stays a layout, not a loop body. */
function ConfigInput({ field, value, disabled, onChange }: Readonly<ConfigInputProps>) {
  const inputId = `studio-config-${field.key}`;

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1">
      <span className="hud-label text-[10px] text-[var(--text-muted)]">{field.title}</span>
      {field.options ? (
        <select
          id={inputId}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 px-2 text-[12px] border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 px-2 text-[12px] border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50"
        />
      )}
    </label>
  );
}
