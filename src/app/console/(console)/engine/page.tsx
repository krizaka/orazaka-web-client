import type { Metadata } from "next";
import { EngineScreen } from "@/console/features/engine/components/EngineScreen";

export const metadata: Metadata = { title: "Engine · Orazaka Operations" };

/** `/engine` — the engine's runtime settings, grouped, edited in place; a change applies on the next read. */
export default function EnginePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <EngineScreen />
    </main>
  );
}
