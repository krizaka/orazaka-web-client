import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { CopyableField } from "@/features/profile/components/ProfileViewParts";

jest.mock("@krizaka/orazaka-design-system", () => ({
  Icon: ({ name }: { readonly name: string }) => (
    <span data-testid="mock-icon">{name}</span>
  ),
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

describe("CopyableField", () => {
  it("renders label and value", () => {
    render(<CopyableField label="User ID" value="abc-123" icon="hash" />);
    expect(screen.getByText("User ID")).toBeInTheDocument();
    expect(screen.getByText("abc-123")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(<CopyableField label="Email" value="a@b.com" icon="hash" />);
    expect(screen.getAllByTestId("mock-icon").length).toBeGreaterThan(0);
  });

  it("copies value on click", async () => {
    render(<CopyableField label="Token" value="secret-token" icon="hash" />);
    fireEvent.click(screen.getByLabelText("Copy"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("secret-token");
  });

  it("applies mono styling when isMono is true", () => {
    render(<CopyableField label="API Key" value="key-123" icon="hash" isMono />);
    const valueEl = screen.getByText("key-123");
    expect(valueEl.className).toContain("font-mono");
  });
});
