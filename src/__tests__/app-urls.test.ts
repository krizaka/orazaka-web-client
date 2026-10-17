import fs from "node:fs";
import path from "node:path";
import { APP_SECTIONS } from "@/core/config/app-sections";

/** The signed-in app's addresses say the section's name (docs/ux/information-architecture.md); the old ones answer 308. */
const RENAMED = [
  { from: "/dashboard/jobs", to: "/jobs", section: "jobs" },
  { from: "/billing", to: "/usage", section: "usage" },
  { from: "/profile", to: "/settings", section: "settings" },
] as const;

describe("the app's addresses", () => {
  it.each(RENAMED)("$from answers 308 towards $to, and keeps its query", async ({ from, to }) => {
    const { default: nextConfig } = (await import(path.join(process.cwd(), "next.config.ts"))) as { default: { redirects: () => Promise<{ source: string; destination: string; permanent: boolean }[]> } };
    const redirects = await nextConfig.redirects();
    const rule = redirects.find((r) => r.source === from);
    expect(rule).toMatchObject({ destination: to, permanent: true });
  });

  it.each(RENAMED)("the rail's « $section » is $to, a page that exists", ({ to, section }) => {
    expect(APP_SECTIONS.find((s) => s.id === section)?.href).toBe(to);
    const dir = to === "/usage" ? "src/app/(protected)/usage" : `src/app${to}`;
    expect(fs.existsSync(path.join(process.cwd(), dir, "page.tsx"))).toBe(true);
  });

  it("no source file still links an old address", () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) {
          if (e.name !== "__tests__" && e.name !== "node_modules") walk(p);
        } else if (/\.(ts|tsx)$/.test(e.name) && /["'`]\/(dashboard\/jobs|billing|profile)\b/.test(fs.readFileSync(p, "utf8"))) hits.push(p);
      }
    };
    walk(path.join(process.cwd(), "src"));
    expect(hits).toEqual([]);
  });
});
