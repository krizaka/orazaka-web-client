"use client";

import { Combobox, type ComboboxOption } from "@krizaka/ui/combobox";
import { useTranslation } from "@/core/context/LocaleContext";
import { describeChoice } from "@/features/studio/components/describeChoice";
import type { InputField } from "@/features/studio/hooks/useInputSchema";

interface ChoicePickerProps {
  field: InputField;
  choices: NonNullable<InputField["choices"]>;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

/**
 * A closed list the catalogue fed, as a searchable list: each entry says where it runs, how fast, about how long and
 * what it costs; one whose engine is off is shown but cannot be picked, with the reason. Left alone, the field stays
 * on « Automatic » and sends nothing, so the platform keeps choosing the best available model at run time.
 */
export function ChoicePicker({
  field,
  choices,
  value,
  disabled,
  onChange,
}: Readonly<ChoicePickerProps>) {
  const { t } = useTranslation();
  const form = t.studio.form;
  const options: ComboboxOption[] = choices.map((choice) => ({
    value: choice.value,
    label: choice.label,
    description: describeChoice(choice, form),
    disabled: choice.meta?.available === false,
  }));
  const chosen = options.find((option) => option.value === value) ?? null;
  const running = choices.find((choice) => choice.value === field.defaultValue);
  const shown = choices.find(
    (choice) => choice.value === (chosen?.value ?? field.defaultValue),
  );
  return (
    <Combobox
      label={field.title}
      options={options}
      value={chosen}
      onValueChange={(option) => onChange(option?.value ?? "")}
      placeholder={
        running
          ? form.automatic.replace("{name}", running.label)
          : form.automaticPlain
      }
      hint={shown?.hint ?? form.automaticHint}
      disabled={disabled}
      labels={{
        empty: form.noResults,
        clear: form.clear,
        toggle: form.showOptions,
      }}
    />
  );
}
