/**
 * @file seo.ts
 * @description Search engines and AI assistants (the Krizaka family contract, scripts/check-seo-family.mjs): the public
 * origin, the crawlers the whole family welcomes, the JSON-LD that leads back to the Krizaka Organization, and
 * llms.txt / llms-full.txt (llmstxt.org). Structure only — the product words are the landing's own messages.
 */
import { listPages, plainText, readDoc } from "@/features/docs/utils/docs";

/** A page's words for `llms-full.txt`: its markdown, the schema blocks as their source text. */
function plainDoc(slug: string): string | undefined {
  const doc = readDoc(slug);
  return doc ? plainText(doc.body).trim() : undefined;
}
import { features } from "@/core/context/translations.features";
import { MODELS } from "@/features/landing/utils/models";

/** The public origin of this site (dev today; the production origin replaces it here, in one place). */
export const SITE_URL = "https://dev.orazaka.com";
export const KRIZAKA_URL = "https://www.krizaka.com";
export const REPO_URL = "https://github.com/krizaka/orazaka";
/** The Krizaka Organization, defined by www.krizaka.com: every JSON-LD node of the family points back to it. */
export const ORG_ID = `${KRIZAKA_URL}/#organization`;

export const SITE_NAME = "Orazaka";
/** What the search result says: the name first, then what it is (a query for « Orazaka » or « sovereign AI platform »). */
export const SITE_TITLE = "Orazaka — open-source sovereign AI platform, self-hosted";
export const SITE_DESCRIPTION =
  "Orazaka is an open-source AI platform by Krizaka (Montréal): chat, documents, images, video and agents running on your own machines, with local models.";

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
  return ["/", ...FEATURE_IDS.map((id) => `/features/${id}`), "/gallery", "/models", "/desktop", "/docs", ...listPages().map((d) => `/docs/${d.slug}`), "/privacy", "/terms"];
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
        operatingSystem: "Linux, macOS",
        isAccessibleForFree: true,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        codeRepository: REPO_URL,
        sameAs: [REPO_URL],
        publisher: ORG,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
    ],
  };
}

// A deployed product is independent: llms.txt names its publisher and nothing else of the family — no other product.
const familySection = () => `## Publisher\n\n- [Krizaka](${KRIZAKA_URL}): the company that publishes Orazaka, an open-source software studio in Montréal\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

export function llmsText(): string {
  const pages = FEATURE_IDS.map((id) => `- [${features.en.pages[id].name}](${SITE_URL}/features/${id}): ${features.en.pages[id].lead}`);
  const docs = listPages().map((d) => `- [${d.title}](${SITE_URL}/docs/${d.slug}): ${d.intro}`);
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION} A product of Krizaka (Montréal), open source under Apache-2.0. Sign-in is closed on this development site.

## Key pages

- [Home](${SITE_URL}/): what Orazaka is
${pages.join("\n")}
- [Mobile app](${SITE_URL}/docs/mobile): recordings and screenshots of the iOS and Android app
- [Orazaka for Mac](${SITE_URL}/desktop): the Orazaka Desktop test build for Apple Silicon — what it does today, requirements, download
- [Gallery](${SITE_URL}/gallery): images made with Orazaka
- [Models](${SITE_URL}/models): the ${MODELS.length} models Orazaka supports — what each does, where it runs, its licence and context window
- [Talk to the team](${KRIZAKA_URL}/contact?topic=orazaka): the contact form lives on krizaka.com

## Documentation

- [Documentation hub](${SITE_URL}/docs): architecture, packs and Studios, the API, administration, the CLI
${docs.join("\n")}
- Full text of the documentation: ${SITE_URL}/llms-full.txt

## Source

- [Orazaka repository](${REPO_URL}): the engine and its workspace (Apache-2.0)

${familySection()}`;
}

export function llmsFullText(): string {
  const docs = listPages().map((d) => `\n---\n\n# ${d.title}\n\nURL: ${SITE_URL}/docs/${d.slug}\n\n${plainDoc(d.slug) ?? d.intro}\n`);
  return `${llmsText().replace(/\n## Publisher[\s\S]*$/, "")}\n## Documentation (full text)\n${docs.join("")}\n---\n\n${familySection()}`;
}

export const LLMS_HEADERS = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" };
