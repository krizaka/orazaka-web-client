"use client";

import { useState } from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { useInputSchema, type InputField } from "@/features/studio/hooks/useInputSchema";

interface RunFormProps {
  inputSchema: string | null;
  estimatedCredits: number;
  isSubmitting: boolean;
  onSubmit: (inputs: Record<string, unknown>) => void;
}

/**
 * The run form, generated from the blueprint's JSON Schema.
 *
 * Inputs stay blocked while a run is being submitted (ERR-126): starting a second
 * run costs a second credit hold, so a user who cannot tell whether their click
 * landed must not be able to pay twice for finding out.
 */
export function RunForm({
  inputSchema,
  estimatedCredits,
  isSubmitting,
  onSubmit,
}: Readonly<RunFormProps>) {
  const { t } = useTranslation();
  const fields = useInputSchema(inputSchema);
  const [values, setValues] = useState<Record<string, string>>({});

  const submit = () => {
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = (values[field.key] ?? "").trim();
      if (raw === "") {
        continue;
      }
      payload[field.key] =
        field.type === "array"
          ? raw.split(",").map((item) => item.trim()).filter(Boolean)
          : raw;
    }
    onSubmit(payload);
  };

  const missingRequired = fields.some(
    (field) => field.required && !(values[field.key] ?? "").trim(),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <RunInput
            key={field.key}
            field={field}
            value={values[field.key] ?? ""}
            disabled={isSubmitting}
            onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-fg-muted">
          {t.studio.estimatedCost}: {estimatedCredits} {t.studio.creditsPerRun}
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={isSubmitting || missingRequired}
          className="h-8 px-4 inline-flex items-center gap-1.5 text-[12px] font-medium border border-accent text-accent hover:bg-surface-2 transition-colors duration-150 disabled:opacity-50"
        >
          {isSubmitting && <Icon name="loader" size={13} className="animate-spin" />}
          {t.studio.runNow}
        </button>
      </div>
    </div>
  );
}

interface RunInputProps {
  field: InputField;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

/** One generated field. A sub-component so the form above stays a layout. */
function RunInput({ field, value, disabled, onChange }: Readonly<RunInputProps>) {
  const inputId = `studio-run-${field.key}`;

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1">
      <span className="hud-label text-[10px] text-fg-muted">
        {field.title}
        {field.required ? " *" : ""}
      </span>
      {field.type === "enum" && field.options ? (
        <select
          id={inputId}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 px-2 text-[12px] border border-border-subtle bg-surface-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          <option value="" />
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
          placeholder={field.type === "array" ? "a, b, c" : undefined}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 px-2 text-[12px] border border-border-subtle bg-surface-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />
      )}
    </label>
  );
}
