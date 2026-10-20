import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Installation, StudioDetail } from "@krizaka/orazaka-shared";
import { StudioRunPanel } from "@/features/studio/components/StudioRunPanel";
import { StudioApi } from "@/services/studio.api";

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: { studio: { runTitle: "Run this Studio", loadError: "Error" } }, locale: "en" }),
}));
jest.mock("@/features/studio/components/RunForm", () => ({
  RunForm: ({ onSubmit }: { onSubmit: (inputs: Record<string, unknown>) => void }) => (
    <button type="button" onClick={() => onSubmit({ prompt: "a lamp" })}>Run</button>
  ),
}));
jest.mock("@/services/studio.api", () => ({
  StudioApi: { install: jest.fn(), startRun: jest.fn(), startStudioRun: jest.fn() },
}));

const run = { id: "run-1" };
const detail = (kind: StudioDetail["kind"]): StudioDetail => ({
  studioKey: "mood-tracking", label: "Mood tracking", tagline: null, description: null, profession: "general", iconKey: "heart",
  heroAssetId: null, pricing: "FREE", kind, status: "PUBLISHED", latestVersion: "1.2.0", estimatedCredits: 2,
  inputSchema: null, configSchema: null, locked: false, lockedReason: "NONE", packKey: null,
});

describe("StudioRunPanel", () => {
  beforeEach(() => jest.clearAllMocks());

  it("installs a VERTICAL Studio on its first run, then runs it: there is no Install step", async () => {
    jest.mocked(StudioApi.install).mockResolvedValue({ id: "inst-1" } as Installation);
    jest.mocked(StudioApi.startRun).mockResolvedValue(run as never);
    render(<StudioRunPanel studio={detail("VERTICAL")} />);

    fireEvent.click(screen.getByRole("button", { name: "Run" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/studios/runs/run-1"));
    expect(StudioApi.install).toHaveBeenCalledWith("mood-tracking", {});
    expect(StudioApi.startRun).toHaveBeenCalledWith("inst-1", { prompt: "a lamp" });
  });

  it("runs an installed Studio through its installation, without installing again", async () => {
    jest.mocked(StudioApi.startRun).mockResolvedValue(run as never);
    render(<StudioRunPanel studio={detail("VERTICAL")} installation={{ id: "inst-9", status: "ACTIVE" } as Installation} />);

    fireEvent.click(screen.getByRole("button", { name: "Run" }));

    await waitFor(() => expect(StudioApi.startRun).toHaveBeenCalledWith("inst-9", { prompt: "a lamp" }));
    expect(StudioApi.install).not.toHaveBeenCalled();
  });

  it("runs a TOOLKIT Studio by its key: it never has an installation (ADR-061)", async () => {
    jest.mocked(StudioApi.startStudioRun).mockResolvedValue(run as never);
    render(<StudioRunPanel studio={detail("TOOLKIT")} />);

    fireEvent.click(screen.getByRole("button", { name: "Run" }));

    await waitFor(() => expect(StudioApi.startStudioRun).toHaveBeenCalledWith("mood-tracking", { prompt: "a lamp" }));
    expect(StudioApi.install).not.toHaveBeenCalled();
  });
});
