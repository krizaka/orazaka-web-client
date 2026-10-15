import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { LoopVideo } from "@/features/landing/components/LoopVideo";

const sources = { mp4: "https://cdn.test/a.mp4", webm: "https://cdn.test/a.webm", poster: "https://cdn.test/a.webp" };
let observed: ((entries: { isIntersecting: boolean }[]) => void) | null = null;

function setup(reduce: boolean) {
  observed = null;
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({ matches: reduce && query.includes("reduce"), media: query, addEventListener: () => {}, removeEventListener: () => {} }),
  });
  class IO {
    constructor(cb: (entries: { isIntersecting: boolean }[]) => void) { observed = cb; }
    observe() {}
    disconnect() {}
  }
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
  const play = jest.fn().mockResolvedValue(undefined);
  const pause = jest.fn();
  Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: play });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, value: pause });
  return { play, pause };
}

describe("LoopVideo", () => {
  it("is muted, looping, inline, lazy, with its poster and its final aspect ratio from the first paint", () => {
    setup(false);
    const { container } = render(<LoopVideo sources={sources} label="Tea pour" width={832} height={480} />);
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", sources.poster);
    expect(video).toHaveAttribute("aria-label", "Tea pour");
    expect(video.className).toContain("aspect-[26/15]");
    expect(Array.from(video.querySelectorAll("source")).map((s) => s.getAttribute("type"))).toEqual(["video/webm", "video/mp4"]);
  });

  it("plays when it comes into view and pauses when it leaves", () => {
    const { play, pause } = setup(false);
    render(<LoopVideo sources={sources} label="x" width={832} height={480} />);
    act(() => observed!([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalledTimes(1);
    act(() => observed!([{ isIntersecting: false }]));
    expect(pause).toHaveBeenCalled();
  });

  it("never plays by itself under reduced motion: the poster, and controls to play it on purpose", () => {
    const { play } = setup(true);
    const { container } = render(<LoopVideo sources={sources} label="x" width={832} height={480} />);
    expect(observed).toBeNull();
    expect(play).not.toHaveBeenCalled();
    expect(container.querySelector("video")).toHaveAttribute("controls");
    expect(container.querySelector("video")).toHaveAttribute("data-reduced-motion", "true");
  });
});
