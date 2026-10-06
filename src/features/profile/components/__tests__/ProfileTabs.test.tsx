import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileTabs, type ProfileTab } from "@/features/profile/components/ProfileTabs";

const tabs: ProfileTab[] = [
  { id: "account", label: "Account", icon: "profile" },
  { id: "appearance", label: "Appearance", icon: "sun" },
  { id: "integrations", label: "Integrations", icon: "mcp" },
];

describe("ProfileTabs", () => {
  it("marks the active tab with aria-selected", () => {
    render(<ProfileTabs tabs={tabs} active="appearance" onChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: "Appearance" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("calls onChange when a tab is clicked", () => {
    const onChange = jest.fn();
    render(<ProfileTabs tabs={tabs} active="account" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Integrations" }));
    expect(onChange).toHaveBeenCalledWith("integrations");
  });

  it("supports ArrowRight keyboard navigation with wrap-around", () => {
    const onChange = jest.fn();
    render(<ProfileTabs tabs={tabs} active="integrations" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("tab", { name: "Integrations" }), {
      key: "ArrowRight",
    });
    expect(onChange).toHaveBeenCalledWith("account");
  });
});
