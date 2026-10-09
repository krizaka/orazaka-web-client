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
    render(<WorkspaceSummary figures={{ conversations: 4, credits: 1200, studios: 2 }} labels={labels} />);
    expect(screen.getByRole("link", { name: /Conversations/ })).toHaveAttribute("href", "/chat");
    expect(screen.getByRole("link", { name: /Credits available/ })).toHaveAttribute("href", "/packs");
    expect(screen.getByRole("link", { name: /Studios installed/ })).toHaveAttribute("href", "/studios");
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText((1200).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows a dash, never a zero, while billing has not answered", () => {
    render(<WorkspaceSummary figures={{ conversations: 0, credits: null, studios: 0 }} labels={labels} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
