import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { APP_VERSION } from "@/core/config/version";
import { ChangelogView } from "@/features/landing/components/ChangelogView";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { releasesFromGithub } from "@/features/landing/utils/changelog";
import { publicPaths } from "@/app/_seo/seo";

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

const FLAGS = { login: false, signup: false, github: false, google: false };
const RELEASES = releasesFromGithub([
  { tag_name: "v0.3.0", draft: false, published_at: "2026-10-16T10:00:00Z", html_url: "https://github.com/krizaka/orazaka/releases/tag/v0.3.0", body: "* feat(chat): voice replies by @x in https://github.com/krizaka/orazaka/pull/12\n* fix: XSS in the export by @x in https://github.com/krizaka/orazaka/pull/13" },
  { tag_name: "v0.2.0", draft: false, published_at: "2026-10-10T10:00:00Z", html_url: "https://github.com/krizaka/orazaka/releases/tag/v0.2.0", body: "* feat: first release" },
  { tag_name: "v0.1.0", draft: true, published_at: null, html_url: "x", body: "* feat: hidden" },
]);

const renderView = () =>
  render(
    <AuthFlagsProvider flags={FLAGS}>
      <ThemeProvider>
        <ChangelogView releases={RELEASES} />
      </ThemeProvider>
    </AuthFlagsProvider>,
  );

describe("/changelog", () => {
  it("reads the releases newest first and drops drafts", () => {
    expect(RELEASES.map((r) => r.version)).toEqual(["0.3.0", "0.2.0"]);
    expect(RELEASES[0].changes.map((c) => c.tag)).toEqual(["feature", "security"]);
  });

  it.each<Locale>(["en", "fr"])("renders the latest version, tagged changes with their PR, one contentinfo (%s)", (locale) => {
    mockLocale = locale;
    renderView();
    expect(screen.getByRole("heading", { level: 1, name: translations[locale].changelog.title })).toBeTruthy();
    expect(screen.getByText("0.3.0")).toBeTruthy();
    expect(screen.getByRole("link", { name: /12/ })).toHaveAttribute("href", "https://github.com/krizaka/orazaka/pull/12");
    expect(screen.getByText(translations[locale].changelog.kinds.security)).toBeTruthy();
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  });

  it("the footer's version link resolves to an id on the page", () => {
    mockLocale = "en";
    const { container } = renderView();
    const link = screen.getByTestId("app-version").querySelector(`a[href="/changelog#${APP_VERSION}"]`);
    expect(link).not.toBeNull();
    expect(container.querySelector(`[id="${APP_VERSION}"]`)).not.toBeNull();
  });

  it("is a public page, in the sitemap, and the footer alone links it", () => {
    expect(publicPaths()).toContain("/changelog");
    mockLocale = "en";
    render(
      <AuthFlagsProvider flags={FLAGS}>
        <ThemeProvider>
          <LandingFooter />
        </ThemeProvider>
      </AuthFlagsProvider>,
    );
    expect(screen.getByRole("link", { name: `v${APP_VERSION}` })).toHaveAttribute("href", `/changelog#${APP_VERSION}`);
  });
});
