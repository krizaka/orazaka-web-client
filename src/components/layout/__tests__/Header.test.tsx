/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
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
  useTranslation: () => ({
    locale: "en",
    setLocale: mockSetLocale,
    t: {
      settings: { english: "English", french: "French" },
      sidebar: { dashboard: "Dashboard" },
      dashboard: { sovereignBadge: "Local · sovereign" },
      header: { profile: "Profile", settings: "Settings", logout: "Logout", themeDark: "Dark theme", themeLight: "Light theme", themeSystem: "System theme", openSidebar: "Open Sidebar", changeLanguage: "Change Language", closeLanguageMenu: "Close language menu" },
      notifications: {
        title: "Notifications",
        active: "active",
        noTasks: "No tasks",
        viewAll: "View All",
        videoGen: "Video",
        imageGen: "Image",
        speechGen: "Speech",
        textGen: "Text",
      },
    },
  }),
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

describe("Header", () => {
  afterEach(() => jest.clearAllMocks());

  it("names the app next to its mark, with the sovereign status as a chip", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveTextContent("Orazaka");
    expect(screen.getByText("Local · sovereign")).toBeInTheDocument();
  });

  it("renders user name", () => {
    render(<Header />);
    expect(screen.getByText("Oussama")).toBeInTheDocument();
  });

  it("renders the user's initial while the default Orazaka picture loads", async () => {
    render(<Header />);
    expect(await screen.findByText("O")).toBeInTheDocument();
  });

  it("asks for Orazaka's default avatar when the account has no photo", async () => {
    const { container } = render(<Header />);
    await screen.findByText("O");
    // Radix draws the <img> only once loaded; the fallback ring wraps it with the avatar's size marker.
    expect(container.querySelector('[data-size="sm"]')).not.toBeNull();
  });

  it("renders language switcher with locale", () => {
    render(<Header />);
    expect(screen.getByText("en")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toHaveTextContent("Dark theme");
  });

  it("renders notification bell", () => {
    render(<Header />);
    expect(screen.getByTestId("notif-bell")).toBeInTheDocument();
  });

  it("opens language dropdown (Radix menu: Enter on the trigger)", () => {
    render(<Header />);
    fireEvent.keyDown(screen.getByLabelText("Change Language"), { key: "Enter" });
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("switches to French locale", () => {
    render(<Header />);
    fireEvent.keyDown(screen.getByLabelText("Change Language"), { key: "Enter" });
    fireEvent.click(screen.getByText("French"));
    expect(mockSetLocale).toHaveBeenCalledWith("fr");
  });

  it("links the user chip straight to the profile page", () => {
    render(<Header />);
    const link = screen.getByText("Oussama").closest("a");
    expect(link).toHaveAttribute("href", "/profile");
  });

  it("opens sidebar on menu button", () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText("Open Sidebar"));
    expect(mockOpen).toHaveBeenCalled();
  });

  it("no longer exposes a settings or logout menu in the header", () => {
    render(<Header />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
