"use client";

import { useCallback, useState } from "react";
import { Button } from "@krizaka/ui/button";
import { Field, Input, Select, Textarea } from "@krizaka/ui/field";
import { useTranslation } from "@/core/context/LocaleContext";
import { AssetInput } from "@/features/studio/components/AssetInput";
import { useInputSchema, type InputField } from "@/features/studio/hooks/useInputSchema";

interface RunFormProps {
  /** The Studio's key: a shared input key ("voice") reads differently from one Studio to another. */
  studioKey?: string;
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
  studioKey,
  inputSchema,
  estimatedCredits,
  isSubmitting,
  onSubmit,
}: Readonly<RunFormProps>) {
  const { t } = useTranslation();
  const fields = useInputSchema(inputSchema);
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const setBusy = useCallback((key: string, busy: boolean) => {
    setUploading((current) => (current[key] === busy || (!busy && !current[key]) ? current : { ...current, [key]: busy }));
  }, []);
  const isUploading = Object.values(uploading).some(Boolean);

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
            field={localized(field, t.studio.inputs, studioKey)}
            value={values[field.key] ?? ""}
            disabled={isSubmitting}
            onBusyChange={(busy) => setBusy(field.key, busy)}
            onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-fg-muted">
          {t.studio.estimatedCost}: <span className="font-semibold text-fg">{estimatedCredits}</span> {t.studio.creditsPerRun}
        </span>
        <Button variant="primary" size="md" onClick={submit} disabled={missingRequired || isUploading} loading={isSubmitting}>
          {t.studio.runNow}
        </Button>
      </div>
    </div>
  );
}

interface RunInputProps {
  field: InputField;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onBusyChange: (busy: boolean) => void;
}

/** A field in the caller's language: the title and help of the inputs the packs share are messages, not the blueprint's French. */
function localized(field: InputField, inputs: Record<string, { title: string; description?: string }>, studioKey?: string): InputField {
  const words = (studioKey ? inputs[`${studioKey}/${field.key}`] : undefined) ?? inputs[field.key];
  return words ? { ...field, title: words.title, description: words.description ?? field.description } : field;
}

/** One generated field, on the @krizaka/ui field (label, control, hint). */
function RunInput({ field, value, disabled, onChange, onBusyChange }: Readonly<RunInputProps>) {
  const inputId = `studio-run-${field.key}`;
  const hintId = field.description ? `${inputId}-hint` : undefined;
  const control = { id: inputId, value, disabled, "aria-describedby": hintId };

  return (
    <Field.Root className="gap-1.5">
      <Field.Label htmlFor={inputId}>
        {field.title}
        {field.required ? " *" : ""}
      </Field.Label>
      {field.assetKind ? (
        <AssetInput
          id={inputId}
          kind={field.assetKind}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBusyChange={onBusyChange}
          describedBy={hintId}
          label={field.title}
        />
      ) : field.type === "enum" && field.options ? (
        <Select {...control} onChange={(event) => onChange(event.target.value)}>
          <option value="" />
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : field.multiline ? (
        <Textarea {...control} rows={6} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input {...control} type="text" placeholder={field.type === "array" ? "a, b, c" : undefined} onChange={(event) => onChange(event.target.value)} />
      )}
      {field.description && <Field.Hint id={hintId}>{field.description}</Field.Hint>}
    </Field.Root>
  );
}
