import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { LandingPage } from "@/features/landing/components/LandingPage";

let mockLocale: Locale = "en";
const mockSetLocale = jest.fn();
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: mockSetLocale }),
}));

beforeAll(() => {
  // jsdom has no matchMedia; the theme provider and the chat showcase read it (reduced motion, system theme).
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    }),
  });
});

function renderLanding(locale: Locale) {
  mockLocale = locale;
  return render(
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>,
  );
}

describe("LandingPage", () => {
  it("states the promise and offers both ways in", () => {
    renderLanding("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.landing.hero.title);
    const register = screen.getAllByRole("link", { name: /Create your workspace|Get started/ });
    register.forEach((link) => expect(link).toHaveAttribute("href", "/register"));
    expect(screen.getAllByRole("link", { name: /Sign in/ })[0]).toHaveAttribute("href", "/login");
  });

  it("links every benefit to the feature page that explains it", () => {
    renderLanding("en");
    const benefits = document.getElementById("benefits") as HTMLElement;
    const hrefs = within(benefits).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/features/absolute-privacy", "/features/unified-engine", "/features/infinite-reach"]);
  });

  it("speaks French when the visitor chose it", () => {
    renderLanding("fr");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.landing.hero.title);
    expect(screen.getByText(translations.fr.landing.cta.title)).toBeInTheDocument();
  });
});

describe("landing copy", () => {
  /** The shape of a value: keys for objects, length and item shape for arrays. */
  const shape = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(shape)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)]))
        : typeof v;

  it("has the same shape in English and French, with no empty string", () => {
    expect(shape(translations.fr.landing)).toEqual(shape(translations.en.landing));
    const strings = (v: unknown): string[] =>
      typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];
    for (const locale of ["en", "fr"] as const) {
      expect(strings(translations[locale].landing).filter((s) => s.trim() === "")).toEqual([]);
    }
  });
});
