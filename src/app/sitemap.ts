import type { MetadataRoute } from "next";
import { publicPaths, SITE_URL } from "@/core/config/seo";

/** The public pages, dated by the build. The language is chosen in the page (one URL), so there is no hreflang to declare. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicPaths().map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path.startsWith("/docs") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/features") || path === "/docs" ? 0.8 : 0.5,
  }));
}
