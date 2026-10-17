/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { translations } from "@/core/context/translations";
import { APP_SECTIONS, currentAppSection } from "@/core/config/app-sections";

const mockClose = jest.fn();
const mockPath = { current: "/" };
const mockUser = { current: { name: "Admin", email: "admin@orazaka.io", role: "admin" } as { name: string; email: string; role: string } };
const t = translations.en;

jest.mock("next/link", () => ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>);
jest.mock("next/navigation", () => ({ usePathname: () => mockPath.current }));
jest.mock("@/core/hooks/useAuth", () => ({ useAuth: () => ({ user: mockUser.current, logout: jest.fn() }) }));
jest.mock("@/core/context/SidebarContext", () => ({ useSidebar: () => ({ isOpen: true, close: mockClose }) }));
jest.mock("@/core/context/TenantContext", () => ({ useTenant: () => ({ config: { displayName: "Orazaka", layoutMode: "default" } }) }));
jest.mock("@/core/context/LocaleContext", () => ({ useTranslation: () => ({ t: jest.requireActual("@/core/context/translations").translations.en, locale: "en" }) }));

/** The phone drawer (the second navigation): its links' words, in order. */
const drawerWords = () => within(screen.getAllByRole("navigation", { name: t.appNav.label })[1]).getAllByRole("link").filter((a) => a.getAttribute("href") !== "/" || a.textContent === "Home").map((a) => a.textContent);

describe("the signed-in app's sections", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockPath.current = "/";
    mockUser.current = { name: "Admin", email: "admin@orazaka.io", role: "admin" };
  });

  it("are one list, in this order, shared by the rail, the drawer and the palette", () => {
    expect(APP_SECTIONS.map((s) => `${s.id} ${s.href} ${s.place}`)).toMatchInlineSnapshot(`
[
  "home / main",
  "studios /studios main",
  "chat /chat main",
  "jobs /dashboard/jobs main",
  "packs /packs main",
  "usage /billing main",
  "settings /profile foot",
  "admin /dashboard/admin foot",
]
`);
  });

  it("shows every section by its name in the drawer, Settings and Admin at the foot, and no Sign out (it is in the user menu)", () => {
    render(<Sidebar />);
    expect(drawerWords()).toEqual(["Home", "Studios", "Chat", "Jobs", "Packs", "Usage & credits", "Settings", "Admin"]);
    expect(screen.queryByText(t.appNav.signOut)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(t.sidebar.logout)).not.toBeInTheDocument();
  });

  it("hides Admin from a member", () => {
    mockUser.current = { name: "Eric", email: "eric@example.com", role: "user" };
    render(<Sidebar />);
    expect(drawerWords()).not.toContain("Admin");
  });

  it.each([
    ["/", "home"],
    ["/chat", "chat"],
    ["/studios/runs/r1", "studios"],
    ["/dashboard/jobs", "jobs"],
    ["/dashboard/admin", "admin"],
    ["/billing", "usage"],
    ["/profile", "settings"],
    ["/automation", null],
  ])("marks exactly one section current on %s", (path, id) => {
    expect(currentAppSection(path)).toBe(id);
    mockPath.current = path;
    render(<Sidebar />);
    const current = document.querySelectorAll('[aria-current="page"]');
    // the rail and the drawer each mark the same one
    expect(current).toHaveLength(id ? 2 : 0);
    if (id) for (const el of current) expect(el.getAttribute("href")).toBe(APP_SECTIONS.find((s) => s.id === id)!.href);
  });

  it("closes the drawer from its button", () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByLabelText(t.sidebar.closeMenu));
    expect(mockClose).toHaveBeenCalled();
  });
});
