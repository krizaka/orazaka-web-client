/**
 * @file translations.clips.ts
 * @description The words of the demo clips (en, fr): what each shows for assistive technology, its one-line caption under
 * the clip, and its captions (`<track>`, served by /captions/<clip>/<lang>). Each line says what the recording shows.
 */
import type { ClipId } from "@/features/clips/clips";

export interface ClipCopy {
  alt: string;
  caption: string;
  cues: readonly string[];
}
export type ClipsDictionary = Record<ClipId, ClipCopy>;

export const clips = {
  en: {
    take: {
      alt: "The Orazaka chat: a question typed, the request routed, the answer written.",
      caption: "Eric asks a question; the answer is written on this machine.",
      cues: ["Eric types a question.", "Orazaka routes the request.", "The answer is written on this machine."],
    },
    workspace: {
      alt: "The workspace home: jobs, success rate, time to a result.",
      caption: "Eric's workspace: what ran, and how fast.",
      cues: ["Eric's workspace.", "Jobs, success rate and time to a result, over 14 days."],
    },
    studio: {
      alt: "The Studios catalogue, then the Image generation Studio with its estimated cost.",
      caption: "A Studio shows its price before it runs.",
      cues: ["The Studios catalogue.", "A Studio opens with its estimated cost, before any run."],
    },
    results: {
      alt: "The jobs gallery, then one result opened with its run id.",
      caption: "Every result keeps its run.",
      cues: ["Every result is kept under Jobs.", "One result opened: its steps and its run id."],
    },
  },
  fr: {
    take: {
      alt: "Le chat d'Orazaka : une question tapée, la requête routée, la réponse écrite.",
      caption: "Eric pose une question ; la réponse s'écrit sur cette machine.",
      cues: ["Eric tape une question.", "Orazaka route la requête.", "La réponse s'écrit sur cette machine."],
    },
    workspace: {
      alt: "L'accueil de l'espace de travail : tâches, taux de réussite, temps jusqu'au résultat.",
      caption: "L'espace d'Eric : ce qui a tourné, et à quelle vitesse.",
      cues: ["L'espace de travail d'Eric.", "Tâches, taux de réussite et temps jusqu'au résultat, sur 14 jours."],
    },
    studio: {
      alt: "Le catalogue des Studios, puis le Studio de génération d'image avec son coût estimé.",
      caption: "Un Studio annonce son prix avant de tourner.",
      cues: ["Le catalogue des Studios.", "Un Studio s'ouvre avec son coût estimé, avant tout run."],
    },
    results: {
      alt: "La galerie des tâches, puis un résultat ouvert avec son identifiant de run.",
      caption: "Chaque résultat garde son run.",
      cues: ["Chaque résultat est conservé dans Tâches.", "Un résultat ouvert : ses étapes et son identifiant de run."],
    },
  },
} as const satisfies Record<"en" | "fr", ClipsDictionary>;
