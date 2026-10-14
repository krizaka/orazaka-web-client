import { render } from "@testing-library/react";
import { MEDIA_CDN_URL } from "@/core/media/cdn";
import { ProductCapture } from "@/features/landing/components/ProductCapture";

describe("ProductCapture", () => {
  it("serves 1x and 2x WebP from the CDN with its size reserved, in both themes", () => {
    const { container } = render(<ProductCapture name="studios" />);
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(2);
    imgs.forEach((img) => {
      expect(img.src.startsWith(`${MEDIA_CDN_URL}/site/products/orazaka/home/studios-`)).toBe(true);
      expect(img.getAttribute("srcset")).toMatch(/-1200\.[0-9a-f]{10}\.webp 1200w, .*-2400\.[0-9a-f]{10}\.webp 2400w/);
      expect(img.getAttribute("width")).toBe("2400");
      expect(img.getAttribute("height")).toBe("1500");
      expect(img.src).not.toContain("/media/home/");
    });
  });

  it("is eager with a high priority above the fold, lazy elsewhere", () => {
    const hero = render(<ProductCapture name="studios" eager />).container.querySelectorAll("img");
    hero.forEach((img) => {
      expect(img.getAttribute("loading")).toBe("eager");
      expect(img.getAttribute("fetchpriority")).toBe("high");
    });
    const below = render(<ProductCapture name="studios" />).container.querySelectorAll("img");
    below.forEach((img) => expect(img.getAttribute("loading")).toBe("lazy"));
  });

  it("is not fetched under hiddenBelow", () => {
    const { container } = render(<ProductCapture name="studios" eager hiddenBelow={1024} />);
    container.querySelectorAll("picture").forEach((p) => expect(p.querySelector("source")?.getAttribute("media")).toBe("(max-width: 1023px)"));
  });
});
