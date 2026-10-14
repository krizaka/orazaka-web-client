import { mediaUrl } from "@/core/media/cdn";

/** The captures of the real product, 2x WebP on the CDN (`products/orazaka/home/`, recorded in media.generated.json). */
export const CAPTURES = ["studios"] as const;
export type Capture = (typeof CAPTURES)[number];

/** Intrinsic size of the 2x file (2880×1800 scaled to 2400): the browser reserves it, so the capture never shifts the page. */
const WIDTH = 2400;
const HEIGHT = 1500;
const SMALL = 1200;
/** A transparent pixel: where `hiddenBelow` applies the browser fetches this instead of the capture. */
const PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * A screenshot of the real Orazaka workspace, in the theme of the page: both captures are in the markup and
 * landing.css shows the one of the current theme (dark on :root, html.light) — the other is `display: none`, out of
 * the accessibility tree too. 1x (1200 px) and 2x (2400 px) files in `srcSet`, `sizes` for the width it is drawn at.
 * Decorative unless `alt` is given. `eager` is for a capture above the fold (loaded at once, high priority); any
 * other is lazy. `hiddenBelow` (px): under that viewport width the capture is not drawn, so it is not downloaded.
 */
export function ProductCapture({
  name,
  alt = "",
  className,
  eager = false,
  sizes = "100vw",
  hiddenBelow,
}: Readonly<{ name: Capture; alt?: string; className?: string; eager?: boolean; sizes?: string; hiddenBelow?: number }>) {
  return (
    <>
      {(["dark", "light"] as const).map((theme) => (
        <picture key={theme} className={theme === "dark" ? "landing-capture-dark" : "landing-capture-light"}>
          {hiddenBelow && <source media={`(max-width: ${hiddenBelow - 1}px)`} srcSet={PIXEL} />}
          {/* A plain <img>: next/image cannot give a srcset to a file that is already optimised on the CDN. */}
          <img
            src={mediaUrl(`products/orazaka/home/${name}-${theme}-${WIDTH}.webp`)}
            srcSet={`${mediaUrl(`products/orazaka/home/${name}-${theme}-${SMALL}.webp`)} ${SMALL}w, ${mediaUrl(`products/orazaka/home/${name}-${theme}-${WIDTH}.webp`)} ${WIDTH}w`}
            sizes={sizes}
            alt={alt}
            width={WIDTH}
            height={HEIGHT}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            decoding={eager ? "sync" : "async"}
            className={className}
          />
        </picture>
      ))}
    </>
  );
}
