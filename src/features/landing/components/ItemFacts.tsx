"use client";

import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { GALLERY_MODEL, type GalleryItem } from "@/features/landing/utils/gallery";

/** What the data records about an image — and nothing else: the Studio, the model, the seed, the size, the time on one Mac. */
export function ItemFacts({ item }: Readonly<{ item: GalleryItem }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const rows: [string, string][] = [
    [g.studio, item.studio],
    [g.model, GALLERY_MODEL.name],
    [g.seedValue, item.seed],
    [g.size, `${item.width}×${item.height}`],
    [g.time, fill(g.local, { seconds: item.seconds })],
  ];
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-fg-muted">{k}</dt>
          <dd className="text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
