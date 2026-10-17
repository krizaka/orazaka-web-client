/**
 * @file cinema-films.ts
 * @description The cinematic shorts of "Made here" (krizaka/orazaka ADR-080): each film is a real `orazaka cinema`
 * production on dev.orazaka.com — a script, keyframes, shots (Wan 2.2 I2V A14B), the cut, a voice-over and the sound,
 * every step an ordinary Studio run. The LIST of films is the media manifest (`media.generated.json`:
 * `products/orazaka/cinema/<film>.mp4` with its webm and poster); `RECORDS` holds what the production recorded, keyed by
 * the file. A published film without its record, or a record without its files, fails the build.
 * Words: `t.gallery.films`.
 */
import { hasMedia, mediaPaths, mediaUrl } from "@/core/media/cdn";
import records from "./cinema-films.generated.json";

/** What a production recorded about its film: generated from its production file, never typed. */
export interface FilmRecord {
  /** The key of its words in `t.gallery.films.items`. */
  id: string;
  aspect: "9:16" | "16:9";
  width: number;
  height: number;
  /** The film's length, in seconds (measured on the file). */
  duration: number;
  shots: number;
  /** Shots made again after a person looked at them. */
  reshoots: number;
  /** Every Studio run of the production, failures included. */
  runs: number;
  /** The runs that made the film: script, cut and sound. */
  scriptRunId: string;
  cutRunId: string;
  soundRunId: string;
  /** The production's GPU time and its cost at the pod's hourly rate (the shots, keyframes, cut and sound). */
  gpuSeconds: number;
  gpuUsd: number;
  /** Wall time of the whole production, from the script's start to the sound's end. */
  productionSeconds: number;
  models: { script: string; image: string; video: string; upscale?: string; music: string; voice?: string };
  /** The `orazaka cinema new` command of the production (its brief, format, aspect, length, shots and seed). */
  command: string;
}

export interface CinemaFilm extends FilmRecord {
  /** The media path without extension: `products/orazaka/cinema/nightfall`. */
  stem: string;
}

const FILM_FILE = /^products\/orazaka\/cinema\/([a-z0-9-]+)\.mp4$/;
const RECORDS = records as Record<string, FilmRecord>;

function discover(): CinemaFilm[] {
  const order = Object.keys(RECORDS);
  const found = mediaPaths("products/orazaka/cinema/")
    .map((path) => FILM_FILE.exec(path))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => {
      const stem = match[0].slice(0, -".mp4".length);
      const record = RECORDS[stem];
      if (!record) throw new Error(`${match[0]} is published but no production recorded it (cinema-films.generated.json)`);
      for (const extra of [`${stem}.webm`, `${stem}-poster.webp`]) if (!hasMedia(extra)) throw new Error(`${extra} is missing beside ${match[0]}`);
      return { ...record, stem };
    });
  for (const stem of order) if (!found.some((film) => film.stem === stem)) throw new Error(`${stem} has a record but is not published`);
  return found.sort((a, b) => order.indexOf(a.stem) - order.indexOf(b.stem));
}

export const FILMS: readonly CinemaFilm[] = discover();

export const filmFiles = (film: CinemaFilm) => ({
  mp4: mediaUrl(`${film.stem}.mp4`),
  webm: mediaUrl(`${film.stem}.webm`),
  poster: mediaUrl(`${film.stem}-poster.webp`),
});

/** Dollars of GPU per minute of finished film: what a minute of this kind of film costs to make. */
export const usdPerMinute = (film: FilmRecord): number => Math.round((film.gpuUsd / film.duration) * 60 * 100) / 100;
