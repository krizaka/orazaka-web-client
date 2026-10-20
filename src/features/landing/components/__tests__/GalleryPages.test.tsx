import { FILMS } from "@/features/landing/utils/cinema-films";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { GALLERY } from "@/features/landing/utils/gallery";
import { COMPARE_IMAGES } from "@/features/landing/utils/model-compare";
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

describe("GalleryPage", () => {
  it("lists every image with its prompt, copy button and reproduce block, then the credits", () => {
    const { container } = wrap(<GalleryPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.gallery.galleryTitle);
    // The images of the gallery, and the comparison's (a section of its own, above them).
    expect(container.querySelectorAll("figure img").length).toBe(GALLERY.length + COMPARE_IMAGES.length);
    expect(screen.getAllByRole("button", { name: translations.en.gallery.copy }).length).toBe(GALLERY.length);
    // The videos come first (one command each), then the images (the model, the inputs, the run).
    // The cinematic shorts first (one command each), then the clips, then the images.
    expect(container.querySelectorAll("pre code").length).toBe(FILMS.length + CLIPS.length + GALLERY.length * 3);
    for (const film of FILMS) expect(screen.getAllByText(translations.en.gallery.films[film.id].title).length).toBeGreaterThan(0);
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
