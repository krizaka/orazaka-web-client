import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { MobilePage } from "@/features/landing/components/MobilePage";
import { STEPS } from "@/features/landing/utils/mobile";

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
  it("explains each step: a recording played on demand, its goal, its purpose and what to notice", () => {
    const { container } = renderPage("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.mobile.title);
    const videos = container.querySelectorAll("video");
    expect(videos.length).toBe(STEPS.length);
    videos.forEach((v) => {
      expect(v.hasAttribute("autoplay")).toBe(false);
      expect(v.getAttribute("aria-label")).toBeTruthy();
      expect(v.getAttribute("preload")).toBe("none");
      expect(v.getAttribute("poster")).toMatch(/poster/);
    });
    for (const id of STEPS) {
      const s = translations.en.mobile.steps[id];
      expect(screen.getByRole("heading", { level: 3, name: s.goal })).toBeInTheDocument();
      expect(screen.getByText(s.purpose)).toBeInTheDocument();
      for (const n of s.notice) expect(screen.getByText(n)).toBeInTheDocument();
    }
  });

  it("shows no screenshot gallery any more", () => {
    const { container } = renderPage("en");
    expect(container.querySelectorAll("img").length).toBe(0);
  });

  it("speaks French when the visitor chose it", () => {
    renderPage("fr");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.mobile.title);
    expect(screen.getByRole("heading", { level: 3, name: translations.fr.mobile.steps["studio-run"].goal })).toBeInTheDocument();
  });
});
