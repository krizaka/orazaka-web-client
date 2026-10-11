"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, DownloadIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
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
      <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{t.studio.runOutputs}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {outputs.map((artefact, index) => (
          <RunOutputRow key={artefact.key} artefact={artefact} index={index} />
        ))}
      </div>
    </section>
  );
}

interface RunOutputRowProps {
  artefact: RunArtefact;
  index?: number;
}

/** One artefact: the media first (what impresses), then its label and its actions. */
function RunOutputRow({ artefact, index }: Readonly<RunOutputRowProps>) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const media = artefact.type !== "TEXT" && artefact.value !== "";

  const copy = async () => {
    await navigator.clipboard.writeText(artefact.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card.Root reveal={index} className={media ? undefined : "md:col-span-2"}>
      <ArtefactMedia artefact={artefact} />
      <Card.Body className="gap-2">
        <header className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{artefact.label}</span>
          <span className="ml-auto flex items-center gap-1.5">
            {media && (
              <Button asChild variant="secondary" size="sm">
                <a href={artefact.value} download>
                  <DownloadIcon size={14} />
                  {t.showcase.studio.download}
                </a>
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => void copy()}>
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              {copied ? t.studio.copied : t.studio.copy}
            </Button>
          </span>
        </header>
        {artefact.type === "TEXT" ? (
          <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-fg">{artefact.value}</p>
        ) : null}
      </Card.Body>
    </Card.Root>
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
        className="aspect-video w-full bg-media object-contain"
      >
        <track kind="captions" />
      </video>
    );
  }

  if (artefact.type === "AUDIO") {
    return (
      <audio src={source} controls className="w-full px-4 pt-4">
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
      className="aspect-[4/3] w-full bg-media object-cover"
    />
  );
}
