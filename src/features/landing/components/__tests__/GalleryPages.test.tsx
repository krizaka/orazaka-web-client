import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { GalleryFeatured } from "@/features/landing/components/GalleryFeatured";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { GALLERY, reproduceParts } from "@/features/landing/utils/gallery";
import { CLIPS, FEATURED, clipReproduceParts } from "@/features/landing/utils/gallery-clips";

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

describe("GalleryFeatured (the home page's prompt → image → video, a slideshow)", () => {
  const slide = (container: HTMLElement, i: number) => container.querySelectorAll<HTMLElement>('[aria-roledescription="slide"]')[i];
  const g = translations.en.gallery;

  it("shows the video with its prompt and what the run recorded, the image it continues with its prompt, and the commands", () => {
    const { container } = wrap(<GalleryFeatured />);
    expect(container.querySelector("#made")).not.toBeNull();
    const first = FEATURED[0];
    const active = slide(container, 0);
    // The video: muted loop with its poster, its prompt, and the facts of its Orazaka run.
    const video = active.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("aria-label", g.clips[first.id]);
    expect(within(active).getAllByText(first.clip.prompt).length).toBeGreaterThan(0);
    expect(within(active).getByText(first.clip.runId)).toBeInTheDocument();
    expect(within(active).getAllByText(first.clip.seed).length).toBeGreaterThan(0);
    expect(within(active).getByText(/Wan 2\.2 A14B/)).toBeInTheDocument();
    expect(within(active).getByText(/DigitalOcean serverless inference/)).toBeInTheDocument();
    expect(within(active).getByText(/routed by Orazaka/)).toBeInTheDocument();
    // The video panel is the open one: its command is the only "Reproduce it" shown.
    expect(Array.from(active.querySelectorAll("pre code")).map((c) => c.textContent)).toEqual(clipReproduceParts(first.clip).map((part) => part.code));
    expect(active.querySelectorAll('pre code [class*="th-"]').length).toBeGreaterThan(0);
    // The image it continues is the other tab (the source image stays in view beside the video): its prompt, facts and commands.
    const image = first.image!;
    expect(within(active).getByAltText(g.items[image.id])).toBeInTheDocument();
    expect(within(active).queryByText(image.prompt)).toBeNull();
    fireEvent.mouseDown(within(active).getByRole("tab", { name: g.imageStep }), { button: 0 });
    expect(within(active).getAllByText(image.prompt).length).toBeGreaterThan(0);
    expect(within(active).getByText(image.studio)).toBeInTheDocument();
    expect(within(active).queryByText(first.clip.prompt)).toBeNull();
    // "Reproduce it" is @krizaka/ui CodeBlocks (highlighted, with their copy button): the model, the JSON inputs and the run of the image.
    expect(Array.from(active.querySelectorAll("pre code")).map((c) => c.textContent)).toEqual(reproduceParts(image).map((part) => part.code));
    fireEvent.click(screen.getByRole("button", { name: g.next }));
    expect(slide(container, 1)).toHaveAttribute("data-active");
    expect(within(slide(container, 1)).getAllByText(FEATURED[1].clip.prompt).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: g.prev }));
    fireEvent.click(screen.getByRole("button", { name: g.prev }));
    expect(slide(container, FEATURED.length - 1)).toHaveAttribute("data-active");
  });

  it("keeps an item to about one screen: the video and the image prompts are two tabs, the video first", () => {
    const { container } = wrap(<GalleryFeatured />);
    const active = slide(container, 0);
    const tabs = within(active).getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual([g.videoStep, g.imageStep]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    // One panel at a time: the open one is the video's; the image's is not in the page until its tab is chosen.
    expect(within(active).getAllByRole("tabpanel")).toHaveLength(1);
    expect(within(active).getByRole("tabpanel")).toHaveAttribute("data-state", "active");
    fireEvent.mouseDown(tabs[1], { button: 0 });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(within(active).getAllByRole("tabpanel")).toHaveLength(1);
    // The image is shown at its own aspect: no band around it.
    expect(active.querySelector("figure img")!.className).toContain("h-auto");
  });

  it("makes the media follow the tab: the chosen side is the large one, and the clip stays mounted", () => {
    const { container } = wrap(<GalleryFeatured />);
    const active = slide(container, 0);
    const root = active.querySelector<HTMLElement>("[data-tab]")!;
    const [videoFigure, imageFigure] = Array.from(root.querySelectorAll<HTMLElement>("figure"));
    const player = root.querySelector("video");
    expect(root).toHaveAttribute("data-tab", "video");
    expect(videoFigure.className).toContain("w-full");
    expect(imageFigure.className).toContain("w-2/5");
    fireEvent.mouseDown(within(active).getByRole("tab", { name: g.imageStep }), { button: 0 });
    expect(root).toHaveAttribute("data-tab", "image");
    expect(imageFigure.className).toContain("order-1");
    expect(imageFigure.className).toContain("w-full");
    expect(videoFigure.className).toContain("w-2/5");
    expect(root.querySelector("video")).toBe(player); // not remounted: it keeps playing
    fireEvent.mouseDown(within(active).getByRole("tab", { name: g.videoStep }), { button: 0 });
    expect(root).toHaveAttribute("data-tab", "video");
  });

  it("says so when a clip has no image: its prompt is its own", () => {
    const { container } = wrap(<GalleryFeatured />);
    const lone = FEATURED.findIndex((item) => !item.image);
    expect(lone).toBeGreaterThanOrEqual(0);
    expect(within(slide(container, lone)).getByText(g.noImage)).toBeInTheDocument();
  });

  it("is a named carousel with a counter and one clickable segment per item, and no pause button under reduced motion", () => {
    wrap(<GalleryFeatured />);
    expect(screen.getByRole("region", { name: g.carousel })).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByText(`Image 1 of ${FEATURED.length}`)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Go to image / })).toHaveLength(FEATURED.length);
    expect(screen.queryByRole("button", { name: g.pause })).toBeNull();
  });

  it("has a pause button and a bar that fills when motion is allowed, and speaks French", () => {
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", { writable: true, value: (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) });
    try {
      const { container } = wrap(<GalleryFeatured />, "fr");
      expect(screen.getByRole("button", { name: translations.fr.gallery.pause })).toBeInTheDocument();
      expect(container.querySelector("[data-segment-fill]")).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: translations.fr.gallery.pause }));
      expect(screen.getByRole("button", { name: translations.fr.gallery.play })).toBeInTheDocument();
      expect(screen.getByText(`Image 1 sur ${FEATURED.length}`)).toBeInTheDocument();
      expect(screen.getAllByText(translations.fr.gallery.videoPromptHeading).length).toBeGreaterThan(0);
    } finally {
      Object.defineProperty(window, "matchMedia", { writable: true, value: original });
    }
  });

  it("links to the whole gallery and copies the video prompt", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { container } = wrap(<GalleryFeatured />);
    expect(screen.getByRole("link", { name: g.all })).toHaveAttribute("href", "/gallery");
    fireEvent.click(within(slide(container, 0)).getAllByRole("button", { name: g.copy })[0]);
    expect(writeText).toHaveBeenCalledWith(FEATURED[0].clip.prompt);
    expect(await screen.findByText(g.copied)).toBeInTheDocument();
  });

  it("types the video prompt over its final size: the invisible full copy holds the height, so nothing below moves", () => {
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", { writable: true, value: (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) });
    jest.useFakeTimers();
    try {
      const { container } = wrap(<GalleryFeatured />);
      const quote = slide(container, 0).querySelector<HTMLElement>("[data-typed-prompt]")!;
      const reserve = quote.querySelector<HTMLElement>("[data-typed-reserve]")!;
      const visible = quote.querySelector<HTMLElement>("[data-typed-visible]")!;
      expect(reserve.textContent).toBe(FEATURED[0].clip.prompt);
      expect(reserve.className).toContain("invisible");
      expect(reserve).toHaveAttribute("aria-hidden", "true");
      expect(visible.className).toContain("absolute");
      expect(visible.textContent!.length).toBeLessThan(FEATURED[0].clip.prompt.length);
      act(() => { jest.advanceTimersByTime(60_000); });
      expect(visible.textContent).toContain(FEATURED[0].clip.prompt.slice(0, 40));
      expect(quote.style.minHeight).toBe("");
    } finally {
      jest.useRealTimers();
      Object.defineProperty(window, "matchMedia", { writable: true, value: original });
    }
  });

  it("types nothing under reduced motion: the whole prompt at once", () => {
    const { container } = wrap(<GalleryFeatured />);
    expect(slide(container, 0).querySelector<HTMLElement>("[data-typed-visible]")!.textContent).toBe(FEATURED[0].clip.prompt);
  });

  it("loads the image lazily and from the CDN as it is", () => {
    const { container } = wrap(<GalleryFeatured />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("src")).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/gallery\//);
    const source = container.querySelector("video source")!;
    expect(source.getAttribute("src")).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/gallery-video\/[a-z-]+\.[0-9a-f]{10}\.(webm|mp4)$/);
  });
});

