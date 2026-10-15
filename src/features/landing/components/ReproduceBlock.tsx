"use client";

import { CodeBlock } from "@krizaka/ui/code-block";
import { useTranslation } from "@/core/context/LocaleContext";
import { reproduceParts, type GalleryItem, type ReproducePart } from "@/features/landing/utils/gallery";

/**
 * "Reproduce it": the Orazaka CLI commands that make this item again — same model, same Studio, same subject, size and
 * seed (orazaka-cli: `models image use`, `studio run --studio … --inputs-file`, `video --model … --seed`). Each part is a
 * `@krizaka/ui` CodeBlock highlighted in its own language (shell, then the JSON inputs file), with its copy button.
 * Proof that it is reproducible.
 */
export function ReproduceBlock({ item, heading = true, parts, lead }: Readonly<{ item?: GalleryItem; heading?: boolean; parts?: ReproducePart[]; lead?: string }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const shown = parts ?? (item ? reproduceParts(item) : []);
  return (
    <section aria-label={g.reproduce} className="space-y-2 rounded-xl border border-border-default bg-surface-1/70 p-3">
      {heading && <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent">{g.reproduce}</h4>}
      <p className="text-xs leading-relaxed text-fg-secondary">{lead ?? g.reproduceLead}</p>
      <div className="space-y-2">
        {shown.map((part) => (
          <CodeBlock
            key={`${part.file}-${part.code.slice(0, 24)}`}
            code={part.code}
            language={part.language}
            file={part.file}
            copyLabel={g.copyCommand}
            copiedLabel={g.commandCopied}
          />
        ))}
      </div>
    </section>
  );
}
