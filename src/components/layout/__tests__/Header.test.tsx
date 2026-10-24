/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { translations } from "@/core/context/translations";
import { Header } from "@/components/layout/Header";

const mockLogout = jest.fn();
const mockSetLocale = jest.fn();

jest.mock("next/link", () => {
  return ({ children, ...props }: { children: React.ReactNode; href: string }) => (
    <a {...props}>{children}</a>
  );
});

jest.mock("@/core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { name: "Oussama", email: "admin@orazaka.io" },
    isAuthenticated: true,
    logout: mockLogout,
  }),
}));

jest.mock("@/core/context/TenantContext", () => ({
  useTenant: () => ({
    accentClasses: { text: "text-warning", bgSoft: "bg-warning/10", bg: "bg-warning" },
  }),
}));

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ locale: "en", setLocale: mockSetLocale, t: jest.requireActual("@/core/context/translations").translations.en }),
}));

jest.mock("@krizaka/ui/theme", () => ({
  ThemeToggle: ({ label }: { label: (mode: string) => string }) => (
    <button data-testid="theme-toggle">{label("dark")}</button>
  ),
}));

jest.mock("@/components/layout/NotificationBell", () => ({
  NotificationBell: ({ onToggle }: { bellOpen: boolean; onToggle: (v: boolean) => void }) => (
    <button data-testid="notif-bell" onClick={() => onToggle(true)}>Bell</button>
  ),
}));

const t = translations.en;
const openMenu = () => fireEvent.keyDown(screen.getByRole("button", { name: t.appNav.account }), { key: "Enter" });

describe("Header", () => {
  afterEach(() => jest.clearAllMocks());

  it("names the app next to its mark, and claims no « Local · sovereign » it cannot know", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: t.appNav.home })).toHaveTextContent("Orazaka");
    // The badge was hard-coded: the dev deployment runs in the cloud, not locally (Oussama, 2026-10-24). A status chip
    // comes back only when it is read from what the engine reports.
    expect(screen.queryByText(t.dashboard.sovereignBadge)).not.toBeInTheDocument();
  });

  it("draws the user menu's trigger as the avatar, then the name", async () => {
    render(<Header />);
    const trigger = screen.getByRole("button", { name: t.appNav.account });
    expect(await within(trigger).findByText("O")).toBeInTheDocument();
    expect(trigger.firstElementChild?.getAttribute("data-size")).toBe("sm");
    expect(trigger.querySelector("[data-name]")).toHaveAttribute("data-name", "Oussama");
  });

  it("opens the user menu: who you are first, then the places, the language as one row, then Sign out", () => {
    render(<Header />);
    openMenu();
    const menu = screen.getByRole("menu");
    const text = menu.textContent!;
    expect(text.indexOf("admin@orazaka.io")).toBeLessThan(text.indexOf(t.profile.title));
    expect(within(menu).getByRole("menuitem", { name: t.profile.title })).toHaveAttribute("href", "/settings/account");
    expect(within(menu).getByRole("menuitem", { name: t.appNav.settings })).toHaveAttribute("href", "/settings/appearance");
    // the language is a compact submenu showing the current one, not two checked rows
    expect(within(menu).queryAllByRole("menuitemcheckbox")).toHaveLength(0);
    expect(within(menu).getByRole("menuitem", { name: new RegExp(t.appNav.language) })).toHaveTextContent(t.settings.english);
    const items = within(menu).getAllByRole("menuitem").map((i) => i.textContent);
    expect(items.at(-1)).toBe(t.appNav.signOut);
  });

  it("signs out quietly: not in the danger tone", () => {
    render(<Header />);
    openMenu();
    expect(screen.getByRole("menuitem", { name: t.appNav.signOut })).toHaveAttribute("data-tone", "default");
  });

  it("the menu draws no scrollbar at its natural height", () => {
    render(<Header />);
    openMenu();
    expect(screen.getByRole("menu").className).toContain("overflow-x-hidden");
  });

  it("signs out from the user menu", () => {
    render(<Header />);
    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: t.appNav.signOut }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("keeps the theme toggle and the notifications in the bar", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-toggle")).toHaveTextContent(t.header.themeDark);
    expect(screen.getByTestId("notif-bell")).toBeInTheDocument();
  });
});
