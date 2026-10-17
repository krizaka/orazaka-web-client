import { renderHook } from "@testing-library/react";
import { assetKindOf, useInputSchema } from "@/features/studio/hooks/useInputSchema";

describe("assetKindOf — which inputs take an uploaded file", () => {
  it.each([
    ["image", { type: "string", format: "asset:image" }, "image"],
    ["clip", { type: "string", format: "asset:video" }, "video"],
    ["voice", { type: "string", format: "asset:audio" }, "audio"],
    ["assetId", { type: "string", format: "asset-id", contentMediaType: "audio/*" }, "audio"],
    ["image", { type: "string" }, "image"], // a blueprint published before the pack declared anything
    ["prompt", { type: "string", format: "prose" }, null],
    ["image", { type: "string", format: "prose" }, null],
    ["subject", { type: "string" }, null],
    ["assetId", { type: "string", format: "asset-id" }, null],
    ["image", { type: "array", format: "asset:image" }, null],
  ])("%s %j is %s", (key, spec, kind) => {
    expect(assetKindOf(key, spec)).toBe(kind);
  });
});

describe("useInputSchema", () => {
  it("marks the image input as an image picker, not a text line", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { image: { type: "string", format: "asset:image", maxLength: 120, title: "x" }, prompt: { type: "string" } },
    });
    const { result } = renderHook(() => useInputSchema(schema));
    expect(result.current.map((f) => [f.key, f.assetKind])).toEqual([["image", "image"], ["prompt", null]]);
  });
});

describe("useInputSchema — closed sets are choices, not text", () => {
  const schema = JSON.stringify({
    type: "object",
    required: ["prompt"],
    properties: {
      prompt: { type: "string" },
      model: {
        type: "string",
        title: "Model",
        "x-advanced": true,
        "x-options": { source: "models", category: "image" },
        default: "sd-hosted",
        oneOf: [
          { const: "sd-hosted", title: "SD hosted", description: "Hosted.", "x-meta": { runsOn: "cloud", speed: "fast", typicalSeconds: 8, priceCents: 8, available: true } },
          { const: "flux", title: "FLUX", "x-meta": { runsOn: "local", available: false, unavailableReason: "FLUX is not running" } },
        ],
      },
      seed: { type: "string", "x-control": "seed", "x-advanced": true },
      voiceless: { type: "string", "x-options": { source: "models", category: "speech" } },
      size: { type: "string", enum: ["1024x1024", "512x512"], default: "1024x1024" },
    },
  });
  const field = (key: string) => renderHook(() => useInputSchema(schema)).result.current.find((f) => f.key === key)!;

  it("reads a labelled oneOf as choices with the catalogue facts a picker shows", () => {
    const model = field("model");
    expect(model.choices).toEqual([
      { value: "sd-hosted", label: "SD hosted", hint: "Hosted.", meta: { runsOn: "cloud", speed: "fast", typicalSeconds: 8, priceCents: 8, available: true, unavailableReason: null } },
      { value: "flux", label: "FLUX", hint: null, meta: { runsOn: "local", speed: null, typicalSeconds: null, priceCents: null, available: false, unavailableReason: "FLUX is not running" } },
    ]);
    expect(model.defaultValue).toBe("sd-hosted");
    expect(model.fedByCatalogue).toBe(true);
    expect(model.advanced).toBe(true);
  });

  it("a catalogue-fed field whose list did not load is still a picker, with no choices", () => {
    const f = field("voiceless");
    expect(f.fedByCatalogue).toBe(true);
    expect(f.choices).toBeNull();
  });

  it("reads the seed control and the static enum", () => {
    expect(field("seed")).toMatchObject({ control: "seed", advanced: true, choices: null });
    expect(field("size")).toMatchObject({ type: "enum", options: ["1024x1024", "512x512"], defaultValue: "1024x1024", advanced: false });
    expect(field("prompt")).toMatchObject({ control: null, advanced: false, fedByCatalogue: false });
  });
});
