import type { Metadata } from "next";
import { StudiosHome } from "@/features/studio/components/StudiosHome";

export const metadata: Metadata = {
  title: "Studios | Orazaka",
  description:
    "Ready-made, profession-specific AI workflows. Install one, configure it once, run it forever.",
};

/**
 * The Studios section: My Studios and Explore.
 *
 * A thin route shell — the tab state lives in {@link StudiosHome} because it is
 * client state, and a server component cannot hold it.
 */
export default function StudiosPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <StudiosHome />
    </main>
  );
}
