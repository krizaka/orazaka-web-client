import type { Metadata } from "next";
import { DesktopPage } from "@/features/desktop/components/DesktopPage";
import { loadDesktopRelease } from "@/features/desktop/utils/release";
import { translations } from "@/core/context/translations";

const m = translations.en.desktop.meta;

export const metadata: Metadata = {
  title: m.title,
  description: m.description,
  alternates: { canonical: "/desktop" },
};

/** `/desktop` — Orazaka for Mac. The download is read from the latest `desktop-*` GitHub release (refreshed hourly). */
export default async function Page() {
  const release = await loadDesktopRelease();
  return <DesktopPage release={release} />;
}