describe("GalleryPage", () => {
  it("lists every image with its prompt, copy button and reproduce block, then the credits", () => {
    const { container } = wrap(<GalleryPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.gallery.galleryTitle);
    expect(container.querySelectorAll("figure img").length).toBe(GALLERY.length);
    expect(screen.getAllByRole("button", { name: translations.en.gallery.copy }).length).toBe(GALLERY.length);
    // The videos come first (one command each), then the images (the model, the inputs, the run).
    expect(container.querySelectorAll("pre code").length).toBe(CLIPS.length + GALLERY.length * 3);
    const credits = document.getElementById("credits") as HTMLElement;
    expect(within(credits).getAllByRole("listitem").length).toBe(translations.en.gallery.credits.length);
  });

  it("filters by style through the URL", () => {
    const { container } = wrap(<GalleryPage only="miniature" />);
    const n = GALLERY.filter((i) => i.style === "miniature").length;
    expect(container.querySelectorAll("figure img").length).toBe(n);
    const nav = screen.getByRole("navigation", { name: translations.en.gallery.filterLabel });
    expect(within(nav).getByRole("link", { name: translations.en.gallery.styles.miniature })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: translations.en.gallery.styles.golden })).toHaveAttribute("href", "/gallery?style=golden");
  });

  it("speaks French", () => {
    wrap(<GalleryPage />, "fr");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.fr.gallery.galleryTitle);
  });
});
