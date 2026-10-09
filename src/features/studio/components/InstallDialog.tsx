"use client";

import { useState } from "react";
import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { useTranslation } from "@/core/context/LocaleContext";
import { useConfigSchema, type ConfigField } from "@/features/studio/hooks/useConfigSchema";

interface InstallDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  configSchema: string | null;
  initialConfig?: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (config: Record<string, string>) => void;
  onCancel: () => void;
}

/**
 * The install dialog: the Studio's configuration, asked once — a @krizaka/ui Dialog (Radix: focus trap, Escape,
 * focus return to the button that opened it).
 *
 * The form is generated from the Studio's config schema, so shipping a new
 * profession stays an admin action rather than a frontend release (ADR-034).
 *
 * Inputs stay blocked while the request is in flight (ERR-126) — a double submit
 * would be idempotent server-side, but a user who cannot tell whether their click
 * registered will click again, and the second click deserves an answer rather than
 * a race. Closing is refused while it is in flight, for the same reason.
 */
export function InstallDialog({ open, isSubmitting, onCancel, ...form }: Readonly<InstallDialogProps>) {
  const { t } = useTranslation();
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && !isSubmitting && onCancel()}>
      <Dialog.Content closeLabel={t.studio.cancel}>
        <Dialog.Header>
          <Dialog.Title>{t.studio.configTitle}</Dialog.Title>
          <Dialog.Description>{t.studio.configSubtitle}</Dialog.Description>
        </Dialog.Header>
        {/* Mounted while open only: the values are seeded again from the installation each time. */}
        <InstallForm {...form} isSubmitting={isSubmitting} onCancel={onCancel} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function InstallForm({
  configSchema,
  initialConfig,
  isSubmitting,
  onSubmit,
  onCancel,
}: Readonly<Omit<InstallDialogProps, "open">>) {
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
    <>
      <Dialog.Body className="flex flex-col gap-3">
        {fields.map((field) => (
          <ConfigInput
            key={field.key}
            field={field}
            value={values[field.key] ?? ""}
            disabled={isSubmitting}
            onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
          />
        ))}
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
          {t.studio.cancel}
        </Button>
        <Button size="sm" onClick={submit} loading={isSubmitting}>
          {isSubmitting ? t.studio.installing : t.studio.save}
        </Button>
      </Dialog.Footer>
    </>
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
      <span className="hud-label text-[10px] text-fg-muted">{field.title}</span>
      {field.options ? (
        <select
          id={inputId}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 px-2 text-[12px] border border-border-subtle bg-surface-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
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
          className="h-8 px-2 text-[12px] border border-border-subtle bg-surface-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />
      )}
    </label>
  );
}
