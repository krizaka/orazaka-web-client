import type * as React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  it("tells one story in six sections, each answering one question, in order", () => {
    renderLanding("en");
    const main = screen.getByRole("main");
    expect(main.children).toHaveLength(6);
    const ids = ["made", "how", "why", "trust"].map((id) => document.getElementById(id));
    ids.forEach((el) => expect(main.contains(el)).toBe(true));
    const order = ids.map((el) => [...main.children].findIndex((c) => c === el || c.contains(el!)));
    expect(order).toEqual([1, 2, 3, 4]);
  });

  it("has an anchor target for every entry of the navigation", () => {
    renderLanding("en");
    for (const id of ["how", "platform", "demo", "studios", "packs"]) expect(document.getElementById(id)).not.toBeNull();
  });

  it("compares the same questions for a cloud assistant and for Orazaka, row by row, with an icon each", () => {
    renderLanding("en");
    const table = screen.getByRole("table", { name: translations.en.landing.compare.title });
    const heads = within(table).getAllByRole("rowheader");
    expect(heads).toHaveLength(translations.en.landing.compare.rows.length);
    heads.forEach((h) => expect(h.querySelector("svg")).not.toBeNull());
    expect(within(table).getAllByRole("columnheader").find((h) => h.hasAttribute("data-highlight"))).toHaveTextContent("Orazaka");
  });

  it("says only what the product does today: the estimate before a run, an agent's plan approved first", () => {
    const rows = Object.fromEntries(translations.en.landing.compare.rows.map((r) => [r.id, r]));
    expect(rows.pay.orazaka.detail).toMatch(/estimated cost before it runs/);
    expect(rows.agents.orazaka.detail).toMatch(/plan.*approve/);
    expect(JSON.stringify(translations.en.landing.compare)).not.toMatch(/each action asks first|credits you set/);
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

  it("makes every Studio outcome one link to a real place, and the packs one line towards their catalogue", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const en = translations.en.landing;
    const studios = document.getElementById("studios")!;
    en.studios.items.forEach((item, i) => {
      expect(within(studios).getByRole("link", { name: new RegExp(`^${item.title}`) })).toHaveTextContent(en.studios.ctas[i]);
    });
    expect(within(studios).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["/gallery#demo-documents", "/gallery", "/docs/packs#outbound-prospecting", "/docs/packs#trade-showcase"]);
    const packs = document.getElementById("packs")!;
    expect(within(packs).getByRole("link", { name: new RegExp(en.what.packsCta) })).toHaveAttribute("href", "/docs/packs");
    expect(packs.textContent).toMatch(/\d+ installable packs/);
  });

  it("offers the documentation and the demo too", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    expect(screen.getAllByRole("link", { name: translations.en.landing.closed.heroPrimary })[0]).toHaveAttribute("href", "/docs");
    expect(screen.getAllByRole("link", { name: translations.en.landing.closed.heroSecondary })[0]).toHaveAttribute("href", "/gallery");
  });

  it("shows the prompt → image → video recordings, and the Krizaka signature with the version", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    // The demo is /gallery now: the home keeps a teaser (Made here, anchor #demo) with its clips and a way to the demo.
    expect(document.getElementById("demo")).not.toBeNull();
    expect(document.getElementById("made")!.querySelectorAll("video").length).toBeGreaterThan(0);
    expect(within(document.getElementById("made")!).getByRole("link", { name: translations.en.gallery.seeDemo })).toHaveAttribute("href", "/gallery");
    const footer = screen.getByTestId("app-version");
    expect(footer).toHaveTextContent("A Krizaka product");
    expect(footer).toHaveTextContent(/v\S+/);
    expect(within(footer).getByRole("link", { name: /A Krizaka product/ })).toHaveAttribute("href", "https://www.krizaka.com");
    expect(within(footer).queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
  });

  it("shows where it runs — Web · Mobile · Mac — the real app in its frame, never a native video control", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const r = translations.en.landing.runs;
    const section = document.getElementById("how") as HTMLElement;
    expect(within(section).getAllByRole("tab").map((t) => t.textContent)).toEqual(expect.arrayContaining([r.tabs.web, r.tabs.mobile, r.tabs.mac]));
    const web = within(section).getByRole("region", { name: new RegExp(r.tabs.web) });
    expect(web.querySelector('[data-device="browser"]')).not.toBeNull();
    const posters = [...web.querySelectorAll("img")].map((i) => i.getAttribute("src"));
    expect(posters).toHaveLength(3);
    posters.forEach((src) => expect(src).toMatch(/products\/orazaka\/web\/step-[a-z]+-dark-poster\.[0-9a-f]{10}\.webp$/));
    expect(section.querySelectorAll("video[controls]")).toHaveLength(0);
    expect(section).toHaveTextContent(r.recorded);
    // The bar reaches it through Platforms ▾ (site-nav.ts), never as a lone top-level entry.
    const bar = screen.getByRole("navigation", { name: "Orazaka" });
    expect(within(bar).getByRole("button", { name: translations.en.landing.nav.platforms })).toBeInTheDocument();
    expect(within(bar).queryByRole("link", { name: translations.en.landing.nav.mobile })).toBeNull();
  });

  it("shows the Mac as its one real capture in a macOS window, towards /desktop — no invented step", async () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const r = translations.en.landing.runs;
    const section = document.getElementById("how") as HTMLElement;
    const mac = within(section).getByRole("tab", { name: r.tabs.mac });
    fireEvent.mouseDown(mac);
    fireEvent.click(mac);
    const frame = await waitFor(() => section.querySelector('[data-device="desktop"]') as HTMLElement);
    expect(within(frame).getByRole("img", { name: r.mac.alt })).toBeInTheDocument();
    expect(within(section).getByRole("link", { name: new RegExp(r.mac.cta) })).toHaveAttribute("href", "/desktop");
  });

  it("wears its own navigation: no version (it is in the footer), one main action, no family switcher (a deployed product is independent)", () => {
    renderLanding("en", <LandingPage />, CLOSED);
    const bar = document.querySelector("header[data-floating]") as HTMLElement;
    expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
    expect(bar).not.toHaveTextContent(/dev · v/);
    expect(within(bar).getByRole("link", { name: translations.en.landing.nav.repo })).toHaveAttribute("href", "https://github.com/krizaka/orazaka-web-client");
    expect(within(bar).getAllByRole("link", { name: translations.en.landing.nav.talk })[0]).toHaveAttribute("href", "https://www.krizaka.com/contact?topic=orazaka");
    // Product ▾ · Platforms ▾ · Docs (site-nav.ts), never a link to another site
    const centre = within(bar).getByRole("navigation", { name: "Orazaka" });
    const top = within(centre).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(top).toEqual(["/docs"]);
    for (const name of [translations.en.landing.nav.product, translations.en.landing.nav.platforms]) expect(within(centre).getByRole("button", { name })).toBeInTheDocument();
  });
});
