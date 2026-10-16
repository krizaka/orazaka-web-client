import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { GalleryFeatured } from "@/features/landing/components/GalleryFeatured";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { GALLERY } from "@/features/landing/utils/gallery";
import { COMPARE_IMAGES } from "@/features/landing/utils/model-compare";
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

  it("is a three-step strip: the prompt, the image (FLUX.2, one Mac, free), the video (Wan 2.2, cloud, price) — chips visible under each medium", () => {
    const { container } = wrap(<GalleryFeatured />);
    expect(container.querySelector("#made")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("One scene, three runs");
    const first = FEATURED[0];
    const image = first.image!;
    const active = slide(container, 0);
    const steps = within(active).getAllByRole("listitem").filter((li) => li.textContent?.match(/^\d · /));
    expect(steps.map((s) => s.textContent?.slice(0, 3))).toEqual(["1 ·", "2 ·", "3 ·"]);
    expect(within(active).queryByRole("tab")).toBeNull();
    expect(within(active).getByAltText(g.items[image.id])).toBeInTheDocument();
    const video = active.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("aria-label", g.clips[first.id]);
    // The chips sit in the step, right under the medium they describe.
    expect(steps[1]).toHaveTextContent(`FLUX.2 · on one Mac · ${String(image.seconds)} s · free`);
    // The first slides are the clips made FROM their image on a GPU worker: GPU minutes and GPU time under the video, and the strip says it is made from the image.
    expect(first.clip.fromImage).toBe(true);
    expect(steps[2]).toHaveTextContent(/Wan 2\.2 TI2V 5B · a GPU · \d+ min · \$/);
    expect(within(active).getByText(g.fromImage)).toBeInTheDocument();
    expect(within(active).queryByText(g.notFromImage)).toBeNull();
  });

  it("opens the facts and \"Reproduce it\" over the page (a popover), never inside the strip — its height cannot change", () => {
    const { container } = wrap(<GalleryFeatured />);
    const first = FEATURED[0];
    const active = slide(container, 0);
    const strip = active.querySelector("ol")!;
    const before = strip.querySelectorAll("*").length;
    expect(active.querySelector("details")).toBeNull();
    const buttons = within(active).getAllByRole("button", { name: g.details });
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]); // the video's
    const open = screen.getByRole("dialog");
    expect(strip.querySelectorAll("*").length).toBe(before); // nothing was added to the strip
    expect(open).toHaveTextContent(first.clip.runId);
    expect(open).toHaveTextContent(first.clip.seed);
    expect(open).toHaveTextContent(/Wan 2\.2 TI2V 5B/);
    expect(open).toHaveTextContent(/routed by Orazaka/);
    expect(open).toHaveTextContent(g.videoFromImage);
    expect(Array.from(open.querySelectorAll("pre code")).map((c) => c.textContent)).toEqual(clipReproduceParts(first.clip).map((part) => part.code));
    fireEvent.keyDown(open, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: g.next }));
    expect(slide(container, 1)).toHaveAttribute("data-active");
    fireEvent.click(screen.getByRole("button", { name: g.prev }));
    fireEvent.click(screen.getByRole("button", { name: g.prev }));
    expect(slide(container, FEATURED.length - 1)).toHaveAttribute("data-active");
  });

  it("a clip that is NOT made from its image says so (the tea-pour text-to-video one, by Wan 2.2 A14B, serverless)", () => {
    const { container } = wrap(<GalleryFeatured />);
    const own = FEATURED.findIndex((item) => item.image && !item.clip.fromImage);
    expect(own).toBeGreaterThanOrEqual(0);
    for (let i = 0; i < own; i++) fireEvent.click(screen.getByRole("button", { name: g.next })); // the slideshow renders the slides around the active one
    const active = slide(container, own);
    expect(within(active).getByText(g.notFromImage)).toBeInTheDocument();
    expect(within(active).queryByText(g.fromImage)).toBeNull();
  });

  it("says so when a clip has no image: its prompt is its own", () => {
    const { container } = wrap(<GalleryFeatured />);
    const lone = FEATURED.findIndex((item) => !item.image);
    expect(lone).toBeGreaterThanOrEqual(0);
    for (let i = 0; i < lone; i++) fireEvent.click(screen.getByRole("button", { name: g.next }));
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
      expect(screen.getAllByText(new RegExp(translations.fr.gallery.stepPrompt)).length).toBeGreaterThan(0);
    } finally {
      Object.defineProperty(window, "matchMedia", { writable: true, value: original });
    }
  });

  it("links to the whole gallery and copies the prompt from its popover", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { container } = wrap(<GalleryFeatured />);
    expect(screen.getByRole("link", { name: g.seeDemo })).toHaveAttribute("href", "/gallery");
    fireEvent.click(within(slide(container, 0)).getByRole("button", { name: g.more }));
    fireEvent.click(screen.getByRole("button", { name: g.copy }));
    expect(writeText).toHaveBeenCalledWith(FEATURED[0].image?.prompt ?? FEATURED[0].clip.prompt);
    expect(await screen.findByText(g.copied)).toBeInTheDocument();
  });

  it("types the video prompt over its final size: the invisible full copy holds the height, so nothing below moves", () => {
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", { writable: true, value: (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) });
    jest.useFakeTimers();
    try {
      const { container } = wrap(<GalleryFeatured />);
      fireEvent.click(within(slide(container, 0)).getAllByRole("button", { name: g.details }).at(-1)!);
      const quote = document.querySelector<HTMLElement>("[data-typed-prompt]")!;
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
    fireEvent.click(within(slide(container, 0)).getAllByRole("button", { name: g.details }).at(-1)!);
    expect(document.querySelector<HTMLElement>("[data-typed-visible]")!.textContent).toBe(FEATURED[0].clip.prompt);
  });

  it("loads the image lazily and from the CDN as it is", () => {
    const { container } = wrap(<GalleryFeatured />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("src")).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/gallery\//);
    const source = container.querySelector("video source")!;
    expect(source.getAttribute("src")).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/gallery-video\/[a-z0-9-]+\.[0-9a-f]{10}\.(webm|mp4)$/);
  });
});

describe("GalleryPage", () => {
  it("lists every image with its prompt, copy button and reproduce block, then the credits", () => {
    const { container } = wrap(<GalleryPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.gallery.galleryTitle);
    // The images of the gallery, and the comparison's (a section of its own, above them).
    expect(container.querySelectorAll("figure img").length).toBe(GALLERY.length + COMPARE_IMAGES.length);
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
