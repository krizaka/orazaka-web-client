/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

jest.mock("next/link", () => ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>);
jest.mock("next/navigation", () => ({ usePathname: () => "/" }));
jest.mock("@/core/hooks/useAuth", () => ({ useAuth: () => ({ user: { name: "Eric", email: "eric@example.com", role: "user" }, isAuthenticated: true, logout: jest.fn() }) }));
jest.mock("@/core/context/SidebarContext", () => ({ useSidebar: () => ({ isOpen: false, open: jest.fn(), close: jest.fn() }) }));
jest.mock("@/core/context/TenantContext", () => ({ useTenant: () => ({ config: { displayName: "Orazaka", layoutMode: "default" } }) }));
jest.mock("@/core/context/LocaleContext", () => ({ useTranslation: () => ({ locale: "en", setLocale: jest.fn(), t: jest.requireActual("@/core/context/translations").translations.en }) }));
jest.mock("@krizaka/ui/theme", () => ({ ThemeToggle: () => <button>theme</button> }));
jest.mock("@/components/layout/NotificationBell", () => ({ NotificationBell: () => <button>bell</button> }));

/** jsdom has no Tailwind: read an element's visibility at a breakpoint from the utility classes of itself and its ancestors. */
function visibleAt(el: Element, bp: "phone" | "desktop"): boolean {
  for (let n: Element | null = el; n; n = n.parentElement) {
    const c = new Set((n.getAttribute("class") ?? "").split(/\s+/));
    const base = c.has("hidden") && !c.has("md:flex") && !c.has("md:block") && !c.has("md:inline-flex");
    if (bp === "phone" && c.has("hidden")) return false;
    if (bp === "desktop" && (c.has("md:hidden") || base)) return false;
  }
  return true;
}

describe("one brand mark per breakpoint (the rail and the bar share the shell)", () => {
  const shell = () => render(<><Sidebar /><Header /></>).container;

  it.each(["phone", "desktop"] as const)("shows the Orazaka mark exactly once on %s", (bp) => {
    const marks = [...shell().querySelectorAll("[data-brand-mark]")].filter((m) => visibleAt(m, bp));
    expect(marks).toHaveLength(1);
  });

  it("puts the mark in the rail on desktop and in the bar on phone", () => {
    const c = shell();
    const at = (bp: "phone" | "desktop") => [...c.querySelectorAll("[data-brand-mark]")].find((m) => visibleAt(m, bp))!;
    expect(at("desktop").closest("aside")).not.toBeNull();
    expect(at("phone").closest("header")).not.toBeNull();
  });

  it("keeps the word « Orazaka » in the bar at every breakpoint", () => {
    const word = [...shell().querySelectorAll("header span")].find((s) => s.textContent === "Orazaka")!;
    expect(visibleAt(word, "phone") && visibleAt(word, "desktop")).toBe(true);
  });

  it("centres the rail's mark on the bar's row (both 3.5 rem tall), so the mark and the word share one line", () => {
    const c = shell();
    const railMark = c.querySelector("aside [data-brand-mark]")!.parentElement!;
    expect(railMark.className).toContain("h-14");
    expect(c.querySelector("header")!.className).toContain("h-14");
  });
});
