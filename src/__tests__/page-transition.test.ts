/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");

// One page change, one system: Krizaka UI's PageTransition wraps the page content once, in the provider tree. Its
// cross-fade, and the instant change under prefers-reduced-motion, live in @krizaka/ui's motion.css (tested there).
describe("page transitions", () => {
  const providers = read("src/core/providers/Providers.tsx");

  it("wraps the page content in PageTransition from @krizaka/ui/motion, once", () => {
    expect(providers).toMatch(/import \{ PageTransition \} from "@krizaka\/ui\/motion"/);
    expect(providers.match(/<PageTransition>/g)).toHaveLength(1);
    expect(providers).toMatch(/<PageTransition>\{children\}<\/PageTransition>/);
  });

  it("loads the stylesheet that carries the transition and its reduced-motion rule", () => {
    expect(read("src/app/globals.css")).toContain('@import "@krizaka/orazaka-design-system/theme.css"');
    expect(read("node_modules/@krizaka/orazaka-design-system/src/theme.css")).toContain('@import "@krizaka/tailwind"');
    expect(read("node_modules/@krizaka/tailwind/index.css")).toContain("@krizaka/ui/motion.css");
    expect(read("node_modules/@krizaka/ui/dist/motion.css")).toMatch(/prefers-reduced-motion[\s\S]*::view-transition-old\(\*\)/);
  });
});
