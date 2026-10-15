import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations } from "@/core/context/translations";
import { LandingDemo, noteAt } from "@/features/landing/components/LandingDemo";
import { clipsFor } from "@/features/landing/utils/showcase";

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations.en, locale: "en", setLocale: jest.fn() }),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false }),
  });
});

describe("LandingDemo", () => {
  it("plays each clip in the kit's ClipPlayer — a muted loop, no native controls — with its words, its origin and what to notice", () => {
    const { container } = render(<ThemeProvider><LandingDemo /></ThemeProvider>);
    const clips = clipsFor("en");
    expect(container.querySelectorAll("[data-clip-player]")).toHaveLength(clips.length);
    for (const video of Array.from(container.querySelectorAll("video"))) {
      expect(video).not.toHaveAttribute("controls");
      expect(video.loop).toBe(true);
    }
    const first = container.querySelector<HTMLElement>("#demo-creations")!;
    expect(within(first).getByText(clips[0].origin)).toBeInTheDocument();
    expect(within(first).getByText(translations.en.landing.demo.notice)).toBeInTheDocument();
    for (const note of clips[0].notes) expect(within(first).getByText(note.text)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("A day of work on one machine");
  });

  it("lights the note of the moment: the last one that has begun", () => {
    const notes = [{ at: 0 }, { at: 4 }, { at: 9 }];
    expect(noteAt(notes, 0)).toBe(0);
    expect(noteAt(notes, 3.9)).toBe(0);
    expect(noteAt(notes, 4)).toBe(1);
    expect(noteAt(notes, 12)).toBe(2);
  });
});
