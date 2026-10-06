import type { Metadata } from "next";
import { PackMarketplace } from "@/features/billing/components/PackMarketplace";

export const metadata: Metadata = {
  title: "Packs | Orazaka",
  description:
    "Business and lifestyle bundles that add capabilities to your plan. Add one to your account and its Studios unlock immediately.",
};

/**
 * The packs marketplace route.
 *
 * A thin shell — the catalogue, the ownership overlay and the add/remove actions are
 * client state, which a server component cannot hold.
 */
export default function PacksPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <PackMarketplace />
    </main>
  );
}
