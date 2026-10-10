import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileView } from "@/features/profile/components/ProfileView";

const mockSave = jest.fn();
const mockDiscard = jest.fn();
const mockReplace = jest.fn();
let mockSearch = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  usePathname: () => "/profile",
  useSearchParams: () => mockSearch,
}));

jest.mock("@/core/context/TenantContext", () => ({
  useTenant: () => ({
    accentClasses: { accentGradient: "from-surface-3 to-surface-3", bg: "bg-surface-3" },
  }),
}));

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({
    t: {
      a11y: jest.requireActual("@/core/context/translations.automation").a11y.en,
      settings: { saving: "Saving…" },
      profile: {
        failedLoad: "Failed to load profile",
        unauthError: "Not authenticated",
        enterpriseTier: "Enterprise",
        premiumTier: "Premium",
        freeTier: "Free",
        unsavedChanges: "You have unsaved changes",
        saveChanges: "Save changes",
        discard: "Discard",
        tabs: {
          account: "Account",
          appearance: "Appearance",
          workspace: "Workspace",
          integrations: "Integrations",
        },
      },
    },
    locale: "en",
  }),
}));

jest.mock("@/features/profile/hooks/useProfile", () => ({
  useProfile: () => ({
    profile: {
      id: "user-123",
      username: "testadmin",
      email: "admin@orazaka.io",
      authorities: ["ROLE_ADMIN"],
      preferences: { theme: "dark", aiPersona: "standard" },
    },
    isLoading: false,
    error: null,
  }),
}));

jest.mock("@/features/profile/hooks/useProfileForm", () => ({
  useProfileForm: () => ({
    form: {},
    setField: jest.fn(),
    setLanguage: jest.fn(),
    setTheme: jest.fn(),
    availableThemes: [],
    isLoading: false,
    isUpdating: false,
    isDirty: true,
    save: mockSave,
    discard: mockDiscard,
  }),
}));

jest.mock("@/features/profile/components/AccountTab", () => ({
  AccountTab: () => <div data-testid="account-tab" />,
}));
jest.mock("@/features/profile/components/AppearanceTab", () => ({
  AppearanceTab: () => <div data-testid="appearance-tab" />,
}));
jest.mock("@/features/profile/components/WorkspaceTab", () => ({
  WorkspaceTab: () => <div data-testid="workspace-tab" />,
}));
jest.mock("@/features/profile/components/IntegrationsTab", () => ({
  IntegrationsTab: () => <div data-testid="integrations-tab" />,
}));

jest.mock("@krizaka/orazaka-design-system", () => ({
  ...jest.requireActual("@krizaka/orazaka-design-system"),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("ProfileView (tabbed)", () => {
  beforeEach(() => {
    mockSearch = new URLSearchParams();
  });
  afterEach(() => jest.clearAllMocks());

  it("renders the identity hero (username, email, tier, initials)", () => {
    render(<ProfileView />);
    expect(screen.getByText("testadmin")).toBeInTheDocument();
    expect(screen.getByText("admin@orazaka.io")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("TE")).toBeInTheDocument();
  });

  it("renders all tabs and shows the Workspace tab for admins", () => {
    render(<ProfileView />);
    expect(screen.getByRole("tab", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Appearance" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Workspace" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Integrations" })).toBeInTheDocument();
  });

  it("defaults to the Account tab when no ?tab is present", () => {
    render(<ProfileView />);
    expect(screen.getByTestId("account-tab")).toBeInTheDocument();
  });

  it("reflects the active tab from the ?tab URL param", () => {
    mockSearch = new URLSearchParams("tab=integrations");
    render(<ProfileView />);
    expect(screen.getByTestId("integrations-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("account-tab")).not.toBeInTheDocument();
  });

  it("falls back to Account for an unknown ?tab value", () => {
    mockSearch = new URLSearchParams("tab=does-not-exist");
    render(<ProfileView />);
    expect(screen.getByTestId("account-tab")).toBeInTheDocument();
  });

  it("writes the selected tab to the URL on click", () => {
    render(<ProfileView />);
    fireEvent.click(screen.getByRole("tab", { name: "Integrations" }));
    expect(mockReplace).toHaveBeenCalledWith("/profile?tab=integrations", {
      scroll: false,
    });
  });

  it("shows the sticky Save bar when the form is dirty and saves on click", () => {
    render(<ProfileView />);
    expect(screen.getByText("You have unsaved changes")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Save changes"));
    expect(mockSave).toHaveBeenCalled();
  });

  it("no longer renders a settings navigation button", () => {
    render(<ProfileView />);
    expect(screen.queryByLabelText("Settings")).not.toBeInTheDocument();
  });
});
