import type * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import type { AuthFlags } from "@/core/config/auth-flags";
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

const OPEN: AuthFlags = { login: true, signup: true, github: false, google: false };

function renderLanding(locale: Locale, page: React.ReactNode = <LandingPage />, flags: AuthFlags = OPEN) {
  mockLocale = locale;
  return render(
    <AuthFlagsProvider flags={flags}>
      <ThemeProvider>{page}</ThemeProvider>
    </AuthFlagsProvider>,
  );
}

/** A Section puts its id on its heading: the section is the heading's `section`. */
const sectionOf = (id: string) => document.getElementById(id)!.closest("section") as HTMLElement;
const MEASURED = { ok: 128, all: 143, models: 9, day: "2026-10-17" };
const SECTION_IDS = ["features", "records", "platforms", "engine", "why", "faq"] as const;

describe("LandingPage", () => {
  it("states one promise in one line, one primary action and a quiet second one — no pill, no checkmark row", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const h = translations.en.landing.hero;
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(h.title);
    const hero = screen.getByRole("heading", { level: 1 }).closest("header") as HTMLElement;
    const actions = within(hero).getAllByRole("link");
    expect(actions.map((a) => a.textContent?.trim())).toEqual([translations.en.landing.cta.primary, h.secondary]);
    expect(actions[0]).toHaveAttribute("href", "/register");
    expect(actions[1]).toHaveAttribute("href", "/gallery");
    expect(hero.querySelector("ul, [data-testid='chat-showcase']")).toBeNull();
    expect(document.body.textContent).not.toMatch(/sovereign AI platform|next-gen/i);
  });

  it("shows the real product in the hero: the recorded chat of the page's language and theme, poster first, never a mock chat", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const look = document.documentElement.classList.contains("light") ? "light" : "dark";
    const take = screen.getByTestId("hero-take") as HTMLVideoElement;
    expect(take.muted).toBe(true);
    expect(take.loop).toBe(true);
    expect(take).not.toHaveAttribute("controls");
    expect(take).toHaveAttribute("poster", expect.stringMatching(new RegExp(`products/orazaka/home/take-en-${look}-poster\\.[0-9a-f]{10}\\.webp$`)));
    expect(take.querySelector("source[type='video/webm']")).toHaveAttribute("src", expect.stringMatching(new RegExp(`take-en-${look}\\.[0-9a-f]{10}\\.webm$`)));
    expect(take.querySelector("source[type='video/mp4']")).toHaveAttribute("src", expect.stringMatching(new RegExp(`take-en-${look}\\.[0-9a-f]{10}\\.mp4$`)));
    expect(screen.getByText(translations.en.landing.hero.takeCaption)).toBeInTheDocument();
  });

  it("follows the language: the French page films the French take", () => {
    renderLanding("fr", <LandingPage measured={MEASURED} />);
    expect(screen.getByTestId("hero-take")).toHaveAttribute("poster", expect.stringMatching(/take-fr-(dark|light)-poster/));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.landing.hero.title);
  });

  it("counts its figures from the measured runs it is given, never from a typed number", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const labels = translations.en.landing.figures;
    for (const label of [labels.runs, labels.models, labels.telemetry]) expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(labels.runs).closest("div")?.querySelector("dt")).not.toBeNull();
  });

  it("tells the story in order: what it does, the proof, where it runs, the engine, the comparison, the questions", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const main = screen.getByRole("main");
    const els = SECTION_IDS.map((id) => document.getElementById(id));
    els.forEach((el) => expect(main.contains(el)).toBe(true));
    const position = (el: HTMLElement) => [...main.querySelectorAll("section, [id]")].indexOf(el);
    const order = els.map((el) => position(el!));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("has three capabilities, each with a real screen of the app (never a fake chat)", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const features = sectionOf("features");
    const tiles = features.querySelectorAll("ul > li");
    expect(tiles).toHaveLength(3);
    const shots = [...features.querySelectorAll("img")].map((i) => i.getAttribute("src"));
    expect(shots).toHaveLength(3);
    shots.forEach((src) => expect(src).toMatch(/products\/orazaka\/web\/step-(studio|results|workspace)-(dark|light)-poster\.[0-9a-f]{10}\.webp$/));
  });

  it("proves it with three run records — model, where it ran, time, cost and the run id — read from the comparison's data", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const records = sectionOf("records");
    const items = records.querySelectorAll("ul > li");
    expect(items).toHaveLength(3);
    expect(records).toHaveTextContent("Stable Diffusion 3.5 Large");
    items.forEach((li) => expect(li.querySelector("dd.font-mono")?.getAttribute("title")).toMatch(/^[0-9a-f-]{36}$/));
    expect(within(records).getByRole("link", { name: new RegExp(translations.en.landing.records.more) })).toHaveAttribute("href", "/docs/measured-runs");
    expect(records).toHaveTextContent("2026-10-17");
  });

  it("lists where it runs — Web, Mac, Mobile, CLI — as one quiet strip of links", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const strip = sectionOf("platforms");
    expect(within(strip).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["/login", "/desktop", "/docs/mobile", "/docs/cli"]);
  });

  it("names the products that run on Orazaka with the family's marks, and says « planned » where nothing is wired", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const engine = sectionOf("engine");
    const names = within(engine).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(names).toEqual(["https://www.orochia.com", "https://www.yomizaka.com", "https://www.kachizaka.com", "https://www.akinaza.com", "https://www.yasakia.com", "https://www.yororis.com"]);
    expect(within(engine).getAllByText(translations.en.landing.family.planned)).toHaveLength(3);
    expect(engine.querySelectorAll("svg").length).toBeGreaterThanOrEqual(6);
    // Orochia is named neutrally: its line is a use of the engine, never a creator or payout pitch.
    expect(translations.en.landing.family.uses.orochia).toBe("search and recommendations");
  });

  it("compares the same questions for a cloud assistant and for Orazaka, row by row, with an icon each", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
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

  it("answers the questions in native disclosures, with the matching FAQPage structured data", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const faq = screen.getByTestId("faq");
    const items = translations.en.landing.faq.items;
    expect(faq.querySelectorAll("details")).toHaveLength(items.length);
    const ld = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity.map((q: { name: string }) => q.name)).toEqual(items.map((i) => i.q));
  });

  it("closes with one call: the way in, and Talk to us", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />);
    const links = screen.getAllByRole("link", { name: translations.en.landing.nav.talk });
    expect(links.map((a) => a.getAttribute("href"))).toEqual(expect.arrayContaining(["https://www.krizaka.com/contact?topic=orazaka"]));
    expect(screen.getByText(translations.en.landing.cta.title)).toBeInTheDocument();
  });

  it("speaks French when the visitor chose it", () => {
    renderLanding("fr", <LandingPage measured={MEASURED} />);
    expect(screen.getByText(translations.fr.landing.cta.title)).toBeInTheDocument();
    expect(screen.getByText(translations.fr.landing.features.items.studios.title)).toBeInTheDocument();
  });
});

