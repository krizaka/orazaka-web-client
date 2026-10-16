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
  /** The schema's `description`: a line of help under the field. */
  description: string | null;
  /** A long text (`maxLength` over 500): a text area rather than a line. */
  multiline: boolean;
  /** What file the field takes, when it takes an uploaded one (a picker, never a typed asset id). */
  assetKind: AssetKind | null;
}

export type AssetKind = "image" | "video" | "audio";

/**
 * The kind of file an input takes: `format: "asset:image|video|audio"` (orazaka-packs#30), or the older
 * `format: "asset-id"` read with its `contentMediaType` (`image/*`). A blueprint published before the pack
 * declared anything still has `image` as its starting image: that key alone is read as an image.
 */
export function assetKindOf(key: string, spec: { format?: string; contentMediaType?: string; type?: string }): AssetKind | null {
  if (spec.type && spec.type !== "string") {
    return null;
  }
  const declared = /^asset:(image|video|audio)$/.exec(spec.format ?? "");
  if (declared) {
    return declared[1] as AssetKind;
  }
  const media = /^(image|video|audio)\//.exec(spec.contentMediaType ?? "");
  if (spec.format === "asset-id" && media) {
    return media[1] as AssetKind;
  }
  return !spec.format && key === "image" ? "image" : null;
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
          maxLength?: number;
          description?: string;
          format?: string;
          contentMediaType?: string;
        };
        let type: InputField["type"] = "string";
        if (Array.isArray(spec.enum)) {
          type = "enum";
        } else if (spec.type === "array") {
          type = "array";
        }
        const assetKind = type === "string" ? assetKindOf(key, spec) : null;
        return {
          key,
          title: spec.title ?? key,
          type,
          options: Array.isArray(spec.enum) ? spec.enum : null,
          required: required.has(key),
          maxItems: typeof spec.maxItems === "number" ? spec.maxItems : null,
          description: spec.description ?? null,
          assetKind,
          multiline: type === "string" && !assetKind && typeof spec.maxLength === "number" && spec.maxLength > 500,
        };
      });
    } catch {
      return [];
    }
  }, [inputSchema]);
}
