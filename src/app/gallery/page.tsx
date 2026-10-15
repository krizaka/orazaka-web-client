import type { Metadata } from "next";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { STYLES, type GalleryStyle } from "@/features/landing/utils/gallery";
import { gallery } from "@/core/context/translations.gallery";

export const metadata: Metadata = { title: gallery.en.meta, description: gallery.en.metaDescription };

/** /gallery — everything made here: the videos, then the images; `?kind=videos|compare|images` lists one kind, `?style=` filters the images by art direction (an unknown value shows them all). */
export default async function Page({ searchParams }: Readonly<{ searchParams: Promise<{ style?: string; kind?: string }> }>) {
  const { style, kind } = await searchParams;
  const known = STYLES.find((s): s is GalleryStyle => s === style);
  return <GalleryPage only={known} kind={kind === "videos" || kind === "images" || kind === "compare" ? kind : undefined} />;
}
