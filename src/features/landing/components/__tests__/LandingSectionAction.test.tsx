import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { LandingPacks } from "@/features/landing/components/LandingPacks";
import { LandingModels } from "@/features/landing/components/LandingModels";

let mockLocale: Locale = "en";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: jest.fn() }),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }),
  });
});

/**
 * The section's call to action (issue krizaka/orazaka-web-client#104) sits in the @krizaka/ui action row, right under the
 * card grid of its own section, and not as a bare pill dropped in the article.
 */
function expectActionRowUnderGrid(section: HTMLElement, label: string) {
  const link = screen.getByRole("link", { name: label });
  const row = link.closest("ul.kz-actions");
  expect(row).not.toBeNull();
  expect(section).toContainElement(row as HTMLElement);
  const grid = section.querySelector(".kz-cards") as HTMLElement;
  expect(grid).not.toBeNull();
  expect(grid.compareDocumentPosition(row as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(row!.parentElement).toBe(section.querySelector("article"));
}

describe("landing section call to action (#104)", () => {
  it.each([["en"], ["fr"]] as const)("Packs: the action is the ui action row under the grid (%s)", (locale) => {
    mockLocale = locale;
    const { container } = render(<ThemeProvider><LandingPacks /></ThemeProvider>);
    expectActionRowUnderGrid(container.querySelector("#packs") as HTMLElement, translations[locale].landing.packs.more);
  });

  it.each([["en"], ["fr"]] as const)("Models: the action is the ui action row under the grid (%s)", (locale) => {
    mockLocale = locale;
    const { container } = render(<ThemeProvider><LandingModels /></ThemeProvider>);
    expectActionRowUnderGrid(container.querySelector("#models") as HTMLElement, translations[locale].models.home.more);
  });
});
