import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { previewIsland, ThemePreviewCard } from "@/features/profile/components/ThemePreviewCard";

const defaultProps = {
  value: "dark" as const,
  label: "Dark Mode",
  desc: "Easy on the eyes",
  icon: <span data-testid="icon">🌙</span>,
  isActive: false,
  onClick: jest.fn(),
  clickToApplyLabel: "Click to apply",
};

describe("ThemePreviewCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders label and description", () => {
    render(<ThemePreviewCard {...defaultProps} />);
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
    expect(screen.getByText("Easy on the eyes")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    render(<ThemePreviewCard {...defaultProps} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("calls onClick when clicked (not active)", () => {
    const onClick = jest.fn();
    render(<ThemePreviewCard {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onClick when already active", () => {
    const onClick = jest.fn();
    render(
      <ThemePreviewCard {...defaultProps} isActive={true} onClick={onClick} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows checkmark when active", () => {
    const { container } = render(
      <ThemePreviewCard {...defaultProps} isActive={true} />,
    );
    const mark = container.querySelector("mark");
    expect(mark).toBeInTheDocument();
  });

  it("does not show checkmark when not active", () => {
    const { container } = render(
      <ThemePreviewCard {...defaultProps} isActive={false} />,
    );
    const mark = container.querySelector("mark");
    expect(mark).not.toBeInTheDocument();
  });

  it("shows hover overlay when not active", () => {
    render(<ThemePreviewCard {...defaultProps} isActive={false} />);
    expect(screen.getByText("Click to apply")).toBeInTheDocument();
  });

  it("does not show hover overlay when active", () => {
    render(<ThemePreviewCard {...defaultProps} isActive={true} />);
    expect(screen.queryByText("Click to apply")).not.toBeInTheDocument();
  });

  it("applies active class when isActive", () => {
    render(<ThemePreviewCard {...defaultProps} isActive={true} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("theme-card-active");
  });

  it("draws a theme inside its island, so the preview reads that theme's tokens", () => {
    const { container, rerender } = render(<ThemePreviewCard {...defaultProps} value="cyberpunk" />);
    expect(container.querySelector("[data-island]")).toHaveClass("theme-cyberpunk");
    rerender(<ThemePreviewCard {...defaultProps} value="dark" />);
    expect(container.querySelector("[data-island]")).toHaveClass("theme-dark");
  });

  it("draws light with the invariant tokens and system half light, half dark", () => {
    const { container, rerender } = render(<ThemePreviewCard {...defaultProps} value="light" />);
    expect(container.querySelector("[data-island]")).toBeNull();
    rerender(<ThemePreviewCard {...defaultProps} value="system" />);
    expect(container.querySelectorAll("[data-island='theme-dark']")).toHaveLength(1);
  });

  it("maps every appearance to the way its preview reads tokens", () => {
    expect(previewIsland("light")).toEqual({ kind: "light" });
    expect(previewIsland("system")).toEqual({ kind: "system" });
    expect(previewIsland("solarized")).toEqual({ kind: "island", className: "theme-solarized" });
  });

  it("exposes the selection as aria-pressed", () => {
    render(<ThemePreviewCard {...defaultProps} isActive={true} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
});
