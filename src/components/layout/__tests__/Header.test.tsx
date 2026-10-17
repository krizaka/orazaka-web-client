/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { translations } from "@/core/context/translations";
import { Header } from "@/components/layout/Header";

const mockLogout = jest.fn();
const mockOpen = jest.fn();
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

jest.mock("@/core/context/SidebarContext", () => ({
  useSidebar: () => ({ open: mockOpen }),
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

  it("names the app next to its mark, with the sovereign status as a chip", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: t.appNav.home })).toHaveTextContent("Orazaka");
    expect(screen.getByText(t.dashboard.sovereignBadge)).toBeInTheDocument();
  });

  it("draws the user menu's trigger as the avatar, then the name", async () => {
    render(<Header />);
    const trigger = screen.getByRole("button", { name: t.appNav.account });
    expect(await within(trigger).findByText("O")).toBeInTheDocument();
    expect(trigger.firstElementChild?.getAttribute("data-size")).toBe("sm");
    expect(within(trigger).getByText("Oussama")).toBeInTheDocument();
  });

  it("opens the user menu: who you are first, then the language, then Sign out", () => {
    render(<Header />);
    openMenu();
    const menu = screen.getByRole("menu");
    expect(menu.textContent?.indexOf("admin@orazaka.io")).toBeLessThan(menu.textContent!.indexOf(t.appNav.language));
    expect(within(menu).getAllByRole("menuitemcheckbox").map((i) => i.textContent)).toEqual([t.settings.english, t.settings.french]);
    expect(within(menu).getByRole("menuitemcheckbox", { name: t.settings.english })).toHaveAttribute("aria-checked", "true");
    const items = within(menu).getAllByRole("menuitem");
    expect(items.map((i) => i.textContent)).toEqual([t.appNav.signOut]);
  });

  it("switches the language from the user menu", () => {
    render(<Header />);
    openMenu();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: t.settings.french }));
    expect(mockSetLocale).toHaveBeenCalledWith("fr");
  });

  it("signs out from the user menu", () => {
    render(<Header />);
    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: t.appNav.signOut }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("repeats nothing the rail holds: no section of the app in the bar or the user menu", () => {
    render(<Header />);
    openMenu();
    for (const id of ["chat", "studios", "jobs", "packs", "usage", "settings", "admin"] as const) {
      expect(screen.queryByText(t.appNav[id])).not.toBeInTheDocument();
    }
  });

  it("keeps the theme toggle and the notifications in the bar", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-toggle")).toHaveTextContent(t.header.themeDark);
    expect(screen.getByTestId("notif-bell")).toBeInTheDocument();
  });

  it("opens the drawer from the menu button", () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText(t.header.openSidebar));
    expect(mockOpen).toHaveBeenCalled();
  });
});
