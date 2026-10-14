import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { MobilePage } from "@/features/landing/components/MobilePage";
import { CLIPS, SHOTS } from "@/features/landing/utils/mobile";

let mockLocale: Locale = "en";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: jest.fn() }),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false }),
  });
});

const renderPage = (locale: Locale) => {
  mockLocale = locale;
  return render(
    <AuthFlagsProvider flags={{ login: false, signup: false }}>
      <ThemeProvider>
        <MobilePage />
      </ThemeProvider>
    </AuthFlagsProvider>,
  );
};

describe("MobilePage", () => {
  it("shows every clip, played on demand, with its caption", () => {
    const { container } = renderPage("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.mobile.title);
    const videos = container.querySelectorAll("video");
    expect(videos.length).toBe(CLIPS.length);
    videos.forEach((v) => expect(v.hasAttribute("autoplay")).toBe(false));
    for (const id of CLIPS) expect(screen.getByText(translations.en.mobile.clips[id].caption)).toBeInTheDocument();
  });

  it("shows every screenshot under its platform, as recorded", () => {
    renderPage("en");
    const ios = screen.getByRole("region", { name: translations.en.mobile.platforms.ios });
    const android = screen.getByRole("region", { name: translations.en.mobile.platforms.android });
    expect(within(ios).getAllByRole("img").length).toBe(SHOTS.filter((s) => s.platform === "ios").length);
    expect(within(android).getAllByRole("img").length).toBe(SHOTS.filter((s) => s.platform === "android").length);
  });

  it("speaks French when the visitor chose it", () => {
    renderPage("fr");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.mobile.title);
  });
});
