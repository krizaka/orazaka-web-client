import * as React from "react";
import { Input } from "@krizaka/orazaka-design-system";

import { SchemaField } from "@/services/interception.api";

/**
 * Properties required by the {@link InterceptionFormField} component.
 */
interface InterceptionFormFieldProps {
  /** The field meta schema definition. */
  field: SchemaField;
  /** Active input control value state. */
  value: string;
  /** Callback fired when control value changes. */
  onChange: (value: string) => void;
  /** Flag disabling the form element controls. */
  disabled?: boolean;
  /** Active locale language code identifier. */
  locale: string;
}

/**
 * InterceptionFormField renders a single form control based on the SchemaField definition.
 *
 * @param props - Component React properties.
 * @param props.field - The field meta schema definition.
 * @param props.value - Active input control value state.
 * @param props.onChange - Callback fired when control value changes.
 * @param props.disabled - Flag disabling the form element controls.
 * @param props.locale - Active locale language code identifier.
 * @returns The React component representing a field control.
 */
export function InterceptionFormField({
  field,
  value,
  onChange,
  disabled = false,
  locale,
}: Readonly<InterceptionFormFieldProps>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary flex items-center justify-between">
        <span>{field.label}</span>
        {field.required && (
          <span className="text-xs text-status-error font-normal">
            {locale === "fr" ? "* requis" : "* required"}
          </span>
        )}
      </label>

      {field.type === "text" && (
        <Input
          type="text"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-white/50 dark:bg-surface-1/30"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          placeholder={field.placeholder}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex w-full rounded-xl border border-border-subtle/80 bg-white/50 px-3 py-2 text-sm backdrop-blur-sm transition-all duration-200 placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-subtle dark:focus-visible:ring-border-subtle disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-subtle/60 dark:bg-surface-1/30 dark:placeholder:text-text-muted focus:ring-status-success dark:text-text-primary"
        />
      )}

      {field.type === "select" && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex h-10 w-full rounded-xl border border-border-subtle/80 bg-white/50 px-3 py-2 text-sm backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-border-subtle dark:focus-visible:ring-border-subtle disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-subtle/60 dark:bg-surface-1/30 focus:ring-status-success dark:text-text-primary"
        >
          {field.options?.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white dark:bg-surface-0 text-text-primary"
            >
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
