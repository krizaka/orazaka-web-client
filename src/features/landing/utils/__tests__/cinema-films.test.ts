import { hasMedia, mediaPaths } from "@/core/media/cdn";
import { translations } from "@/core/context/translations";
import { FILMS, filmFiles, usdPerMinute } from "@/features/landing/utils/cinema-films";

describe("the cinematic shorts of Made here", () => {
  it("lists every film the media manifest publishes — each with what its production recorded", () => {
    const published = mediaPaths("products/orazaka/cinema/").filter((p) => p.endsWith(".mp4"));
    expect(FILMS.map((f) => `${f.stem}.mp4`).sort()).toEqual(published.sort());
    expect(FILMS.length).toBeGreaterThanOrEqual(1);
    for (const film of FILMS) {
      expect(film.soundRunId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-/);
      expect(film.cutRunId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-/);
      expect(film.duration).toBeGreaterThanOrEqual(30); // the market's length: 30 s to a minute
      expect(film.duration).toBeLessThanOrEqual(60);
      expect([film.width, film.height]).toEqual(film.aspect === "9:16" ? [1080, 1920] : [1920, 1080]);
      expect(film.models.video).toContain("A14B");
      for (const ext of ["mp4", "webm"]) expect(hasMedia(`${film.stem}.${ext}`)).toBe(true);
      expect(filmFiles(film).poster).toContain("-poster.");
      expect(usdPerMinute(film)).toBeGreaterThan(0);
    }
  });

  it("has words for every film in both languages", () => {
    for (const film of FILMS) {
      for (const locale of ["en", "fr"] as const) {
        const words = translations[locale].gallery.films[film.id];
        expect(words.title.length).toBeGreaterThan(3);
        expect(words.brief.length).toBeGreaterThan(40);
      }
    }
  });
});
