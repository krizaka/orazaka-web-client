"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/core/context/LocaleContext";
import { StudioApi } from "@/services/studio.api";

/**
 * Whether a pack is REGULATED, so its Studios ask for consent (ADR-055).
 *
 * Read from the catalogue, which the server serves. A catalogue that does not answer, or a pack that is not in it,
 * is `false`: the note is a courtesy, the 451 on the first run is the guard.
 */
export function useRegulated(packKey: string | null): boolean {
  const { locale } = useTranslation();
  const [regulated, setRegulated] = useState(false);

  useEffect(() => {
    if (!packKey) return;
    let live = true;
    StudioApi.fetchPacks(null, locale)
      .then((packs) => live && setRegulated(packs.some((pack) => pack.packKey === packKey && pack.regulatoryClass === "REGULATED")))
      .catch(() => live && setRegulated(false));
    return () => { live = false; };
  }, [packKey, locale]);

  return regulated;
}
