import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { WelcomeHero } from "@/features/chat-session/components/WelcomeHero";

jest.mock("@/core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { name: "Jordan Doe" } }),
}));

const t = {
  chat: {
    startConversationDesc: "Choose a topic or type anything",
    suggestionImage: "Generate an image",
    suggestionCode: "Analyze code",
    suggestionAsk: "Ask anything",
  },
} as never;

describe("WelcomeHero", () => {
  it("greets the user by first name without emoji", () => {
    const { container } = render(<WelcomeHero t={t} onPrompt={jest.fn()} />);
    expect(screen.getByText("Jordan")).toBeInTheDocument();
    // No emoji characters in the greeting block.
    expect(container.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}☀-➿]/u);
  });

  it("renders the three prompt cards", () => {
    render(<WelcomeHero t={t} onPrompt={jest.fn()} />);
    expect(screen.getByText("Generate an image")).toBeInTheDocument();
    expect(screen.getByText("Analyze code")).toBeInTheDocument();
    expect(screen.getByText("Ask anything")).toBeInTheDocument();
  });

  it("submits the prompt when a card is clicked", () => {
    const onPrompt = jest.fn();
    render(<WelcomeHero t={t} onPrompt={onPrompt} />);
    fireEvent.click(screen.getByText("Analyze code"));
    expect(onPrompt).toHaveBeenCalledWith("Analyze code");
  });
});
