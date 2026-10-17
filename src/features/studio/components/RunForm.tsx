"use client";

import { useCallback, useState } from "react";
import { Button } from "@krizaka/ui/button";
import { Field, Input, Select, Textarea } from "@krizaka/ui/field";
import { useTranslation } from "@/core/context/LocaleContext";
import { AssetInput } from "@/features/studio/components/AssetInput";
import { ChoicePicker } from "@/features/studio/components/ChoicePicker";
import { SeedControl } from "@/features/studio/components/SeedControl";
import {
  useInputSchema,
  type InputField,
} from "@/features/studio/hooks/useInputSchema";

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
    setUploading((current) =>
      current[key] === busy || (!busy && !current[key])
        ? current
        : { ...current, [key]: busy },
    );
  }, []);
  const isUploading = Object.values(uploading).some(Boolean);

  /** What a field holds: the person's answer, else — for a plain list — the default it shows selected. */
  const valueOf = (field: InputField) =>
    values[field.key] ??
    (field.type === "enum" ? (field.defaultValue ?? "") : "");

  const submit = () => {
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = valueOf(field).trim();
      if (raw === "") {
        continue;
      }
      payload[field.key] =
        field.type === "array"
          ? raw
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : raw;
    }
    onSubmit(payload);
  };

  const missingRequired = fields.some(
    (field) => field.required && !valueOf(field).trim(),
  );
  const main = fields.filter((field) => !field.advanced);
  const more = fields.filter((field) => field.advanced);
  const renderField = (field: InputField) => (
    <RunInput
      key={field.key}
      field={localized(field, t.studio.inputs, studioKey)}
      value={valueOf(field)}
      disabled={isSubmitting}
      onBusyChange={(busy) => setBusy(field.key, busy)}
      onChange={(value) =>
        setValues((current) => ({ ...current, [field.key]: value }))
      }
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {main.map(renderField)}
        {more.length > 0 && (
          <details className="group rounded-lg border border-line px-3 py-2">
            <summary className="cursor-pointer select-none text-sm font-medium text-fg-muted">
              {t.studio.form.moreOptions}
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              {more.map(renderField)}
            </div>
          </details>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-fg-muted">
          {t.studio.estimatedCost}:{" "}
          <span className="font-semibold text-fg">{estimatedCredits}</span>{" "}
          {t.studio.creditsPerRun}
        </span>
        <Button
          variant="primary"
          size="md"
          onClick={submit}
          disabled={missingRequired || isUploading}
          loading={isSubmitting}
        >
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
function localized(
  field: InputField,
  inputs: Record<string, { title: string; description?: string }>,
  studioKey?: string,
): InputField {
  const words =
    (studioKey ? inputs[`${studioKey}/${field.key}`] : undefined) ??
    inputs[field.key];
  return words
    ? {
        ...field,
        title: words.title,
        description: words.description ?? field.description,
      }
    : field;
}

/** One generated field, on the @krizaka/ui field (label, control, hint). */
function RunInput({
  field,
  value,
  disabled,
  onChange,
  onBusyChange,
}: Readonly<RunInputProps>) {
  const { t } = useTranslation();
  const inputId = `studio-run-${field.key}`;
  const hintId = field.description ? `${inputId}-hint` : undefined;
  const control = { id: inputId, value, disabled, "aria-describedby": hintId };

  if (field.choices) {
    return (
      <ChoicePicker
        field={field}
        choices={field.choices}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }
  if (field.control === "seed") {
    return (
      <SeedControl
        field={field}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

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
      ) : field.fedByCatalogue ? (
        // The catalogue's list could not be loaded: still a list (just "automatic"), never a box to type a model id in.
        <Select {...control} value="" disabled onChange={() => undefined}>
          <option value="">{t.studio.form.automaticPlain}</option>
        </Select>
      ) : field.type === "enum" && field.options ? (
        <Select {...control} onChange={(event) => onChange(event.target.value)}>
          {field.defaultValue === null && <option value="" />}
          {field.options.map((option) => (
            <option key={option} value={option}>
              {t.studio.choices[field.key]?.[option] ?? option}
            </option>
          ))}
        </Select>
      ) : field.multiline ? (
        <Textarea
          {...control}
          rows={6}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          {...control}
          type="text"
          placeholder={field.type === "array" ? "a, b, c" : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.description && (
        <Field.Hint id={hintId}>{field.description}</Field.Hint>
      )}
      {field.fedByCatalogue && (
        <Field.Hint>{t.studio.form.choicesUnreachable}</Field.Hint>
      )}
    </Field.Root>
  );
}
