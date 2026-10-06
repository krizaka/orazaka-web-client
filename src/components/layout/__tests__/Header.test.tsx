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
    accentClasses: { text: "text-status-warning", bgSoft: "bg-status-warning/10", bg: "bg-status-warning" },
  }),
}));

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({
    locale: "en",
    setLocale: mockSetLocale,
    t: {
      settings: { english: "English", french: "French" },
      header: { profile: "Profile", settings: "Settings", logout: "Logout" },
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

jest.mock("@/components/ui/ThemeToggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
}));

jest.mock("@/components/layout/NotificationBell", () => ({
  NotificationBell: ({ onToggle }: { bellOpen: boolean; onToggle: (v: boolean) => void }) => (
    <button data-testid="notif-bell" onClick={() => onToggle(true)}>Bell</button>
  ),
}));

describe("Header", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders user name", () => {
    render(<Header />);
    expect(screen.getByText("Oussama")).toBeInTheDocument();
  });

  it("renders user initial avatar", () => {
    render(<Header />);
    expect(screen.getByText("O")).toBeInTheDocument();
  });

  it("renders language switcher with locale", () => {
    render(<Header />);
    expect(screen.getByText("en")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders notification bell", () => {
    render(<Header />);
    expect(screen.getByTestId("notif-bell")).toBeInTheDocument();
  });

  it("opens language dropdown", () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText("Change Language"));
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("switches to French locale", () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText("Change Language"));
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
