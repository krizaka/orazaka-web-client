/**
 * @file seo.ts
 * @description Search engines and AI assistants (the Krizaka family contract, scripts/check-seo-family.mjs): the public
 * origin, the crawlers the whole family welcomes, the JSON-LD that leads back to the Krizaka Organization, and
 * llms.txt / llms-full.txt (llmstxt.org). Structure only — the product words are the landing's own messages.
 */
import { listDocs, readDoc } from "@/features/docs/utils/docs";
import { features } from "@/core/context/translations.features";

/** The public origin of this site (dev today; the production origin replaces it here, in one place). */
export const SITE_URL = "https://dev.orazaka.com";
export const KRIZAKA_URL = "https://www.krizaka.com";
export const REPO_URL = "https://github.com/krizaka/orazaka";
/** The Krizaka Organization, defined by www.krizaka.com: every JSON-LD node of the family points back to it. */
export const ORG_ID = `${KRIZAKA_URL}/#organization`;

export const SITE_NAME = "Orazaka";
export const SITE_TITLE = "Orazaka — the AI that never leaves home";
export const SITE_DESCRIPTION =
  "Sovereign AI workspace by Krizaka: chat, documents, images, video and agents running on your own machines.";

/** The search bots and AI crawlers the whole family welcomes — the same list on every site. */
export const CRAWLERS = [
  "Googlebot", "Google-Extended", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User",
  "Claude-SearchBot", "Claude-User", "ClaudeBot", "anthropic-ai", "Applebot", "Applebot-Extended", "CCBot",
] as const;

/** What a crawler may not walk into: the signed-in workspace, the BFF and the account forms. */
export const PRIVATE_PATHS = ["/api/", "/dashboard", "/chat", "/profile", "/interceptions", "/login", "/register", "/verify", "/forgot-password"];

const FEATURE_IDS = Object.keys(features.en.pages) as (keyof typeof features.en.pages)[];

/** Every public page, in the order of the sitemap. */
export function publicPaths(): string[] {
  return ["/", ...FEATURE_IDS.map((id) => `/features/${id}`), "/mobile", "/gallery", "/docs", ...listDocs().map((d) => `/docs/${d.slug}`), "/contact", "/privacy", "/terms"];
}

const ORG = { "@type": "Organization", "@id": ORG_ID, name: "Krizaka", url: KRIZAKA_URL };

/** The site and the product it presents, both published by the Krizaka Organization. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: ["en", "fr"], publisher: ORG },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Linux, macOS, Windows",
        isAccessibleForFree: true,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        codeRepository: REPO_URL,
        publisher: ORG,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
    ],
  };
}

const FAMILY = [
  ["Krizaka", KRIZAKA_URL, "the company, an open-source software studio in Montréal"],
  ["Orochia", "https://dev.orochia.com", "an open-source video platform"],
  ["Yasakia", "https://dev.yasakia.com", "a mobile dating app where you talk first"],
  ["Yororis", "https://dev.yororis.com", "a listening space with a face and a voice"],
  ["Krizaka UI", "https://ui.krizaka.com", "the design system, web and native"],
  ["Krizaka Java", "https://java.krizaka.com", "the Spring Boot building blocks"],
] as const;

const familySection = () => `## The Krizaka family\n\n${FAMILY.map(([name, url, line]) => `- [${name}](${url}): ${line}`).join("\n")}\n- [GitHub](https://github.com/krizaka): every repository, public\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

export function llmsText(): string {
  const pages = FEATURE_IDS.map((id) => `- [${features.en.pages[id].name}](${SITE_URL}/features/${id}): ${features.en.pages[id].lead}`);
  const docs = listDocs().map((d) => `- [${d.title}](${SITE_URL}/docs/${d.slug}): ${d.intro}`);
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION} A product of Krizaka (Montréal), open source under Apache-2.0. Sign-in is closed on this development site.

## Key pages

- [Home](${SITE_URL}/): what Orazaka is
${pages.join("\n")}
- [Mobile app](${SITE_URL}/mobile): recordings and screenshots of the iOS and Android app
- [Gallery](${SITE_URL}/gallery): images made with Orazaka
- [Contact](${SITE_URL}/contact): talk to the team

## Documentation

- [Documentation hub](${SITE_URL}/docs): architecture, packs and Studios, the API, administration, the CLI
${docs.join("\n")}
- Full text of the documentation: ${SITE_URL}/llms-full.txt

## Source

- [Orazaka repository](${REPO_URL}): the engine and its workspace (Apache-2.0)

${familySection()}`;
}

export function llmsFullText(): string {
  const docs = listDocs().map((d) => `\n---\n\n# ${d.title}\n\nURL: ${SITE_URL}/docs/${d.slug}\n\n${readDoc(d.slug)?.body.trim() ?? d.intro}\n`);
  return `${llmsText().replace(/\n## The Krizaka family[\s\S]*$/, "")}\n## Documentation (full text)\n${docs.join("")}\n---\n\n${familySection()}`;
}

export const LLMS_HEADERS = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" };
