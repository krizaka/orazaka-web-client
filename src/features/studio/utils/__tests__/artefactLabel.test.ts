import { artefactLabel } from "@/features/studio/utils/artefactLabel";

const artefact = { key: "image", label: "Votre image", type: "IMAGE", value: "x", labels: { en: "Your image", fr: "Votre image" } };

describe("artefactLabel", () => {
  it("shows the label in the page's language when the pack wrote it", () => {
    expect(artefactLabel(artefact, "en")).toBe("Your image");
    expect(artefactLabel(artefact, "fr")).toBe("Votre image");
  });

  it("falls back to English, then to the base label", () => {
    expect(artefactLabel({ ...artefact, labels: { en: "Your image" } }, "fr")).toBe("Your image");
    expect(artefactLabel({ ...artefact, labels: undefined }, "en")).toBe("Votre image");
    expect(artefactLabel({ ...artefact, labels: {} }, "en")).toBe("Votre image");
  });
});
