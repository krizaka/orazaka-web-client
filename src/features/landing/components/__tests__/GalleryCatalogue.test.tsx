import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { GALLERY } from "@/features/landing/utils/gallery";
import { CLIPS } from "@/features/landing/utils/gallery-clips";

let mockLocale: Locale = "en";
jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({ t: translations[mockLocale], locale: mockLocale, setLocale: jest.fn() }),
}));

beforeAll(() => {
  // Reduced motion: the whole prompt shows at once (no typing).
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false }),
  });
});

const wrap = (ui: React.ReactNode, locale: Locale = "en") => {
  mockLocale = locale;
  return render(
    <AuthFlagsProvider flags={{ login: false, signup: false, github: false, google: false }}>
      <ThemeProvider>{ui}</ThemeProvider>
    </AuthFlagsProvider>,
  );
};

describe("GalleryPage — the whole Made here catalogue", () => {
  it("is the whole catalogue: a Videos section with every published clip (the kit's VideoResult), a Videos · Images filter", () => {
    const { container } = wrap(<GalleryPage />);
    const g = translations.en.gallery;
    const videos = document.getElementById("videos") as HTMLElement;
    expect(within(videos).getByRole("heading", { level: 2, name: g.videosTitle })).toBeInTheDocument();
    expect(within(videos).getAllByRole("article", { name: /.+/ }).filter((node) => node.hasAttribute("data-orientation") === false)).toHaveLength(CLIPS.length);
    expect(videos.querySelectorAll("video").length).toBe(CLIPS.length);
    for (const clip of CLIPS) {
      expect(within(videos).getAllByText(clip.prompt).length).toBeGreaterThan(0);
      expect(within(videos).getAllByText(clip.runId).length).toBeGreaterThan(0);
    }
    expect(within(videos).getAllByText(/Wan 2\.2 A14B/).length).toBeGreaterThan(0);
    // Each has its badge, and the clip that continues an image has the Video · Image switch.
    expect(container.querySelectorAll("[data-clip-badge]").length).toBe(CLIPS.length);
    expect(within(videos).getAllByRole("tab", { name: g.imageStep })).toHaveLength(CLIPS.filter((c) => c.imageId).length);
    const nav = screen.getByRole("navigation", { name: g.filterLabel });
    expect(within(nav).getByRole("link", { name: g.filterVideos })).toHaveAttribute("href", "/gallery?kind=videos");
    expect(within(nav).getByRole("link", { name: g.filterImages })).toHaveAttribute("href", "/gallery?kind=images");
    expect(within(nav).getByRole("link", { name: g.filterAll })).toHaveAttribute("aria-current", "page");
  });

  it("lists one kind through the URL: only the videos, or only the images", () => {
    const g = translations.en.gallery;
    const videosOnly = wrap(<GalleryPage kind="videos" />);
    expect(document.getElementById("videos")).not.toBeNull();
    expect(videosOnly.container.querySelectorAll("figure img").length).toBe(0);
    expect(within(screen.getByRole("navigation", { name: g.filterLabel })).getByRole("link", { name: g.filterVideos })).toHaveAttribute("aria-current", "page");
    videosOnly.unmount();
    const imagesOnly = wrap(<GalleryPage kind="images" />);
    expect(document.getElementById("videos")).toBeNull();
    expect(imagesOnly.container.querySelectorAll("figure img").length).toBe(GALLERY.length);
  });

  it("shows the videos in French, with the captions and the run's words translated", () => {
    wrap(<GalleryPage />, "fr");
    const fr = translations.fr.gallery;
    const videos = document.getElementById("videos") as HTMLElement;
    expect(within(videos).getByRole("heading", { level: 2, name: fr.videosTitle })).toBeInTheDocument();
    expect(within(videos).getAllByText(fr.runHeading).length).toBe(CLIPS.length);
    expect(videos.querySelector("video")).toHaveAttribute("aria-label", fr.clips[CLIPS[0].id]);
  });
});
