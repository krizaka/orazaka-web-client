import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { WorkspaceSummary } from "@/features/dashboard/components/WorkspaceSummary";

const labels = {
  conversations: "Conversations",
  conversationsDesc: "Threads kept on your server",
  credits: "Credits available",
  creditsDesc: "Spent only when you run something",
  studiosInstalled: "Studios installed",
  studiosInstalledDesc: "Workflows ready to run",
};

describe("WorkspaceSummary", () => {
  it("shows the workspace's own figures, each linked to where it lives", () => {
    render(<WorkspaceSummary figures={{ conversations: 4, credits: 1200, studios: 2 }} locale="en-US" labels={labels} />);
    expect(screen.getByRole("link", { name: /Conversations/ })).toHaveAttribute("href", "/chat");
    expect(screen.getByRole("link", { name: /Credits available/ })).toHaveAttribute("href", "/billing");
    expect(screen.getByRole("link", { name: /Studios installed/ })).toHaveAttribute("href", "/studios");
    // Each figure is a NumberTicker: its value is read once (sr-only), its digits roll beside it (aria-hidden).
    expect(screen.getByRole("link", { name: /Conversations.*\b4\b/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Credits available.*1,200/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Studios installed.*\b2\b/ })).toBeInTheDocument();
  });

  it("shows a dash, never a zero, while billing has not answered", () => {
    render(<WorkspaceSummary figures={{ conversations: 0, credits: null, studios: 0 }} locale="en-US" labels={labels} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
