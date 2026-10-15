import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { ModelsCatalogue } from "@/features/landing/components/ModelsCatalogue";
import { LandingModels } from "@/features/landing/components/LandingModels";
import { MODELS, filterModels } from "@/features/landing/utils/models";

let mockLocale: Locale = "en";
let mockQuery = "";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: jest.fn() }),
}));
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(mockQuery),
  usePathname: () => "/models",
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }),
  });
});

function renderPage(locale: Locale, query = "") {
  mockLocale = locale;
  mockQuery = query;
  return render(<ThemeProvider><ModelsCatalogue /></ThemeProvider>);
}

describe("/models", () => {
  it("counts the registry and says local first, provider optional", () => {
    renderPage("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.models.hero.title);
    expect(screen.getAllByText(translations.en.models.count.replace("{count}", String(MODELS.length))).length).toBeGreaterThan(0);
    const aside = screen.getByRole("complementary", { name: translations.en.models.sovereign.title });
    expect(aside).toHaveTextContent(translations.en.models.sovereign.local);
    expect(aside).toHaveTextContent(/optional and opt-in/);
  });

  it("filters by capability and by where it runs from the address, and marks the chips", () => {
    renderPage("en", "cap=image&where=local");
    const expected = filterModels(MODELS, { capabilities: ["image"], runsOn: "local" });
    expect(screen.getAllByText(translations.en.models.count.replace("{count}", String(expected.length))).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: translations.en.models.capabilities.image })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: translations.en.models.where.localLong })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText(MODELS.find((m) => m.runsOn === "provider")!.id)).toBeNull();
  });

  it("each capability chip links to the address that keeps the filter", () => {
    renderPage("en", "cap=chat");
    expect(screen.getByRole("link", { name: translations.en.models.capabilities.code })).toHaveAttribute("href", "/models?cap=chat%2Ccode");
    expect(screen.getByRole("link", { name: translations.en.models.capabilities.chat })).toHaveAttribute("href", "/models");
  });

  it("labels a provider-hosted model optional, with its licence and context window from the data", () => {
    renderPage("en", "where=provider");
    const m = MODELS.find((x) => x.runsOn === "provider")!;
    const row = screen.getByText(m.id).closest("tr") as HTMLElement;
    expect(within(row).getByText(translations.en.models.where.provider)).toBeInTheDocument();
    expect(within(row).getByText(m.licence.name)).toBeInTheDocument();
  });

  it("flags a non-commercial licence with a visible chip, and only there", () => {
    renderPage("en");
    const nc = MODELS.filter((m) => m.commercialUse === "no");
    expect(nc.length).toBeGreaterThan(0);
    expect(screen.getAllByText(translations.en.models.licence.nonCommercial)).toHaveLength(nc.length);
    const ok = MODELS.find((m) => m.commercialUse === "yes")!;
    expect(within(screen.getByText(ok.id).closest("tr") as HTMLElement).queryByText(translations.en.models.licence.nonCommercial)).toBeNull();
  });

  it("keeps Model, Capability, Runs where and Status in the row and moves the rest into the row's detail", () => {
    renderPage("en");
    const c = translations.en.models.columns;
    for (const name of [c.model, c.does, c.runs, c.status]) expect(screen.getByRole("columnheader", { name: new RegExp(name) }).className).not.toContain("hidden!");
    for (const name of [c.vendor, c.licence, c.context, c.verified]) expect(screen.getByRole("columnheader", { name: new RegExp(name) }).className).toContain("hidden!");
    expect(screen.getAllByRole("button", { name: /Show more about/ }).length).toBe(MODELS.length);
  });

  it("is in French when the language is", () => {
    renderPage("fr");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.models.hero.title);
    expect(screen.getByRole("link", { name: translations.fr.models.capabilities.chat })).toBeInTheDocument();
  });

  it("links the documentation of the catalogue", () => {
    renderPage("en");
    expect(screen.getByRole("link", { name: new RegExp(translations.en.models.docs.catalogue) })).toHaveAttribute("href", "/docs/models");
  });
});

describe("the home page's Models section", () => {
  it("shows six local models from the registry, the optional ones counted, and the way to all of them", () => {
    mockLocale = "en";
    mockQuery = "";
    const { container } = render(<ThemeProvider><LandingModels /></ThemeProvider>);
    const section = container.querySelector("#models") as HTMLElement;
    expect(within(section).getAllByRole("heading", { level: 3 }).length).toBeLessThanOrEqual(6);
    expect(within(section).getByRole("link", { name: new RegExp(translations.en.models.home.more) })).toHaveAttribute("href", "/models");
    expect(section).toHaveTextContent(/optional models served by a provider/);
  });
});

describe("the public catalogue never mentions the unfiltered models", () => {
  it.each(["en", "fr"] as const)("in %s", (locale) => {
    const text = JSON.stringify(translations[locale].models).toLowerCase();
    for (const word of ["unfiltered", "non filtr", "abliterat", "uncensored"]) expect(text).not.toContain(word);
  });
});
