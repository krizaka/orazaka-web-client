import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type { StudioDetail } from "@krizaka/orazaka-shared";
import { StudioInstallPanel } from "@/features/studio/components/StudioInstallPanel";

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({
    t: {
      studio: {
        install: "Install",
        installed: "Installed",
        included: "Included",
        configure: "Configure",
        uninstall: "Uninstall",
        upgradeNow: "Upgrade",
        upgradeAvailable: "Upgrade available",
        loadError: "Error",
      },
    },
    locale: "en",
  }),
}));

jest.mock("@krizaka/orazaka-design-system", () => ({
  Icon: () => <span />,
}));

jest.mock("@/features/studio/components/InstallDialog", () => ({
  InstallDialog: () => <div />,
}));

jest.mock("@/features/studio/components/StudioLockNotice", () => ({
  StudioLockNotice: () => <div>locked</div>,
}));

jest.mock("@/services/studio.api", () => ({ StudioApi: {} }));

function studio(kind: StudioDetail["kind"]): StudioDetail {
  return {
    studioKey: "image-generation",
    label: "Images",
    tagline: null,
    description: null,
    profession: "media",
    iconKey: "image",
    heroAssetId: null,
    pricing: "INCLUDED",
    kind,
    status: "PUBLISHED",
    latestVersion: "1.0.0",
    estimatedCredits: 5,
    inputSchema: null,
    configSchema: null,
    locked: false,
    lockedReason: "NONE",
    packKey: "media-toolkit",
  };
}

describe("StudioInstallPanel — kind (ADR-061)", () => {
  it("shows a TOOLKIT Studio as included, with no install button — there is nothing to install", () => {
    render(<StudioInstallPanel studio={studio("TOOLKIT")} installation={undefined} onChanged={jest.fn()} />);

    expect(screen.getByText("Included")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("offers Install for a VERTICAL Studio the actor has not installed", () => {
    render(<StudioInstallPanel studio={studio("VERTICAL")} installation={undefined} onChanged={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
    expect(screen.queryByText("Included")).not.toBeInTheDocument();
  });
});
