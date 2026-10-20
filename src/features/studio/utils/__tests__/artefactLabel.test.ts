import { artefactLabel } from "@/features/studio/utils/artefactLabel";

type Artefact = Parameters<typeof artefactLabel>[0];

const artefact = { key: "image", label: "Votre image", type: "IMAGE", value: "x", labels: { en: "Your image", fr: "Votre image" } } as Artefact;

describe("artefactLabel", () => {
  it("shows the label in the page's language when the pack wrote it", () => {
    expect(artefactLabel(artefact, "en")).toBe("Your image");
    expect(artefactLabel(artefact, "fr")).toBe("Votre image");
  });

  it("falls back to English, then to the base label", () => {
    expect(artefactLabel({ ...artefact, labels: { en: "Your image" } } as Artefact, "fr")).toBe("Your image");
    expect(artefactLabel({ ...artefact, labels: undefined } as Artefact, "en")).toBe("Votre image");
    expect(artefactLabel({ ...artefact, labels: {} } as Artefact, "en")).toBe("Votre image");
  });
});
