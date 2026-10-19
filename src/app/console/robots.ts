import type { MetadataRoute } from "next";

/** The console is never indexed (served as /robots.txt on admin.orazaka.com; the public host answers 404 here). */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
