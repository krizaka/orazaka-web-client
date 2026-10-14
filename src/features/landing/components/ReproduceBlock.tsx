"use client";

import { useTranslation } from "@/core/context/LocaleContext";
import { reproduceCommand, type GalleryItem } from "@/features/landing/utils/gallery";
import { CopyButton } from "@/features/landing/components/CopyButton";

/**
 * "Reproduce it": the Orazaka CLI commands that make this image again — same model, same Studio, same subject, size and
 * seed (orazaka-cli: `models image use`, `studio run --studio … --inputs-file`). Proof that it is local and reproducible.
 */
export function ReproduceBlock({ item, heading = true }: Readonly<{ item: GalleryItem; heading?: boolean }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const command = reproduceCommand(item);
  return (
    <section aria-label={g.reproduce} className="space-y-2 rounded-xl border border-border-default bg-surface-1/70 p-3">
      {heading && <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.reproduce}</h4>}
      <p className="text-xs leading-relaxed text-fg-secondary">{g.reproduceLead}</p>
      <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-[11.5px] leading-relaxed text-fg" tabIndex={0}>
        <code>{command}</code>
      </pre>
      <CopyButton text={command} label={g.copyCommand} done={g.commandCopied} failed={g.copyFailed} />
    </section>
  );
}
