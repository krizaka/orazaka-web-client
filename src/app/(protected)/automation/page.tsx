import ConnectorCatalogue from "@/features/automation/components/ConnectorCatalogue";
import LiveJobGrid from "@/features/automation/components/LiveJobGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automations | Orazaka",
  description: "Connect your tools, approve jobs and follow their execution.",
};

/** The automation page: the connector catalogue and the jobs awaiting approval, on the @krizaka/ui primitives. */
export default function AutomationPage() {
  return (
    <main className="ambient-grid min-h-full">
      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <ConnectorCatalogue />
        <LiveJobGrid />
      </section>
    </main>
  );
}
