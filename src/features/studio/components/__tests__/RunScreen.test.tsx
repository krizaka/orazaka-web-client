import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RunScreen } from "@/features/studio/components/RunScreen";

jest.mock("@/core/context/LocaleContext", () => {
  const { translations } = jest.requireActual("@/core/context/translations");
  return { useTranslation: () => ({ t: translations.en, locale: "en" }) };
});
jest.mock("@/core/context/JobStreamContext", () => ({
  useJobStream: () => ({ jobs: [], jobProgress: { "job-1": 30 }, refreshJobs: jest.fn() }),
}));
jest.mock("@/components/mascot/birdFor", () => ({ birdFor: () => "owl" }));
jest.mock("@krizaka/ui/mascots", () => ({ Mascot: () => <span /> }));
jest.mock("next/link", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
jest.mock("@/features/studio/components/RunOutputs", () => ({ RunOutputs: () => null }));
jest.mock("@/services/studio.api", () => ({ StudioApi: {} }));
jest.mock("@/features/studio/hooks/useStudioDetail", () => ({ useStudioDetail: () => ({ studio: { label: "Video generation" } }) }));

const step = (stepId: string, status: string, ordinal = 0) => ({ stepId, ordinal, status, jobId: status === "RUNNING" ? "job-1" : null, error: null });
let steps: ReturnType<typeof step>[] = [];
jest.mock("@/features/studio/hooks/useStudioRun", () => ({
  useStudioRun: () => ({
    run: { id: "r1", studioKey: "video-generation", status: "RUNNING", blueprintVersion: "1.5.0", startedAt: "2026-10-15T23:29:00Z", errorMessage: null, outputs: [], steps },
    isLoading: false,
    hasError: false,
    reload: jest.fn(),
  }),
}));

describe("RunScreen — one progress bar", () => {
  it("a single-step run shows the step's live progress only, not a second empty bar", () => {
    steps = [step("video", "RUNNING")];
    render(<RunScreen runId="r1" />);
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
  });

  it("a multi-step run keeps one bar (the running step's) and says which step it is on in words", () => {
    steps = [step("image", "SUCCEEDED"), step("video", "RUNNING"), step("sound", "PENDING")];
    render(<RunScreen runId="r1" />);
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
    expect(screen.getByText("1 of 3 steps")).toBeInTheDocument();
  });
});
