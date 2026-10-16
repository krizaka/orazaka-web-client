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
