/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { translations } from "@/core/context/translations";
import { APP_SECTIONS, currentAppSection } from "@/core/config/app-sections";

const mockPath = { current: "/" };
const mockUser = { current: { name: "Admin", email: "admin@orazaka.io", role: "admin" } as { name: string; email: string; role: string } };
const t = translations.en;

jest.mock("next/link", () => ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>);
jest.mock("next/navigation", () => ({ usePathname: () => mockPath.current }));
jest.mock("@/core/hooks/useAuth", () => ({ useAuth: () => ({ user: mockUser.current, logout: jest.fn() }) }));
jest.mock("@/core/context/LocaleContext", () => ({ useTranslation: () => ({ t: jest.requireActual("@/core/context/translations").translations.en, locale: "en" }) }));

const words = () => within(screen.getByRole("navigation", { name: t.appNav.label })).getAllByRole("link").map((a) => a.getAttribute("aria-label") ?? a.textContent);

describe("the signed-in app's sections (RailNav)", () => {
  afterEach(() => {
    mockPath.current = "/";
    mockUser.current = { name: "Admin", email: "admin@orazaka.io", role: "admin" };
  });

  it("are one list, in this order, shared by the rail and the palette", () => {
    expect(APP_SECTIONS.map((s) => `${s.id} ${s.href} ${s.place}`)).toEqual([
      "home / main",
      "studios /studios main",
      "chat /chat main",
      "jobs /jobs main",
      "packs /packs main",
      "usage /usage main",
      "settings /settings foot",
      "admin /dashboard/admin foot",
    ]);
  });

  it("shows the sections as one navigation — the mark (home) first, Settings and Admin last, no Sign out", () => {
    render(<Sidebar />);
    const list = words();
    expect(list[0]).toBe(t.appNav.home);
    expect(list.slice(1)).toEqual(["Studios", "Chat", "Jobs", "Plan", "Usage & credits", "Settings", "Admin"]);
    expect(screen.queryByText(t.appNav.signOut)).not.toBeInTheDocument();
  });

  it("hides Admin from a member", () => {
    mockUser.current = { name: "Eric", email: "eric@example.com", role: "user" };
    render(<Sidebar />);
    expect(words()).not.toContain("Admin");
  });

  it.each([
    ["/", "home"],
    ["/chat", "chat"],
    ["/studios/runs/r1", "studios"],
    ["/jobs", "jobs"],
    ["/dashboard/admin", "admin"],
    ["/usage", "usage"],
    ["/settings", "settings"],
    ["/automation", null],
  ])("marks at most one section current on %s", (path, id) => {
    expect(currentAppSection(path)).toBe(id);
    mockPath.current = path;
    render(<Sidebar />);
    const current = document.querySelectorAll('[aria-current="page"]');
    // Home is the mark, not an item: it is never marked
    const expected = id && id !== "home" ? 1 : 0;
    expect(current).toHaveLength(expected);
    if (expected) expect(current[0].getAttribute("href")).toBe(APP_SECTIONS.find((s) => s.id === id)!.href);
  });

  it("carries the brand mark once, in the rail", () => {
    const { container } = render(<Sidebar />);
    expect(container.querySelectorAll("[data-brand-mark]")).toHaveLength(1);
  });
});
