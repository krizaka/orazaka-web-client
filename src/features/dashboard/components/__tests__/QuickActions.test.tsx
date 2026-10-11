import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatIcon, StudioIcon } from "@krizaka/icons";
import { QuickActions } from "@/features/dashboard/components/QuickActions";

describe("QuickActions", () => {
  const open = jest.fn();
  const studios = jest.fn();
  const actions = [
    { icon: ChatIcon, label: "Start New Chat", desc: "Begin a new AI conversation", onClick: open },
    { icon: StudioIcon, label: "Open a Studio", desc: "Ready-made workflows", onClick: studios },
  ];

  afterEach(() => jest.clearAllMocks());

  it("renders the heading, each action and its description", () => {
    render(<QuickActions title="Quick Actions" actions={actions} />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Start New Chat")).toBeInTheDocument();
    expect(screen.getByText("Ready-made workflows")).toBeInTheDocument();
  });

  it("each action is a button that runs its handler", () => {
    render(<QuickActions title="Quick Actions" actions={actions} />);
    fireEvent.click(screen.getByRole("button", { name: /Open a Studio/ }));
    expect(studios).toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });
});