describe("LandingPage while sign-in and sign-up are closed (the default)", () => {
  const CLOSED: AuthFlags = { login: false, signup: false, github: false, google: false };

  it("hides every sign-up entry point but keeps Sign in visible, leading to /login", () => {
    const { container } = renderLanding("en", <LandingPage measured={MEASURED} />, CLOSED);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).not.toContain("/register");
    expect(screen.queryByRole("link", { name: /Get started|Create your workspace/ })).toBeNull();
    const signIn = screen.getAllByRole("link", { name: translations.en.landing.nav.signIn });
    signIn.forEach((a) => expect(a).toHaveAttribute("href", "/login"));
  });

  it("offers the documentation as the one action, and the demo as the quiet one", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />, CLOSED);
    const hero = screen.getByRole("heading", { level: 1 }).closest("header") as HTMLElement;
    const [primary, secondary] = within(hero).getAllByRole("link");
    expect(primary).toHaveTextContent(translations.en.landing.closed.heroPrimary);
    expect(primary).toHaveAttribute("href", "/docs");
    expect(secondary).toHaveAttribute("href", "/gallery");
  });

  it("keeps the Krizaka signature with the version in the footer", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />, CLOSED);
    const footer = screen.getByTestId("app-version");
    expect(footer).toHaveTextContent("A Krizaka product");
    expect(footer).toHaveTextContent(/v\S+/);
    expect(within(footer).getByRole("link", { name: /A Krizaka product/ })).toHaveAttribute("href", "https://www.krizaka.com");
    expect(within(footer).queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
  });

  it("wears the family's bar: no version, the repository, one main action, no family switcher", () => {
    renderLanding("en", <LandingPage measured={MEASURED} />, CLOSED);
    const bar = document.querySelector("header[data-floating]") as HTMLElement;
    expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
    expect(bar).not.toHaveTextContent(/dev · v/);
    expect(within(bar).getByRole("link", { name: translations.en.landing.nav.repo })).toHaveAttribute("href", "https://github.com/krizaka/orazaka-web-client");
    expect(within(bar).getAllByRole("link", { name: translations.en.landing.nav.talk })[0]).toHaveAttribute("href", "https://www.krizaka.com/contact?topic=orazaka");
    const centre = within(bar).getByRole("navigation", { name: "Orazaka" });
    expect(within(centre).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["/docs"]);
    for (const name of [translations.en.landing.nav.product, translations.en.landing.nav.platforms]) expect(within(centre).getByRole("button", { name })).toBeInTheDocument();
  });
});
