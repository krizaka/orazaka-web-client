import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@krizaka/ui/theme";
import { translations, type Locale } from "@/core/context/translations";
import { AuthFlagsProvider } from "@/core/context/AuthFlagsContext";
import { GalleryFeatured } from "@/features/landing/components/GalleryFeatured";
import { GalleryPage } from "@/features/landing/components/GalleryPage";
import { GALLERY, reproduceCommand } from "@/features/landing/utils/gallery";

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
    <AuthFlagsProvider flags={{ login: false, signup: false }}>
      <ThemeProvider>{ui}</ThemeProvider>
    </AuthFlagsProvider>,
  );
};

describe("GalleryFeatured (the home page's prompt to image)", () => {
  it("shows one image with its exact prompt, the facts and the command, and steps through the series", () => {
    const { container } = wrap(<GalleryFeatured />);
    expect(container.querySelector("section#made, #made")).not.toBeNull();
    const first = GALLERY[0];
    expect(screen.getAllByText(first.prompt).length).toBeGreaterThan(0);
    expect(screen.getByAltText(translations.en.gallery.items[first.id])).toBeInTheDocument();
    expect(screen.getByText(first.seed)).toBeInTheDocument();
    expect(screen.getByText(first.studio)).toBeInTheDocument();
    expect(container.querySelector("pre code")!.textContent).toBe(reproduceCommand(first));
    fireEvent.click(screen.getByRole("button", { name: translations.en.gallery.next }));
    expect(screen.getAllByText(GALLERY[1].prompt).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: translations.en.gallery.prev }));
    fireEvent.click(screen.getByRole("button", { name: translations.en.gallery.prev }));
    expect(screen.getAllByText(GALLERY[GALLERY.length - 1].prompt).length).toBeGreaterThan(0);
  });

  it("links to the whole gallery and copies the prompt", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    wrap(<GalleryFeatured />);
    expect(screen.getByRole("link", { name: translations.en.gallery.all })).toHaveAttribute("href", "/gallery");
    fireEvent.click(screen.getByRole("button", { name: translations.en.gallery.copy }));
    expect(writeText).toHaveBeenCalledWith(GALLERY[0].prompt);
    expect(await screen.findByText(translations.en.gallery.copied)).toBeInTheDocument();
  });

  it("loads images lazily and from the CDN as they are", () => {
    const { container } = wrap(<GalleryFeatured />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("src")).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/gallery\//);
  });
});

describe("GalleryPage", () => {
  it("lists every image with its prompt, copy button and reproduce block, then the credits", () => {
    const { container } = wrap(<GalleryPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translations.en.gallery.galleryTitle);
    expect(container.querySelectorAll("figure img").length).toBe(GALLERY.length);
    expect(screen.getAllByRole("button", { name: translations.en.gallery.copy }).length).toBe(GALLERY.length);
    expect(container.querySelectorAll("pre code").length).toBe(GALLERY.length);
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
