import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { GALLERY } from "@/features/landing/utils/gallery";
import { CLIPS } from "@/features/landing/utils/gallery-clips";
import { COMPARE_IMAGES, COMPARE_INSPIRATIONS, COMPARE_MODELS, imagesOf } from "@/features/landing/utils/model-compare";

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

  it("compares models: one prompt per inspiration, each model's image with where it ran, its time, its cost and its run id; a missing run is said", () => {
    const { container } = wrap(<GalleryPage kind="compare" />);
    const g = translations.en.gallery;
    const compare = document.getElementById("compare") as HTMLElement;
    expect(within(compare).getByRole("heading", { level: 2, name: g.compareTitle })).toBeInTheDocument();
    expect(document.getElementById("videos")).toBeNull();
    expect(container.querySelectorAll("#compare figure img").length).toBe(COMPARE_IMAGES.length);
    for (const inspiration of COMPARE_INSPIRATIONS.filter((item) => imagesOf(item.id).length > 0)) {
      const card = document.getElementById(`compare-${inspiration.id}`) as HTMLElement;
      expect(within(card).getByText(inspiration.prompt)).toBeInTheDocument();
      for (const image of imagesOf(inspiration.id)) {
        expect(within(card).getByAltText(`${g.compareTitles[inspiration.id]}, by ${image.model.name}`)).toBeInTheDocument();
        expect(within(card).getByText(image.runId)).toBeInTheDocument();
      }
      for (const model of COMPARE_MODELS.filter((item) => !imagesOf(inspiration.id).some((image) => image.model.id === item.id))) {
        expect(within(card).getByText((content) => content.startsWith(`${model.name}: its run did not finish`))).toBeInTheDocument();
      }
    }
    // Honest labels: the local models say nothing left the Mac, the hosted one says DigitalOcean and its price.
    expect(within(compare).getByRole("link", { name: g.compareMeasured })).toHaveAttribute("href", "/docs/measured-runs");
    expect(within(compare).getAllByText(g.compareOnMac).length).toBeGreaterThan(0);
    expect(within(compare).getAllByText(g.compareOnDo).length).toBeGreaterThan(0);
    expect(within(compare).getAllByText("$0.08 an image").length).toBeGreaterThan(0);
    expect(within(compare).getAllByText(g.compareSeedIgnored).length).toBeGreaterThan(0);
    expect(within(screen.getByRole("navigation", { name: g.filterLabel })).getByRole("link", { name: g.filterCompare })).toHaveAttribute("href", "/gallery?kind=compare");
  });

  it("shows the comparison in French and between the videos and the images on the whole catalogue", () => {
    wrap(<GalleryPage />, "fr");
    const fr = translations.fr.gallery;
    const compare = document.getElementById("compare") as HTMLElement;
    expect(within(compare).getByRole("heading", { level: 2, name: fr.compareTitle })).toBeInTheDocument();
    expect(within(compare).getAllByText(fr.compareOnMac).length).toBeGreaterThan(0);
    const order = ["videos", "compare", "credits"].map((id) => document.getElementById(id)!);
    expect(order[0].compareDocumentPosition(order[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(order[1].compareDocumentPosition(order[2]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
