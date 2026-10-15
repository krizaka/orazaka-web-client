import fs from "node:fs";
import path from "node:path";

import { MODELS } from "@/features/landing/utils/models";

const ids = new Set(MODELS.map((m) => m.id));

describe("/models lists what Orazaka runs (models.generated.json, synced from krizaka/orazaka)", () => {
  it("includes the two models routed to DigitalOcean serverless inference", () => {
    expect(ids.has("wan2-2-t2v-a14b")).toBe(true);
    expect(ids.has("stable-diffusion-3.5-large")).toBe(true);
  });

  it("lists every model the gallery runs (the `--model <id>` of its clips is in /models)", () => {
    const source = fs.readFileSync(path.join(__dirname, "..", "gallery-clips.ts"), "utf8");
    const referenced = [...source.matchAll(/--model[ =]+([\w.-]+)/g)].map((m) => m[1]);
    expect(referenced.length).toBeGreaterThan(0);
    for (const id of referenced) expect(ids.has(id)).toBe(true);
  });
});
