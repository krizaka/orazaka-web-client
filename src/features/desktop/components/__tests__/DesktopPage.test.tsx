import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { DesktopPage } from "@/features/desktop/components/DesktopPage";
import { RELEASES_URL } from "@/features/desktop/utils/release";

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

const SHA = "fb8a1570c2f1032bf6029e3eebaf711d77b2f6dfe7c706cd6d592b3bea8d834b";
const release = {
  tag: "desktop-v9.9.9-test",
  version: "9.9.9-test",
  prerelease: true,
  publishedAt: "2026-10-14T00:00:00Z",
  pageUrl: "https://github.com/krizaka/orazaka/releases/tag/desktop-v9.9.9-test",
  dmg: { name: "Orazaka_9.9.9_aarch64.dmg", url: "https://example.test/Orazaka_9.9.9_aarch64.dmg", bytes: 6271937 },
  shaUrl: "https://example.test/Orazaka_9.9.9_aarch64.dmg.sha256",
  sha256: SHA,
};

function renderPage(locale: Locale, rel: typeof release | null) {
  mockLocale = locale;
  return render(
    <AuthFlagsProvider flags={{ login: false, signup: false, github: false, google: false }}>
      <ThemeProvider>
        <DesktopPage release={rel} />
      </ThemeProvider>
    </AuthFlagsProvider>,
  );
}

describe("DesktopPage", () => {
  it("offers the download of the release it is given, with its version and SHA-256 — nothing hard-coded", () => {
    renderPage("en", release);
    const d = translations.en.desktop;
    expect(screen.getByRole("link", { name: d.download.button })).toHaveAttribute("href", release.dmg.url);
    expect(screen.getByTestId("desktop-version")).toHaveTextContent("9.9.9-test");
    expect(screen.getByTestId("desktop-sha")).toHaveTextContent(SHA);
  });

  it("says honestly that the build is not signed by Apple, and how to open it", () => {
    renderPage("en", release);
    const note = screen.getByRole("note");
    expect(note).toHaveTextContent(translations.en.desktop.testBuild.title);
    expect(note).toHaveTextContent("xattr -dr com.apple.quarantine /Applications/Orazaka.app");
  });

  it("makes no claim about Windows or Linux builds, and lists the requirements", () => {
    const { container } = renderPage("en", release);
    expect(container.textContent).toMatch(/no Windows or Linux build/i);
    expect(container.textContent).not.toMatch(/Download for Windows/i);
    expect(container.textContent).toMatch(/Apple Silicon/);
    expect(container.textContent).toMatch(/Node\.js 22/);
  });

  it("links the releases page when the latest build cannot be read — no guessed URL, no button", () => {
    renderPage("en", null);
    const d = translations.en.desktop.download;
    expect(screen.queryByRole("link", { name: d.button })).toBeNull();
    expect(screen.getByRole("link", { name: d.releases })).toHaveAttribute("href", RELEASES_URL);
  });

  it("speaks French when the visitor chose it", () => {
    renderPage("fr", release);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.desktop.hero.title);
    expect(within(screen.getByRole("note")).getByText(translations.fr.desktop.testBuild.title)).toBeInTheDocument();
  });

  it("has the same shape in English and French", () => {
    const keys = (v: unknown): unknown => (Array.isArray(v) ? v.map(keys) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, keys(x)])) : typeof v);
    expect(keys(translations.fr.desktop)).toEqual(keys(translations.en.desktop));
  });
});
