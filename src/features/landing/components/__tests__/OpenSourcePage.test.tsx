import "@testing-library/jest-dom";
import { mockReducedMotion } from "@/features/landing/utils/reduced-motion.testkit";
import { render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { OpenSourcePage } from "@/features/landing/components/OpenSourcePage";

jest.mock("next/navigation", () => ({ usePathname: () => "/open-source", useRouter: () => ({ push: jest.fn() }) }));
let mockLocale: Locale = "en";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: jest.fn() }),
}));

beforeAll(mockReducedMotion);

function renderLanding(locale: Locale, ui: ReactElement) {
  mockLocale = locale;
  return render(
    <AuthFlagsProvider flags={{ login: false, signup: false, github: false, google: false }}>
      <ThemeProvider>{ui}</ThemeProvider>
    </AuthFlagsProvider>,
  );
}

const o = translations.en.openSource;
const repos = [
  {
    name: "orazaka-studio",
    description: "Studio runs",
    url: "https://github.com/krizaka/orazaka-studio",
    pushedAt: "2026-10-20T00:00:00Z",
  },
];

describe("/open-source", () => {
  it("lists the repositories it was given, each a link to GitHub", () => {
    renderLanding("en", <OpenSourcePage repos={repos} />);
    const list = screen.getByRole("list", { name: o.repos.label });
    expect(within(list).getByRole("link", { name: /orazaka-studio/ })).toHaveAttribute(
      "href",
      "https://github.com/krizaka/orazaka-studio",
    );
  });

  it("says so, with a link to the organisation, when GitHub could not be read", () => {
    renderLanding("en", <OpenSourcePage repos={null} />);
    expect(screen.getByText(o.repos.unavailable, { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: o.repos.all })).toHaveAttribute("href", "https://github.com/krizaka");
  });

  it("states the licence line and links self-hosting to the docs", () => {
    renderLanding("en", <OpenSourcePage repos={repos} />);
    expect(screen.getAllByText("Apache-2.0").length).toBeGreaterThan(1);
    expect(screen.getByRole("link", { name: o.selfHost.cta })).toHaveAttribute("href", "/docs/self-hosting");
  });

  it("speaks French when asked", () => {
    renderLanding("fr", <OpenSourcePage repos={repos} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.openSource.title);
  });
});
