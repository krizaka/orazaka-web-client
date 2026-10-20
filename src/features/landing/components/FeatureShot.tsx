"use client";

import Image from "next/image";
import { mediaUrl } from "@/core/media/cdn";
import { useAppearance } from "@/features/landing/components/useAppearance";

/** The screens the three capabilities show: the poster of each web step (recorded on dev.orazaka.com, 1120×700 WebP). */
export const SHOTS = { studios: "studio", records: "results", home: "workspace" } as const;
export type ShotId = keyof typeof SHOTS;

/** A real screen of the app in the theme of the page — lazy, its box reserved, so it never shifts the page. */
export function FeatureShot({ id, alt }: Readonly<{ id: ShotId; alt: string }>) {
  const look = useAppearance();
  return (
    // Served as it is from the CDN (already optimised WebP): `unoptimized`.
    <Image
      src={mediaUrl(`products/orazaka/web/step-${SHOTS[id]}-${look}-poster.webp`)}
      alt={alt}
      width={1120}
      height={700}
      loading="lazy"
      unoptimized
      className="block h-auto w-full rounded-lg border border-border-subtle"
    />
  );
}
