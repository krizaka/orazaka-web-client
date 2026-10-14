import type { Metadata } from "next";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { STYLES, type GalleryStyle } from "@/features/landing/utils/gallery";
import { gallery } from "@/core/context/translations.gallery";

export const metadata: Metadata = { title: gallery.en.meta, description: gallery.en.metaDescription };

/** /gallery — every image made here; `?style=` filters by art direction (an unknown value shows them all). */
export default async function Page({ searchParams }: Readonly<{ searchParams: Promise<{ style?: string }> }>) {
  const { style } = await searchParams;
  const known = STYLES.find((s): s is GalleryStyle => s === style);
  return <GalleryPage only={known} />;
}
