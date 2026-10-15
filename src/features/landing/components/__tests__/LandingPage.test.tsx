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

/** The full promise of a heading made of a lead and an accented end. */
const promise = (copy: { titleLead: string; titleAccent: string }) => `${copy.titleLead} ${copy.titleAccent}`;

describe("LandingPage", () => {
  it("states the promise and offers both ways in", () => {
    renderLanding("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(promise(translations.en.landing.hero));
    const register = screen.getAllByRole("link", { name: /Create your workspace|Get started/ });
    register.forEach((link) => expect(link).toHaveAttribute("href", "/register"));
    expect(screen.getAllByRole("link", { name: /Sign in/ })[0]).toHaveAttribute("href", "/login");
  });

  it("links every pillar to the feature page that explains it", () => {
    renderLanding("en");
    const pillars = document.getElementById("sovereignty") as HTMLElement;
    const hrefs = within(pillars).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(FEATURE_IDS.map((id) => `/features/${id}`));
  });

  it("has an anchor target for every entry of the navigation", () => {
    renderLanding("en");
    for (const id of ["sovereignty", "platform", "how", "demo", "studios", "packs"]) expect(document.getElementById(id)).not.toBeNull();
  });

  it("compares the same questions for a cloud assistant and for Orazaka", () => {
    renderLanding("en");
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("rowheader")).toHaveLength(translations.en.landing.compare.rows.length);
  });

  it("speaks French when the visitor chose it", () => {
    renderLanding("fr");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(promise(translations.fr.landing.hero));
    expect(screen.getByText(translations.fr.landing.cta.title)).toBeInTheDocument();
  });
});

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

describe("LandingPage while sign-in and sign-up are closed (the default)", () => {
  const CLOSED: AuthFlags = { login: false, signup: false, github: false, google: false };

  it("hides every sign-up entry point but keeps Sign in visible, leading to /login", () => {
    const { container } = renderLanding("en", <LandingPage />, CLOSED);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).not.toContain("/register");
    expect(screen.queryByRole("link", { name: /Get started|Create your workspace/ })).toBeNull();
    const signIn = screen.getAllByRole("link", { name: translations.en.landing.nav.signIn });
    signIn.forEach((a) => expect(a).toHaveAttribute("href", "/login"));
  });

  it("shows Sign in in the bar and as a secondary action of the hero", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const bar = document.querySelector("header[data-floating]") as HTMLElement;
    expect(within(bar).getByRole("link", { name: translations.en.landing.nav.signIn })).toHaveAttribute("href", "/login");
    const hero = screen.getByRole("heading", { level: 1 }).closest("header") as HTMLElement;
    expect(within(hero).getByRole("link", { name: translations.en.landing.nav.signIn })).toHaveAttribute("href", "/login");
  });

  it("makes every capability, Studio and pack card one link to a real place", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const en = translations.en.landing;
    const platform = document.getElementById("platform")!;
    const wanted = ["/gallery#demo-chat", "/docs/tools", "/docs/architecture", "/#studios", "/docs/jobs", "/docs/packs"];
    en.platform.items.forEach((item, i) => {
      const link = within(platform).getByRole("link", { name: new RegExp(`^${item.title}`) });
      expect(link).toHaveAttribute("href", wanted[i]);
      expect(link).toHaveTextContent(en.platform.ctas[i]);
    });
    const studios = document.getElementById("studios")!;
    en.studios.items.forEach((item, i) => {
      expect(within(studios).getByRole("link", { name: new RegExp(`^${item.title}`) })).toHaveTextContent(en.studios.ctas[i]);
    });
    expect(within(studios).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(expect.arrayContaining(["/gallery#demo-documents", "/gallery", "/docs/packs#outbound-prospecting", "/docs/packs#trade-showcase"]));
    // no card of the home is a dead end: not a bare <li> without a link
    expect(platform.querySelectorAll("li").length).toBe(0);
  });

  it("offers the documentation and the demo too", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    expect(screen.getAllByRole("link", { name: translations.en.landing.closed.heroPrimary })[0]).toHaveAttribute("href", "/docs");
    expect(screen.getAllByRole("link", { name: translations.en.landing.closed.heroSecondary })[0]).toHaveAttribute("href", "/gallery");
  });

  it("shows the recordings and the packs, and the Krizaka signature with the version", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    // The demo is /gallery now: the home keeps a teaser (Made here, anchor #demo) with its clips and a way to the demo.
    expect(document.getElementById("demo")).not.toBeNull();
    expect(document.getElementById("made")!.querySelectorAll("video").length).toBeGreaterThan(0);
    expect(within(document.getElementById("made")!).getByRole("link", { name: translations.en.gallery.seeDemo })).toHaveAttribute("href", "/gallery");
    expect(document.getElementById("packs")!.querySelectorAll("a[href^='/docs/packs#']").length).toBeGreaterThan(0);
    const footer = screen.getByTestId("app-version");
    expect(footer).toHaveTextContent("A Krizaka product");
    expect(footer).toHaveTextContent(/v\S+/);
    expect(within(footer).getByRole("link", { name: /A Krizaka product/ })).toHaveAttribute("href", "https://www.krizaka.com");
    expect(within(footer).queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
  });

  it("has a Mobile section with the phone recordings, played on demand, and a way to the full page", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const section = document.getElementById("mobile") as HTMLElement;
    const videos = section.querySelectorAll("video");
    expect(videos.length).toBe(4);
    videos.forEach((v) => {
      expect(v.getAttribute("preload")).toBe("none");
      expect(v.hasAttribute("autoplay")).toBe(false);
      expect(v.getAttribute("poster")).toMatch(/products\/orazaka\/mobile\/.*\.webp$/);
    });
    expect(within(section).getByRole("link", { name: translations.en.mobile.all })).toHaveAttribute("href", "/docs/mobile");
    const bar = screen.getByRole("navigation", { name: "Orazaka" });
    expect(within(bar).getByRole("link", { name: translations.en.landing.nav.mobile })).toHaveAttribute("href", "/docs/mobile");
  });

  it("wears its own navigation: the environment badge, one main action, no family switcher (a deployed product is independent)", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const bar = document.querySelector("header[data-floating]") as HTMLElement;
    expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
    expect(bar).toHaveTextContent(/dev · v/);
    expect(within(bar).getByRole("link", { name: translations.en.landing.nav.repo })).toHaveAttribute("href", "https://github.com/krizaka/orazaka-web-client");
    expect(within(bar).getAllByRole("link", { name: translations.en.landing.nav.talk })[0]).toHaveAttribute("href", "https://www.krizaka.com/contact?topic=orazaka");
    // Demo · Mobile · Documentation beside the Product menu, never a link to another site
    const centre = within(bar).getByRole("navigation", { name: "Orazaka" });
    const top = within(centre).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(top).toEqual(["/gallery", "/docs/mobile", "/docs"]);
    expect(within(centre).getByRole("button", { name: translations.en.landing.nav.product })).toBeInTheDocument();
  });
});
