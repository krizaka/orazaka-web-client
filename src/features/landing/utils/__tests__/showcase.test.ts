import { clipsFor, packGroupsFor, packsFor } from "@/features/landing/utils/showcase";
import data from "@/features/landing/utils/showcase.generated.json";

describe("landing showcase", () => {
  it("points every recording at the CDN, with its hash, in both encodings and a poster", () => {
    for (const c of clipsFor("en")) {
      expect(c.webm).toMatch(/^https:\/\/.+\/site\/products\/orazaka\/tour\/[a-z]+\.[0-9a-f]{10}\.webm$/);
      expect(c.mp4).toMatch(/\.[0-9a-f]{10}\.mp4$/);
      expect(c.poster).toMatch(/\.[0-9a-f]{10}\.jpg$/);
    }
  });

  it("has words in both languages for every recording and pack", () => {
    for (const l of ["en", "fr"] as const) {
      for (const c of clipsFor(l)) expect(`${c.label}${c.caption}`).not.toBe("");
      for (const p of packsFor(l)) expect(`${p.label}${p.tagline}`).not.toBe("");
    }
  });

  it("never shows a draft pack (the test pack)", () => {
    const keys = packsFor("en").map((p) => p.key);
    expect(keys).not.toContain("echo-toolkit");
    expect(keys.length).toBe(data.packs.length);
  });
});

describe("the day of work", () => {
  it("is the story in order — photo, clip, voice-over, lease check, catalogue, answers — and each clip says where it was made", () => {
    const clips = clipsFor("en");
    expect(clips.map((c) => c.id)).toEqual(["creations", "video", "voice", "documents", "studios", "chat"]);
    for (const l of ["en", "fr"] as const) {
      for (const c of clipsFor(l)) {
        expect(c.origin.length).toBeGreaterThan(10);
        expect(c.notes.length).toBeGreaterThan(0);
      }
    }
  });

  it("is honest about the cloud: the clip names its model, its provider and what it cost", () => {
    const video = clipsFor("en").find((c) => c.id === "video")!;
    expect(video.origin).toMatch(/cloud/i);
    expect(video.origin).toMatch(/Wan 2\.2/);
    expect(video.origin).toMatch(/DigitalOcean/);
    expect(video.origin).toMatch(/\$0\.60/);
    for (const id of ["creations", "voice"]) expect(clipsFor("en").find((c) => c.id === id)!.origin).toMatch(/on one Mac/);
  });

  it("has notes in order, the first at 0, all inside the clip", () => {
    for (const c of clipsFor("en")) {
      expect(c.notes[0].at).toBe(0);
      const ats = c.notes.map((n) => n.at);
      expect([...ats].sort((a, b) => a - b)).toEqual(ats);
      expect(ats[ats.length - 1]).toBeLessThan(c.duration);
    }
  });
});

describe("the packs, grouped by category (orazaka-packs#16)", () => {
  const KNOWN = ["business-compliance", "creativity-media", "wellbeing", "data-analytics"];

  it("puts every shown pack under exactly one shelf of the closed list, in both languages", () => {
    for (const l of ["en", "fr"] as const) {
      const groups = packGroupsFor(l);
      const keys = groups.flatMap((g) => g.packs.map((p) => p.key));
      expect(keys.sort()).toEqual(packsFor(l).map((p) => p.key).sort());
      for (const g of groups) {
        expect(KNOWN).toContain(g.key);
        expect(g.label).not.toBe("");
        expect(g.packs.length).toBeGreaterThan(0);
      }
    }
  });

  it("never lists a shelf with no pack (Data & Analytics waits for its first pack)", () => {
    expect(packGroupsFor("en").map((g) => g.key)).not.toContain("data-analytics");
  });

  it("keeps Wellbeing as Wellbeing, and orders the shelves by their weight", () => {
    const groups = packGroupsFor("en");
    expect(groups.find((g) => g.key === "wellbeing")?.label).toBe("Wellbeing");
    expect(packGroupsFor("fr").find((g) => g.key === "wellbeing")?.label).toBe("Bien-être");
    expect(groups.map((g) => g.key)).toEqual(KNOWN.filter((k) => groups.some((g) => g.key === k)));
  });
});
