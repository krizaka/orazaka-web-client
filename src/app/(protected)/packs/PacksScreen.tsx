"use client";

import { useMemo } from "react";
import { PackMarketplace } from "@/features/billing/components/PackMarketplace";
import { useStudios } from "@/features/studio/hooks/useStudios";

/**
 * The packs screen: the marketplace (billing) with the Studio catalogue's names and icons (studio). Composed here, at
 * the app layer, because one feature never imports another (dependency-cruiser, no-feature-cross-import).
 */
export function PacksScreen() {
  const { studios: catalogue } = useStudios(null);
  const studios = useMemo(() => new Map(catalogue.map((s) => [s.studioKey, { label: s.label, iconKey: s.iconKey }])), [catalogue]);
  return <PackMarketplace studios={studios} />;
}
