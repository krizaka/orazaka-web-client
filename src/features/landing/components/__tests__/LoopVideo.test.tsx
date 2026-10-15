import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { LoopVideo } from "@/features/landing/components/LoopVideo";

const sources = { mp4: "https://cdn.test/a.mp4", webm: "https://cdn.test/a.webm", poster: "https://cdn.test/a.webp" };
const labels = { badge: "Video · 5 s", play: "Play", pause: "Pause", mute: "Mute", unmute: "Sound on", enlarge: "Open larger", close: "Close" };
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
  it("is muted, looping, inline, lazy, webm first then mp4, with its poster and its final aspect ratio from the first paint", () => {
    setup(false);
    const { container } = render(<LoopVideo sources={sources} title="Tea pour" labels={labels} />);
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", sources.poster);
    expect(video).toHaveAttribute("aria-label", "Tea pour");
    expect(video.className).toContain("aspect-[26/15]");
    expect(Array.from(video.querySelectorAll("source")).map((s: Element) => `${s.getAttribute("type")} ${s.getAttribute("src")}`)).toEqual([
      `video/webm ${sources.webm}`,
      `video/mp4 ${sources.mp4}`,
    ]);
  });

  it("says it is a video: a badge with its length", () => {
    setup(false);
    const { container } = render(<LoopVideo sources={sources} title="x" labels={labels} />);
    expect(container.querySelector("[data-video-badge]")).toHaveTextContent("Video · 5 s");
  });

  it("plays when it comes into view and pauses when it leaves", () => {
    const { play, pause } = setup(false);
    render(<LoopVideo sources={sources} title="x" labels={labels} />);
    act(() => observed!([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalledTimes(1);
    act(() => observed!([{ isIntersecting: false }]));
    expect(pause).toHaveBeenCalled();
  });

  it("has play/pause and sound buttons, and a pause by hand is not undone by scrolling back", () => {
    const { play } = setup(false);
    const { container } = render(<LoopVideo sources={sources} title="x" labels={labels} />);
    const video = container.querySelector("video")!;
    act(() => observed!([{ isIntersecting: true }]));
    // jsdom does not play: say what a browser would — the clip is running.
    Object.defineProperty(video, "paused", { configurable: true, value: false });
    fireEvent.play(video);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(play).toHaveBeenCalledTimes(1);
    Object.defineProperty(video, "paused", { configurable: true, value: true });
    fireEvent.pause(video);
    act(() => observed!([{ isIntersecting: false }]));
    act(() => observed!([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalledTimes(1); // the visitor paused it: scrolling does not restart it
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    const sound = screen.getByRole("button", { name: "Sound on" });
    expect(sound).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(sound);
    expect(video.muted).toBe(false);
    expect(screen.getByRole("button", { name: "Mute" })).toHaveAttribute("aria-pressed", "true");
  });

  it("opens larger in a dialog with the native controls when the frame is clicked, and closes", () => {
    setup(false);
    render(<LoopVideo sources={sources} title="Tea pour" labels={labels} />);
    fireEvent.click(screen.getByRole("button", { name: "Open larger" }));
    const dialog = screen.getByRole("dialog");
    const large = dialog.querySelector("video")!;
    expect(large).toHaveAttribute("controls");
    expect(large).toHaveAttribute("poster", sources.poster);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("never plays by itself under reduced motion: the poster and a play button to start it on purpose", () => {
    const { play } = setup(true);
    const { container } = render(<LoopVideo sources={sources} title="x" labels={labels} />);
    expect(observed).toBeNull();
    expect(play).not.toHaveBeenCalled();
    expect(container.querySelector("video")).toHaveAttribute("data-reduced-motion", "true");
    const buttons = screen.getAllByRole("button", { name: "Play" });
    fireEvent.click(buttons[0]);
    expect(play).toHaveBeenCalledTimes(1);
  });
});
