import type * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import type { AuthFlags } from "@/core/config/auth-flags";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { FeaturePage } from "@/features/landing/components/FeaturePage";
import { FEATURE_IDS } from "@/features/landing/components/features";

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

const OPEN: AuthFlags = { login: true, signup: true, github: false, google: false };

function renderLanding(locale: Locale, page: React.ReactNode = <LandingPage />, flags: AuthFlags = OPEN) {
  mockLocale = locale;
  return render(
    <AuthFlagsProvider flags={flags}>
      <ThemeProvider>{page}</ThemeProvider>
    </AuthFlagsProvider>,
  );
}

/** The full promise of a feature page heading made of a lead and an accented end. */
const promise = (copy: { titleLead: string; titleAccent: string }) => `${copy.titleLead} ${copy.titleAccent}`;

describe("FeaturePage", () => {
  it.each(FEATURE_IDS)("%s states its promise and links the two other features", (id) => {
    renderLanding("en", <FeaturePage id={id} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(promise(translations.en.features.pages[id]));
    const others = screen.getByRole("navigation", { name: translations.en.features.others });
    const hrefs = within(others).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(FEATURE_IDS.filter((x) => x !== id).map((x) => `/features/${x}`));
  });

  it("speaks French when the visitor chose it", () => {
    renderLanding("fr", <FeaturePage id="infinite-reach" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(promise(translations.fr.features.pages["infinite-reach"]));
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
    expect(shape(translations.fr.features)).toEqual(shape(translations.en.features));
    const strings = (v: unknown): string[] =>
      typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];
    for (const locale of ["en", "fr"] as const) {
      expect(strings(translations[locale].landing).filter((s) => s.trim() === "")).toEqual([]);
      expect(strings(translations[locale].features).filter((s) => s.trim() === "")).toEqual([]);
    }
  });
});

