import type { Metadata } from "next";
import { MobilePage } from "@/features/landing/components/MobilePage";
import { mobile } from "@/core/context/translations.mobile";

export const metadata: Metadata = { title: mobile.en.meta, description: mobile.en.metaDescription };

/** /mobile — every recording and screenshot of the iOS and Android app. */
export default function Page() {
  return <MobilePage />;
}
