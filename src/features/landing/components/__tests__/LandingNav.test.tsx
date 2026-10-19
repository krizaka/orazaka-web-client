import type * as React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import type { AuthFlags } from "@/core/config/auth-flags";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { NAV_GROUPS, navActive } from "@/features/landing/utils/site-nav";
import axe from "axe-core";

const mockPath = { current: "/" };
jest.mock("next/navigation", () => ({ usePathname: () => mockPath.current, useRouter: () => ({ push: jest.fn() }) }));

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

const nav = translations.en.landing.nav;
const bar = () => document.querySelector("header[data-floating]") as HTMLElement;
const desktopNav = () => within(bar()).getAllByRole("navigation", { name: "Orazaka" })[0];

describe("the information architecture of the public bar", () => {
  it("is the product-site standard: Product ▾ · Platforms ▾ · Docs — at most four entries, no lone Demo/Mobile/Mac", () => {
    const shape = NAV_GROUPS.map((g) => ({ group: g.id, entries: g.entries.map((e) => `${e.id} → ${e.anchor ? `#${e.anchor}` : e.path}`) }));
    expect(shape).toMatchInlineSnapshot(`
[
  {
    "entries": [
      "how → #how",
      "studios → #studios",
      "packs → #packs",
      "models → /models",
      "demo → /gallery",
    ],
    "group": "product",
  },
  {
    "entries": [
      "web → #platform",
      "mobile → /docs/mobile",
      "desktop → /desktop",
      "selfHost → /docs/self-hosting",
    ],
    "group": "platforms",
  },
]
`);
    renderLanding("en", <LandingNav />);
    const top = [...desktopNav().querySelectorAll("[data-nav-item]")].map((el) => el.textContent?.trim());
    expect(top).toEqual([nav.product, nav.platforms, nav.docs]);
    expect(top.length).toBeLessThanOrEqual(4);
  });

  it("keeps the version out of the bar (it is in the footer)", () => {
    renderLanding("en", <LandingPage />);
    expect(within(bar()).queryByText(/v\d+\.\d+/)).toBeNull();
    expect(screen.getByTestId("app-version").tagName).toBe("FOOTER");
  });

  it.each([
    ["/", null],
    ["/models", "product"],
    ["/gallery", "product"],
    ["/features/absolute-privacy", "product"],
    ["/desktop", "platforms"],
    ["/docs/mobile", "platforms"],
    ["/docs/self-hosting", "platforms"],
    ["/docs", "docs"],
    ["/docs/packs", "docs"],
  ])("lights one item at most on %s (%s)", (path, top) => {
    expect(navActive(path).top).toBe(top);
    mockPath.current = path;
    renderLanding("en", <LandingNav onHome={path === "/"} />);
    const lit = [...desktopNav().querySelectorAll("[data-nav-item][data-active]")].map((el) => el.textContent?.trim());
    expect(lit).toEqual(top ? [top === "docs" ? nav.docs : nav[top as "product" | "platforms"]] : []);
    mockPath.current = "/";
  });

  it("has no axe violation, closed and with a menu open, in both languages", async () => {
    for (const locale of ["en", "fr"] as const) {
      const { container, unmount } = renderLanding(locale, <LandingNav />);
      let res = await axe.run(container, { rules: { region: { enabled: false } } });
      expect(res.violations.map((v) => v.id)).toEqual([]);
      fireEvent.click(within(bar()).getByRole("button", { name: translations[locale].landing.nav.platforms }));
      res = await axe.run(container, { rules: { region: { enabled: false } } });
      expect(res.violations.map((v) => v.id)).toEqual([]);
      unmount();
    }
  });
});

describe("the mobile panel", () => {
  it("has the bar's groups in the same order, every destination once, no dead link, then Docs", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    fireEvent.click(screen.getByRole("button", { name: nav.openMenu }));
    const groups = within(bar()).getAllByRole("group").filter((g) => g.getAttribute("aria-labelledby"));
    expect(groups.map((g) => g.querySelector("p")?.textContent)).toEqual([nav.product, nav.platforms, nav.preferences]);
    expect(within(groups[1]).getAllByRole("link").map((a) => a.textContent)).toEqual([nav.web, nav.mobile, nav.desktop, nav.selfHost]);
    const panel = groups[0].closest("nav") as HTMLElement;
    const hrefs = [...panel.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["#how", "#studios", "#packs", "/models", "/gallery", "#platform", "/docs/mobile", "/desktop", "/docs/self-hosting", "/docs", "#", "#", "/login", "https://www.krizaka.com/contact?topic=orazaka"]);
    expect(hrefs).not.toContain("/infrastructure");
  });

  it("has an anchor target on the home for every anchor, and every word in both languages", () => {
    renderLanding("fr", <LandingPage />, CLOSED);
    for (const g of NAV_GROUPS) {
      for (const e of g.entries) {
        if (e.anchor) expect(document.getElementById(e.anchor)).not.toBeNull();
        expect(translations.fr.landing.nav[e.id]).toBeTruthy();
        expect(translations.fr.landing.nav.menu[e.id].length).toBeLessThanOrEqual(48);
        expect(nav.menu[e.id].length).toBeLessThanOrEqual(48);
      }
    }
  });
});

describe("the language switch", () => {
  it("is the family's: a globe and the current code in the bar, never a row of EN/FR buttons", () => {
    renderLanding("fr", <LandingNav />);
    const trigger = within(bar()).getByRole("button", { name: `${translations.fr.landing.nav.langLabel}: Français` });
    expect(trigger.querySelector("[data-code]")?.getAttribute("data-code")).toBe("fr");
    expect(bar().querySelector("[aria-pressed]")).toBeNull();
  });

  it("lists the languages by their own names, and choosing one sets the locale without leaving the page", () => {
    renderLanding("fr", <LandingNav />);
    fireEvent.click(within(bar()).getByRole("button", { name: `${translations.fr.landing.nav.langLabel}: Français` }));
    const english = screen.getByRole("link", { name: "English" });
    expect(english).toHaveAttribute("hreflang", "en");
    // The click is taken by the app (it sets the locale), the browser does not navigate.
    expect(fireEvent.click(english)).toBe(false);
  });
});

describe("the footer", () => {
  it("repeats the bar's groups as columns — Product, Platforms, Docs — with every entry of the bar", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const footer = screen.getByRole("contentinfo");
    const titles = NAV_GROUPS.map((g) => nav[g.id]).concat(nav.docs);
    for (const title of titles) expect(within(footer).getByText(title)).toBeInTheDocument();
    const hrefs = [...footer.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    for (const g of NAV_GROUPS) for (const e of g.entries) expect(hrefs).toContain(e.anchor ? `/#${e.anchor}` : e.path);
    expect(hrefs).toEqual(expect.arrayContaining(["/docs", "/docs/api", "/docs/cli"]));
  });
});
