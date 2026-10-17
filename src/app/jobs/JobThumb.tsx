"use client";

import { ChatIcon, ImageIcon, SoundIcon, VideoIcon } from "@krizaka/icons";
import { jobKind, jobMediaUrl } from "@/core/jobs/jobMedia";
import type { Job } from "@/core/types/jobs.types";

/** The preview of a job in its row: the picture, the first frame of the clip, or the kind's glyph. A box of fixed size. */
export function JobThumb({ job, label }: Readonly<{ job: Job; label: string }>) {
  const kind = jobKind(job);
  const url = jobMediaUrl(job);
  const Glyph = kind === "video" ? VideoIcon : kind === "audio" ? SoundIcon : kind === "text" ? ChatIcon : ImageIcon;
  return (
    <span className="relative inline-grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-md border border-border-subtle bg-surface-2 text-fg-muted">
      {url && kind === "image" ? (
        /* eslint-disable-next-line @next/next/no-img-element -- a generated asset is a runtime URL. */
        <img src={url} alt={label} className="h-full w-full object-cover" loading="lazy" />
      ) : url && kind === "video" ? (
        <video src={`${url}#t=0.1`} muted playsInline preload="metadata" aria-label={label} className="h-full w-full object-cover" />
      ) : (
        <Glyph size={18} />
      )}
    </span>
  );
}
