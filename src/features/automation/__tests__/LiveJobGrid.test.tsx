import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import LiveJobGrid from "@/features/automation/components/LiveJobGrid";
import { translations } from "@/core/context/translations";

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: jest.requireActual("@/core/context/translations").translations.en, locale: "en" }),
}));

const t = translations.en.automation;

describe("LiveJobGrid", () => {
  beforeAll(() => {
    // jsdom lays nothing out and has no observers: the kit's figures read them.
    window.matchMedia = ((query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia;
    class Observer {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.assign(window, { IntersectionObserver: Observer, ResizeObserver: Observer });
  });

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it("shows the jobs with their translated status", () => {
    render(<LiveJobGrid />);
    expect(screen.getByRole("heading", { name: t.jobsTitle })).toBeInTheDocument();
    expect(screen.getAllByText(t.jobStatus.PENDING_APPROVAL)).toHaveLength(2);
    expect(screen.getByText(t.jobStatus.COMPLETED).closest("[data-tone]")).toHaveAttribute("data-tone", "success");
  });

  it("counts the pending and running jobs with the kit's KpiStat, and follows an approval", async () => {
    render(<LiveJobGrid />);
    const pending = screen.getByText(t.pending).closest("[data-kz-stat]") ?? screen.getByText(t.pending).parentElement!;
    expect(pending).toHaveTextContent("2");
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { name: new RegExp(t.approve) })[0]);
    });
    expect(screen.getByText(t.pending).closest("[data-kz-stat]") ?? screen.getByText(t.pending).parentElement!).toHaveTextContent("1");
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
