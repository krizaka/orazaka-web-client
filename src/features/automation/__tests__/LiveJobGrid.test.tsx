import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import LiveJobGrid from "@/features/automation/components/LiveJobGrid";
import { translations } from "@/core/context/translations";

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: jest.requireActual("@/core/context/translations").translations.en, locale: "en" }),
}));

const t = translations.en.automation;

describe("LiveJobGrid", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it("shows the jobs with their translated status", () => {
    render(<LiveJobGrid />);
    expect(screen.getByRole("heading", { name: t.jobsTitle })).toBeInTheDocument();
    expect(screen.getAllByText(t.jobStatus.PENDING_APPROVAL)).toHaveLength(2);
    expect(screen.getByText(t.jobStatus.COMPLETED).closest("[data-tone]")).toHaveAttribute("data-tone", "success");
  });

  it("approves a job", async () => {
    render(<LiveJobGrid />);
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { name: new RegExp(t.approve) })[0]);
    });
    expect(screen.getAllByText(t.jobStatus.PENDING_APPROVAL)).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/v1/jobs/job-001/approve", { method: "POST" });
  });

  it("revokes a job", async () => {
    render(<LiveJobGrid />);
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { name: t.revoke })[0]);
    });
    expect(screen.queryByText("CREATE_TICKET")).toBeNull();
  });
});
