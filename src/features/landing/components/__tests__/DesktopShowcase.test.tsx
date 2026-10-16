import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { DesktopShowcase } from "@/features/landing/components/DesktopShowcase";

let mockLocale: Locale = "en";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: jest.fn() }),
}));

beforeAll(() => {
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

function renderShowcase(locale: Locale = "en") {
  mockLocale = locale;
  return render(
    <ThemeProvider>
      <DesktopShowcase />
    </ThemeProvider>,
  );
}

describe("DesktopShowcase", () => {
  it("renders the macOS window container and all 5 step navigation buttons", () => {
    renderShowcase("en");
    expect(screen.getByText("Orazaka — Sovereign Desktop Workspace (Apple Silicon)")).toBeInTheDocument();
    const d = translations.en.desktop.showcase;
    for (const step of d.steps) {
      expect(screen.getByRole("button", { name: new RegExp(step.tabLabel, "i") })).toBeInTheDocument();
    }
  });

  it("displays verified technical proof for each active step", () => {
    renderShowcase("en");
    const d = translations.en.desktop.showcase;
    expect(screen.getByText(d.steps[0].proofBadge)).toBeInTheDocument();
    expect(screen.getByText(d.steps[0].proofDetail)).toBeInTheDocument();

    // Click step 2 (Generation Studio)
    fireEvent.click(screen.getByRole("button", { name: new RegExp(d.steps[1].tabLabel, "i") }));
    expect(screen.getByText(d.steps[1].proofBadge)).toBeInTheDocument();
    expect(screen.getByText(d.steps[1].proofDetail)).toBeInTheDocument();
  });

  it("allows interactive toggling between Local Metal and Cloud API in Modes screen", () => {
    renderShowcase("en");
    expect(screen.getByText("http://localhost:8088 · Sovereign Edge")).toBeInTheDocument();
    expect(screen.getByText("0.8 ms (Loopback)")).toBeInTheDocument();

    // Switch to Cloud API
    const cloudBtn = screen.getByRole("button", { name: "Cloud API" });
    fireEvent.click(cloudBtn);

    expect(screen.getByText("https://dev.orazaka.com · OAuth 2.1 PKCE")).toBeInTheDocument();
    expect(screen.getByText("19.2 ms (TLS 1.3)")).toBeInTheDocument();
  });

  it("speaks French with verified proofs when French is selected", () => {
    renderShowcase("fr");
    const d = translations.fr.desktop.showcase;
    expect(screen.getByText(d.steps[0].proofBadge)).toBeInTheDocument();
    expect(screen.getByText(d.steps[0].headline)).toBeInTheDocument();
  });
});
