/** @jest-environment node */
import { NextRequest } from "next/server";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CLOSED_ROBOTS, indexable, NOINDEX_HEADER } from "@/core/config/indexing";
import { proxy } from "@/proxy";
import { landing } from "@/core/context/translations.landing";
import { auditRobots } from "../../scripts/check-seo-family.mjs";

const withFlag = <T,>(value: string | undefined, run: () => T): T => {
  const before = process.env.APP_SEARCH_INDEXING;
  if (value === undefined) delete process.env.APP_SEARCH_INDEXING;
  else process.env.APP_SEARCH_INDEXING = value;
  try {
    return run();
  } finally {
    if (before === undefined) delete process.env.APP_SEARCH_INDEXING;
    else process.env.APP_SEARCH_INDEXING = before;
  }
};
const ask = (path: string) => proxy(new NextRequest(`https://dev.orazaka.com${path}`));

describe("APP_SEARCH_INDEXING — one flag closes the deployment to search engines", () => {
  it("is open by default, closed only by off", () => {
    expect(indexable({})).toBe(true);
    expect(indexable({ APP_SEARCH_INDEXING: "OFF" })).toBe(false);
  });

  it("off: noindex on every response — pages, login, the BFF (404 or not), robots", () => {
    withFlag("off", () => {
      for (const path of ["/", "/docs", "/login", "/dashboard", "/api/v1/profile", "/api/auth/session", "/robots.txt"]) {
        expect(ask(path).headers.get("x-robots-tag"), path).toBe(NOINDEX_HEADER);
      }
    });
  });

  it("on: nothing is added", () => {
    withFlag(undefined, () => expect(ask("/").headers.get("x-robots-tag")).toBeNull());
  });

  it("off: robots.txt disallows everything and names no sitemap; the sitemap is empty", () => {
    withFlag("off", () => {
      const r = robots();
      expect(r.sitemap).toBeUndefined();
      expect(r.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
      expect(auditRobots(CLOSED_ROBOTS, { host: "https://dev.orazaka.com", index: false })).toEqual([]);
      expect(sitemap()).toEqual([]);
    });
    withFlag(undefined, () => expect(sitemap().length).toBeGreaterThan(0));
  });

  it("the dev line exists in both languages", () => {
    expect(landing.en.footer.devNotice).toBe("Development environment — access by invitation");
    expect(landing.fr.footer.devNotice).toBe("Environnement de développement — accès sur invitation");
  });
});
