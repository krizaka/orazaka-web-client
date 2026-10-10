/* eslint-disable @next/next/no-img-element, react/display-name */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";

const mockClose = jest.fn();
const mockLogout = jest.fn();

jest.mock("next/link", () => {
  return ({ children, ...props }: { children: React.ReactNode; href: string }) => (
    <a {...props}>{children}</a>
  );
});

jest.mock("next/image", () => {
  return (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />;
});

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

jest.mock("@/core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { name: "Admin", email: "admin@orazaka.io", role: "admin" },
    logout: mockLogout,
  }),
}));

jest.mock("@/core/context/SidebarContext", () => ({
  useSidebar: () => ({ isOpen: true, close: mockClose }),
}));

jest.mock("@/core/context/TenantContext", () => ({
  useTenant: () => ({
    config: { displayName: "Orazaka", layoutMode: "default" },
  }),
}));

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({
    t: {
      sidebar: {
        dashboard: "Dashboard",
        chatSessions: "Chat",
        playground: "Playground",
        jobsHistory: "Jobs",
        adminPanel: "Admin",
        navigation: "NAVIGATION",
        logout: "Log out",
        closeMenu: "Close Sidebar",
        videoCategory: "Video",
        audioCategory: "Audio",
        textCategory: "Text",
        imageCategory: "Image",
        codeCategory: "Code",
        speechCategory: "Speech",
        visionCategory: "Vision",
        generateVideo: "Generate",
        analyzeVideo: "Analyze",
        analyzeAudio: "Analyze Audio",
        textChat: "Chat",
        generateImage: "Generate Image",
        featureToCode: "Feature to Code",
        speechSynthesis: "TTS",
        visionAnalysis: "Vision",
      },
    },
    locale: "en",
  }),
}));

jest.mock("@krizaka/orazaka-design-system", () => ({
  ...jest.requireActual("@krizaka/orazaka-design-system"),
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <span {...props}>{children}</span>
  ),
}));

describe("Sidebar", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders brand name", () => {
    render(<Sidebar />);
    expect(screen.getByText("Orazaka")).toBeInTheDocument();
  });

  it("renders navigation label", () => {
    render(<Sidebar />);
    expect(screen.getByText("NAVIGATION")).toBeInTheDocument();
  });

  it("renders all nav items for admin", () => {
    render(<Sidebar />);
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Chat").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Jobs").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
  });

  it("no longer renders a settings link", () => {
    render(<Sidebar />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("renders close sidebar button", () => {
    render(<Sidebar />);
    expect(screen.getByLabelText("Close Sidebar")).toBeInTheDocument();
  });

  it("calls close on close button click", () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByLabelText("Close Sidebar"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("renders brand logo area", () => {
    render(<Sidebar />);
    // SentinelMini is an SVG, not an img — verify the brand area renders
    expect(screen.getByText("Orazaka")).toBeInTheDocument();
  });

  it("renders a Log out control", () => {
    render(<Sidebar />);
    expect(screen.getAllByText("Log out").length).toBeGreaterThan(0);
  });

  it("calls logout when the Log out control is clicked", () => {
    render(<Sidebar />);
    fireEvent.click(screen.getAllByText("Log out")[0]);
    expect(mockLogout).toHaveBeenCalled();
  });
});
