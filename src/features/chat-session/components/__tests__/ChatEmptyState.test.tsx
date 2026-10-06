import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ChatEmptyState } from "@/features/chat-session/components/ChatEmptyState";

const mockT = {} as never;

// Mock WelcomeHero to isolate ChatEmptyState composition.
jest.mock("@/features/chat-session/components/WelcomeHero", () => ({
  WelcomeHero: ({ onPrompt }: { onPrompt: (p: string) => void }) => (
    <button onClick={() => onPrompt("hello")}>WelcomeHero</button>
  ),
}));

describe("ChatEmptyState", () => {
  it("renders the WelcomeHero", () => {
    render(<ChatEmptyState t={mockT} onPrompt={jest.fn()} />);
    expect(screen.getByText("WelcomeHero")).toBeInTheDocument();
  });

  it("forwards prompt selection to onPrompt", () => {
    const onPrompt = jest.fn();
    render(<ChatEmptyState t={mockT} onPrompt={onPrompt} />);
    screen.getByText("WelcomeHero").click();
    expect(onPrompt).toHaveBeenCalledWith("hello");
  });
});
