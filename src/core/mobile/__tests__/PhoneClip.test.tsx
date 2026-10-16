import { render, screen } from "@testing-library/react";
import { PhoneClip } from "@/core/mobile/PhoneClip";

describe("PhoneClip", () => {
  it("is a recording of the real app in dark and in light, played only on demand — never a drawn screen", () => {
    const { container } = render(<PhoneClip id="ask" label="Ask" alt="A request is typed and the answer streams in." />);
    const videos = Array.from(container.querySelectorAll("video"));
    expect(videos.map((v) => v.getAttribute("data-appearance")).sort()).toEqual(["dark", "light"]);
    for (const video of videos) {
      expect(video.getAttribute("preload")).toBe("none");
      expect(video.hasAttribute("autoplay")).toBe(false);
      expect(video.getAttribute("poster")).toMatch(/^https:\/\/.*clip-ask-(dark|light)-poster\.[0-9a-f]{10}\.webp$/);
      expect(Array.from(video.querySelectorAll("source")).map((s) => s.getAttribute("type"))).toEqual(["video/webm", "video/mp4"]);
    }
    // The light recording is hidden under the dark page and shown under html.light.
    expect(container.querySelector('video[data-appearance="light"]')?.className).toContain("[html.light_&]:block");
    expect(container.querySelector('video[data-appearance="dark"]')?.className).toContain("[html.light_&]:hidden");
    expect(screen.getAllByLabelText(/Ask\. A request is typed/)).toHaveLength(2);
  });

  it("is only video: no image of a screen and no scripted markup stands in for the app", () => {
    const { container } = render(<PhoneClip id="jobs" label="Jobs" alt="Charts and a list." />);
    expect(container.querySelectorAll("img, canvas, svg")).toHaveLength(0);
  });
});
