import type { Metadata } from "next";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { DocsHub, type HubJourney } from "@/features/docs/components/DocsHub";
import { JOURNEY_IDS, findPage, pageHref, pagesOf, readDoc, searchIndex, splitSegments } from "@/features/docs/utils/docs";
import { docs } from "@/core/context/translations.docs";

export const metadata: Metadata = { title: docs.en.meta, description: docs.en.metaDescription };

/** The commands of the quick start, as the CLI reference (generated from the CLI's code) writes them. */
function quickstart(): string {
  const cli = readDoc("cli");
  const block = cli && splitSegments(cli.body).find((s) => s.kind === "diagram" && s.lang === "cli-replay");
  return block?.kind === "diagram" ? block.source.trim() : "npx orazaka install\nnpx orazaka start\nnpx orazaka dev";
}

/** `/docs` — the hub of the documentation, organised by what the reader came to do. */
export default function DocsHubPage() {
  const journeys: HubJourney[] = JOURNEY_IDS.map((id) => {
    const pages = pagesOf(id);
    const links = pages.slice(0, 4).map((p) => ({ href: pageHref(p.slug), label: p.title }));
    // The install page also answers "how do I update and back up?": the run journey links its section.
    if (id === "run") links.unshift({ href: `${pageHref("self-hosting")}#living-with-it-10`, label: docs.en.updateLink });
    return { id, href: pageHref(pages[0].slug), links: links.slice(0, 4) };
  });
  const popular = ["101", "self-hosting", "api", "cli"].map((s) => findPage(s)!).map((p) => ({ href: pageHref(p.slug), title: p.title, journey: p.journey }));
  return (
    <>
      <LandingNav onHome={false} />
      <main id="main" className="min-h-screen bg-surface-0 text-fg">
        <DocsHub index={searchIndex()} journeys={journeys} quickstart={quickstart()} popular={popular} />
      </main>
      <LandingFooter />
    </>
  );
}
