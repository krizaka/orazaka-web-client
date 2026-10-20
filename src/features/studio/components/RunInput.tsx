"use client";

import { Field, Input, Select, Textarea } from "@krizaka/ui/field";
import { useTranslation } from "@/core/context/LocaleContext";
import { AssetInput } from "@/features/studio/components/AssetInput";
import { ChoicePicker, EmptyChoices } from "@/features/studio/components/ChoicePicker";
import { SeedControl } from "@/features/studio/components/SeedControl";
import type { InputField } from "@/features/studio/hooks/useInputSchema";

export interface RunInputProps {
  field: InputField;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onBusyChange: (busy: boolean) => void;
}

/** A field in the caller's language: the title and help of the inputs the packs share are messages, not the blueprint's French. */
export function localized(
  field: InputField,
  inputs: Record<string, { title: string; description?: string }>,
  studioKey?: string,
): InputField {
  // A pack that wrote the field in the page's language (`x-i18n`) is the authority; the client's shared words
  // are for the blueprints published before it did.
  if (field.wordedByPack) {
    return field;
  }
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
export function RunInput({
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

  if (field.fedByCatalogue && (!field.choices || field.choices.length === 0)) {
    // The catalogue offers nothing (or could not be asked): a visible error, never a blank select.
    return (
      <EmptyChoices
        field={field}
        message={field.choices ? t.studio.form.noModels : `${t.studio.form.noModels} ${t.studio.form.choicesUnreachable}`}
      />
    );
  }
  if (field.type === "enum" && (field.options?.length ?? 0) === 0) {
    return <EmptyChoices field={field} message={t.studio.form.noOptions} />;
  }
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
      ) : field.type === "enum" && field.options ? (
        <Select {...control} onChange={(event) => onChange(event.target.value)}>
          {field.defaultValue === null && (
            <option value="">{field.required ? "" : t.studio.form.unset}</option>
          )}
          {field.options.map((option) => (
            <option key={option} value={option}>
              {field.optionLabels?.[option] ??
                t.studio.choices[field.key]?.[option] ??
                option}
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
    </Field.Root>
  );
}
