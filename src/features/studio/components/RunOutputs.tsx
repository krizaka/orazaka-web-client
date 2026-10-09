"use client";

import { useState } from "react";
import { Icon } from "@krizaka/orazaka-design-system";
import type { RunArtefact } from "@krizaka/orazaka-shared";
import { useTranslation } from "@/core/context/LocaleContext";

interface RunOutputsProps {
  outputs: readonly RunArtefact[];
}

/**
 * What the run produced, rendered as the blueprint said it should be.
 *
 * Every value gets a copy button, because the whole point of the product is that the
 * professional takes the result somewhere else — a caption they cannot copy is a
 * caption they have to retype. Media gets a player or a preview as well: a Reel shown
 * as its asset id is a Reel the actor cannot tell succeeded.
 */
export function RunOutputs({ outputs }: Readonly<RunOutputsProps>) {
  const { t } = useTranslation();

  if (outputs.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="hud-label text-[10px] text-fg-muted">{t.studio.runOutputs}</h2>
      <div className="flex flex-col divide-y divide-border-subtle border border-border-subtle">
        {outputs.map((artefact) => (
          <RunOutputRow key={artefact.key} artefact={artefact} />
        ))}
      </div>
    </section>
  );
}

interface RunOutputRowProps {
  artefact: RunArtefact;
}

/** One artefact with its copy action. A sub-component so the list stays a list. */
function RunOutputRow({ artefact }: Readonly<RunOutputRowProps>) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(artefact.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="flex flex-col gap-2 p-3">
      <header className="flex items-start gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="hud-label text-[10px] text-fg-muted">{artefact.label}</span>
          {artefact.type === "TEXT" ? (
            <span className="text-[12px] text-fg break-words whitespace-pre-wrap">
              {artefact.value}
            </span>
          ) : (
            <span className="text-[11px] text-fg-muted break-all">{artefact.value}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => void copy()}
          className="ml-auto flex-shrink-0 h-7 px-2 inline-flex items-center gap-1 text-[11px] font-medium border border-border-subtle text-fg-secondary hover:bg-surface-2 transition-colors duration-150"
        >
          <Icon name={copied ? "check" : "copy"} size={12} />
          {copied ? t.studio.copied : t.studio.copy}
        </button>
      </header>
      <ArtefactMedia artefact={artefact} />
    </article>
  );
}

/**
 * The playable or viewable form of a media artefact.
 *
 * The value is the public URL the executor published, so it is used as-is; a root-relative
 * path is resolved against the current origin the same way the jobs dashboard does it.
 */
function ArtefactMedia({ artefact }: Readonly<RunOutputRowProps>) {
  if (artefact.type === "TEXT" || artefact.value === "") {
    return null;
  }

  const source =
    globalThis.window !== undefined && artefact.value.startsWith("/")
      ? `${globalThis.location.origin}${artefact.value}`
      : artefact.value;

  if (artefact.type === "VIDEO") {
    return (
      <video
        src={source}
        controls
        playsInline
        className="w-full max-w-sm border border-border-subtle"
      >
        <track kind="captions" />
      </video>
    );
  }

  if (artefact.type === "AUDIO") {
    return (
      <audio src={source} controls className="w-full max-w-sm">
        <track kind="captions" />
      </audio>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- a run artefact is a runtime URL,
       so there is no build-time source for next/image to optimise. */
    <img
      src={source}
      alt={artefact.label}
      className="w-full max-w-sm border border-border-subtle"
    />
  );
}
