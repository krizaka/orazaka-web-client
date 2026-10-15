import type * as React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import type { AuthFlags } from "@/core/config/auth-flags";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { navActive } from "@/features/landing/components/LandingNav";

let mockLocale: Locale = "en";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: jest.fn() }),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false }),
  });
});

const CLOSED: AuthFlags = { login: false, signup: false, github: false, google: false };

function renderLanding(locale: Locale, page: React.ReactNode = <LandingPage />, flags: AuthFlags = CLOSED) {
  mockLocale = locale;
  return render(
    <AuthFlagsProvider flags={flags}>
      <ThemeProvider>{page}</ThemeProvider>
    </AuthFlagsProvider>,
  );
}

describe("the bar reaches every public destination", () => {
  const nav = translations.en.landing.nav;

  it("lists them all in the mobile panel, once, with no dead entry", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    fireEvent.click(screen.getByRole("button", { name: nav.openMenu }));
    const bar = document.querySelector("header[data-floating]") as HTMLElement;
    const panels = [...bar.querySelectorAll("nav")];
    const mobile = panels.find((n) => n.textContent?.includes(nav.product) && n.querySelector("a[href='/models']") && n.querySelector("a[href='/login']"));
    expect(mobile).toBeTruthy();
    const hrefs = [...(mobile as HTMLElement).querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(expect.arrayContaining(["#how", "#studios", "#packs", "/models", "/desktop", "/gallery", "#demo", "/docs/mobile", "/docs"]));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    // « Run it » is reserved in the nav data but its page does not exist yet: no dead link
    expect(hrefs).not.toContain("/infrastructure");
  });

  it("leads the Mac band to /desktop with the real capture", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const band = document.getElementById("mac") as HTMLElement;
    expect(within(band).getByRole("link", { name: translations.en.desktop.band.cta })).toHaveAttribute("href", "/desktop");
    const img = within(band).getByRole("img", { name: translations.en.desktop.band.alt }) as HTMLImageElement;
    expect(img.src).toMatch(/products\/orazaka\/home\/desktop-panel-2240\.[0-9a-f]{10}\.webp$/);
  });

  it("has an anchor target in the page for every anchor of the bar, and a label in both languages", () => {
    renderLanding("fr", <LandingPage />, CLOSED);
    for (const id of ["how", "studios", "packs", "demo"]) expect(document.getElementById(id)).not.toBeNull();
    for (const k of ["product", "models", "run", "desktop", "made", "how", "studios", "packs", "demo", "mobile", "docs"] as const) {
      expect(translations.fr.landing.nav[k]).toBeTruthy();
      expect(nav[k]).toBeTruthy();
    }
    for (const k of Object.keys(nav.menu) as (keyof typeof nav.menu)[]) expect(translations.fr.landing.nav.menu[k]).not.toBe(nav.menu[k]);
  });
});

describe("navActive", () => {
  it("lights the current page of the bar", () => {
    expect(navActive("/models")).toMatchObject({ models: true, made: false, docs: false });
    expect(navActive("/gallery")).toMatchObject({ made: true });
    expect(navActive("/docs/mobile")).toMatchObject({ mobile: true, docs: false });
    expect(navActive("/docs/packs")).toMatchObject({ docs: true, mobile: false });
    expect(navActive("/features/absolute-privacy")).toMatchObject({ features: true });
    expect(navActive("/desktop")).toMatchObject({ desktop: true });
    expect(navActive("/infrastructure")).toMatchObject({ run: true });
    expect(navActive(null)).toMatchObject({ models: false, docs: false });
  });
});
