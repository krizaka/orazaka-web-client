import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AppCommandPalette } from "@/core/components/AppCommandPalette";
import { translations } from "@/core/context/translations";

const push = jest.fn();
let role = "user";
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
jest.mock("@/core/hooks/useAuth", () => ({ useAuth: () => ({ user: { role } }) }));
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: jest.requireActual("@/core/context/translations").translations.fr, locale: "fr" }),
}));

const t = translations.fr;

async function open() {
  await act(async () => {
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
  });
}

describe("AppCommandPalette", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });
  afterEach(() => {
    jest.clearAllMocks();
    role = "user";
  });

  it("lists the app's routes in the person's language, without the admin panel for a user", async () => {
    render(<AppCommandPalette />);
    await open();
    expect(screen.getByRole("dialog", { name: t.commandPalette.label })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: new RegExp(t.sidebar.studios) })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: new RegExp(t.sidebar.adminPanel) })).toBeNull();
  });

  it("adds the admin panel for an admin and navigates with the router", async () => {
    role = "admin";
    render(<AppCommandPalette />);
    await open();
    await act(async () => {
      fireEvent.click(screen.getByRole("option", { name: new RegExp(t.sidebar.adminPanel) }));
    });
    expect(push).toHaveBeenCalledWith("/dashboard/admin");
  });
});
