"use client";

import { VideoResult, type RunFact } from "@krizaka/orazaka-design-system";
import { cn } from "@krizaka/ui/cn";
import { useTranslation } from "@/core/context/LocaleContext";
import { fill } from "@/core/context/fill";
import { FILMS, filmFiles, usdPerMinute, type CinemaFilm } from "@/features/landing/utils/cinema-films";

/**
 * The cinematic shorts of /gallery (krizaka/orazaka ADR-080): each a real `orazaka cinema` production on dev.orazaka.com,
 * with what it recorded — its shots, its runs, its GPU time and what a minute of it cost. A 9:16 film sits in a narrow
 * column, a 16:9 one takes the row. Nothing is shown when no film is published.
 */
export function GalleryFilms() {
  const { t } = useTranslation();
  const g = t.gallery;
  if (FILMS.length === 0) return null;
  return (
    <section id="films" aria-labelledby="films-title" className="space-y-6">
      <div className="space-y-2">
        <h2 id="films-title" className="font-display text-2xl font-bold tracking-tight">{g.filmsTitle}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-fg-secondary">{g.filmsLead}</p>
      </div>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {FILMS.map((film) => (
          <li
            key={film.id}
            id={`film-${film.id}`}
            className={cn("min-w-0 rounded-2xl border border-border-default bg-surface-1 p-4 sm:p-5", film.aspect === "16:9" && "md:col-span-2 lg:col-span-3")}
          >
            <FilmCard film={film} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function FilmCard({ film }: Readonly<{ film: CinemaFilm }>) {
  const { t } = useTranslation();
  const g = t.gallery;
  const words = g.films[film.id];
  const facts: RunFact[] = [
    { label: g.filmFrame, value: `${film.width}×${film.height} · ${film.aspect} · ${fill(g.seconds, { seconds: film.duration })}` },
    { label: g.filmShots, value: fill(g.filmShotsValue, { shots: film.shots, reshoots: film.reshoots }) },
    { label: g.filmModels, value: [film.models.video, film.models.image, film.models.upscale, film.models.music, film.models.voice].filter(Boolean).join(" · ") },
    { label: g.filmRuns, value: fill(g.filmRunsValue, { runs: film.runs }) },
    { label: g.runId, value: film.soundRunId },
    { label: g.filmGpu, value: fill(g.filmGpuValue, { minutes: Math.round(film.gpuSeconds / 60), cost: film.gpuUsd.toFixed(2) }) },
    { label: g.filmPerMinute, value: fill(g.cost, { cost: usdPerMinute(film).toFixed(2) }) },
  ];
  return (
    <article aria-label={words.title} className="space-y-3">
      <h3 className="text-sm font-semibold text-fg">{words.title}</h3>
      <p className="text-sm leading-relaxed text-fg-secondary">{words.logline}</p>
      <VideoResult
        title={words.title}
        sources={filmFiles(film)}
        orientation={film.aspect === "9:16" ? "portrait" : "landscape"}
        prompt={words.brief}
        reproduce={film.command}
        reproduceLead={g.filmReproduceLead}
        downloadHref={filmFiles(film).mp4}
        facts={facts}
        labels={{
          badge: fill(g.filmBadge, { seconds: Math.round(film.duration) }),
          play: g.videoPlay,
          pause: g.videoPause,
          mute: g.videoMute,
          unmute: g.videoUnmute,
          enlarge: g.videoEnlarge,
          close: g.videoClose,
          prompt: g.filmBriefHeading,
          facts: g.runHeading,
          reproduce: g.reproduce,
          copy: g.copyCommand,
          copied: g.commandCopied,
          download: g.videoDownload,
        }}
      />
    </article>
  );
}
