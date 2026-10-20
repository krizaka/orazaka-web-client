import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { translations } from "@/core/context/translations";
import { ConsentDialog } from "@/features/studio/consent/ConsentDialog";

let locale: "en" | "fr" = "en";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: jest.requireActual("@/core/context/translations").translations[locale], locale }),
}));

const statement = "Ce Studio enregistre ce que vous y écrivez sur votre humeur. Vous consentez explicitement à ce traitement.";
const requirement = { version: "1.0", statement };
const base = { open: true, studioLabel: "Guided journaling", requirement, isSubmitting: false, error: null, onConfirm: jest.fn(), onCancel: jest.fn() };

function ticks() {
  return {
    age: screen.getByRole("checkbox", { name: /legal age|majeur/i }),
    consent: screen.getByRole("checkbox", { name: /explicitly consent|consens explicitement/i }),
    region: screen.getByRole("combobox") as HTMLSelectElement,
    agree: screen.getByRole("button", { name: /Agree and continue|Saving your choice|J'accepte et je continue/ }),
  };
}

describe("ConsentDialog (a wellbeing Studio's consent step)", () => {
  beforeEach(() => { locale = "en"; jest.clearAllMocks(); });

  it("shows what the Studio does and does not do, the AI notice, the crisis line and the server's statement verbatim", () => {
    render(<ConsentDialog {...base} />);
    const t = translations.en.consent;
    expect(screen.getByRole("dialog", { name: "Before you start Guided journaling" })).toBeInTheDocument();
    for (const line of [...t.does, ...t.doesNot]) expect(screen.getByText(line)).toBeInTheDocument();
    expect(screen.getByText(/not medical advice or care/i)).toBeInTheDocument();
    expect(screen.getByText(t.aiNotice)).toBeInTheDocument();
    expect(screen.getByText(/Call your local emergency number/)).toBeInTheDocument();
    expect(screen.getByText(statement)).toBeInTheDocument();
    expect(screen.getByText("Statement, version 1.0")).toBeInTheDocument();
  });

  it("pre-checks nothing and pre-selects no region: the agree button is off", () => {
    render(<ConsentDialog {...base} />);
    const { age, consent, region, agree } = ticks();
    expect(age).not.toBeChecked();
    expect(consent).not.toBeChecked();
    expect(region.value).toBe("");
    expect(agree).toBeDisabled();
  });

  it("stays off until the age, the region and the consent are all given", () => {
    render(<ConsentDialog {...base} />);
    const { age, consent, region, agree } = ticks();
    fireEvent.click(age);
    fireEvent.click(consent);
    expect(agree).toBeDisabled();
    fireEvent.change(region, { target: { value: "CA-QC" } });
    expect(agree).toBeEnabled();
    fireEvent.click(age);
    expect(agree).toBeDisabled();
  });

  it("hands the three declarations back: the statement's version, the age, the region", () => {
    render(<ConsentDialog {...base} />);
    const { age, consent, region, agree } = ticks();
    fireEvent.click(age);
    fireEvent.click(consent);
    fireEvent.change(region, { target: { value: "FR" } });
    fireEvent.click(agree);
    expect(base.onConfirm).toHaveBeenCalledWith({ consentVersion: "1.0", ageAttested: true, region: "FR" });
  });

  it("offers only the regions the pack ships a verified helpline for", () => {
    render(<ConsentDialog {...base} />);
    const values = Array.from(ticks().region.options).map((option) => option.value);
    expect(values).toEqual(["", "FR", "BE-FR", "BE-NL", "CA", "CA-QC"]);
  });

  it("says why the server refused (age or region) and lets the person correct it", () => {
    render(<ConsentDialog {...base} error="installing guided-journaling is not available in region 'CA'" />);
    expect(screen.getByRole("alert")).toHaveTextContent("not available in region 'CA'");
  });

  it("blocks everything and refuses to close while saving", () => {
    render(<ConsentDialog {...base} isSubmitting />);
    expect(ticks().age).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(base.onCancel).not.toHaveBeenCalled();
  });

  it("cancels on « Not now » and on Escape without consenting", () => {
    render(<ConsentDialog {...base} />);
    fireEvent.click(screen.getByRole("button", { name: "Not now" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(base.onCancel).toHaveBeenCalledTimes(2);
    expect(base.onConfirm).not.toHaveBeenCalled();
  });

  it("speaks French", () => {
    locale = "fr";
    render(<ConsentDialog {...base} />);
    expect(screen.getByRole("dialog", { name: "Avant de commencer Guided journaling" })).toBeInTheDocument();
    expect(screen.getByText(/ni un avis médical ni un soin/)).toBeInTheDocument();
    expect(ticks().region).toHaveDisplayValue("Choisissez votre région");
  });
});
