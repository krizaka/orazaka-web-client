/** @jest-environment node */
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { CRAWLERS, KRIZAKA_URL, llmsFullText, llmsText, ORG_ID, publicPaths, SITE_URL, siteJsonLd } from "@/core/config/seo";
import { auditLlms, auditRobots, auditSitemap } from "../../scripts/check-seo-family.mjs";

/** MetadataRoute.Robots as the text Next serves. */
function robotsText(r: ReturnType<typeof robots>): string {
  const rules = ([] as NonNullable<ReturnType<typeof robots>["rules"]>[number][]).concat(r.rules);
  const groups = rules.map((rule) => [`User-Agent: ${rule.userAgent}`, `Allow: ${rule.allow}`, ...([] as string[]).concat(rule.disallow ?? []).map((d) => `Disallow: ${d}`)].join("\n"));
  return `${groups.join("\n\n")}\n\nSitemap: ${r.sitemap}\n`;
}

describe("search engines and AI assistants (the Krizaka family contract)", () => {
  it("robots.txt welcomes every AI crawler, keeps the workspace private and names the sitemap", () => {
    const text = robotsText(robots());
    expect(auditRobots(text, { host: SITE_URL })).toEqual([]);
    for (const bot of CRAWLERS) expect(text).toContain(`User-Agent: ${bot}`);
    expect(text).toContain("Disallow: /dashboard");
  });

  it("sitemap.xml lists the home, the features and every published doc on the host", () => {
    const entries = sitemap();
    const xml = `<urlset>${entries.map((e) => `<url><loc>${e.url}</loc><lastmod>${new Date(e.lastModified as Date).toISOString()}</lastmod></url>`).join("")}</urlset>`;
    expect(auditSitemap(xml, { host: SITE_URL, minUrls: 10 })).toEqual([]);
    expect(entries.map((e) => e.url)).toContain(`${SITE_URL}/features/unified-engine`);
    expect(publicPaths()).toContain("/docs/architecture");
  });

  it("llms.txt and llms-full.txt follow llmstxt.org, name this host and link the family", () => {
    expect(auditLlms(llmsText(), { host: SITE_URL })).toEqual([]);
    expect(auditLlms(llmsFullText(), { host: SITE_URL, full: true })).toEqual([]);
    expect(llmsFullText().length).toBeGreaterThan(llmsText().length * 5);
  });

  it("the JSON-LD names the Krizaka Organization on www as publisher of the site and the application", () => {
    const graph = siteJsonLd()["@graph"] as { "@type": string; publisher: { "@id": string; url: string } }[];
    expect(ORG_ID).toBe(`${KRIZAKA_URL}/#organization`);
    expect(graph.map((n) => n.publisher["@id"])).toEqual([ORG_ID, ORG_ID]);
    expect(graph.find((n) => n["@type"] === "SoftwareApplication")).toMatchObject({ applicationCategory: "BusinessApplication" });
  });

  it.each(["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt", "/opengraph-image"])("the sign-in proxy lets crawlers read %s", (path) => {
    const res = proxy(new NextRequest(`${SITE_URL}${path}`));
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });
});
