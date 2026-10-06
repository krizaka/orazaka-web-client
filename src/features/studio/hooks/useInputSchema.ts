"use client";

import { useMemo } from "react";

/** One field the run form renders, derived from the blueprint's input schema. */
export interface InputField {
  key: string;
  title: string;
  type: "string" | "array" | "enum";
  options: string[] | null;
  required: boolean;
  maxItems: number | null;
}

/**
 * Turns a blueprint's raw JSON Schema into the fields the run form renders.
 *
 * Generated, never hand-written per Studio: a bespoke form per profession would put
 * every new Studio behind a frontend release — the deploy-per-Studio failure ADR-034
 * exists to remove, reappearing on this side of the wire.
 *
 * A malformed schema yields no fields rather than throwing. The server validates
 * authoritatively anyway, so a broken schema should degrade the form, not the page.
 *
 * @param inputSchema - the raw JSON Schema string, or null when unpublished
 */
export function useInputSchema(inputSchema: string | null): InputField[] {
  return useMemo(() => {
    if (!inputSchema) {
      return [];
    }
    try {
      const parsed = JSON.parse(inputSchema) as {
        required?: string[];
        properties?: Record<string, Record<string, unknown>>;
      };
      const required = new Set(parsed.required ?? []);
      return Object.entries(parsed.properties ?? {}).map(([key, raw]) => {
        const spec = raw as {
          title?: string;
          type?: string;
          enum?: string[];
          maxItems?: number;
        };
        let type: InputField["type"] = "string";
        if (Array.isArray(spec.enum)) {
          type = "enum";
        } else if (spec.type === "array") {
          type = "array";
        }
        return {
          key,
          title: spec.title ?? key,
          type,
          options: Array.isArray(spec.enum) ? spec.enum : null,
          required: required.has(key),
          maxItems: typeof spec.maxItems === "number" ? spec.maxItems : null,
        };
      });
    } catch {
      return [];
    }
  }, [inputSchema]);
}
