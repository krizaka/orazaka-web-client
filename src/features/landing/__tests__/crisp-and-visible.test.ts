/**
 * @jest-environment node
 */
import fs from "node:fs";
import path from "node:path";

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");

describe("the landing never hides or blurs its content", () => {
  it("a capture is crisp: no blur or backdrop filter on .landing-card-capture", () => {
    const css = read("src/features/landing/landing.css");
    const blocks = [...css.matchAll(/(\.landing-card-capture[^{}]*)\{([^}]*)\}/g)].map((m) => m[2]);
    expect(blocks.length).toBeGreaterThan(0);
    blocks.forEach((body) => expect(body).not.toMatch(/blur\(|backdrop-filter|filter:/));
  });

  it("without JavaScript every [data-reveal] block is visible", () => {
    expect(read("src/app/layout.tsx")).toMatch(/<noscript>[\s\S]*\[data-reveal\]\{opacity:1!important/);
  });
});
