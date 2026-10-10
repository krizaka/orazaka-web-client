import Image from "next/image";
import { cn } from "@krizaka/ui/cn";

/** The captures of the real product shipped in public/media/home (see public/media/CREDITS.md). */
export const CAPTURES = ["dashboard", "studios", "packs"] as const;
export type Capture = (typeof CAPTURES)[number];

/**
 * A screenshot of the real Orazaka workspace, in the theme of the page: both captures are in the markup and
 * landing.css shows the one of the current theme (dark on :root, html.light) — the other is `display: none`, out of
 * the accessibility tree too. Decorative unless `alt` is given; `eager` for a capture above the fold.
 */
export function ProductCapture({
  name,
  alt = "",
  className,
  eager = false,
}: Readonly<{ name: Capture; alt?: string; className?: string; eager?: boolean }>) {
  return (
    <>
      {(["dark", "light"] as const).map((theme) => (
        <Image
          key={theme}
          src={`/media/home/${name}-${theme}.webp`}
          alt={alt}
          width={960}
          height={600}
          unoptimized
          loading={eager ? "eager" : "lazy"}
          className={cn(theme === "dark" ? "landing-capture-dark" : "landing-capture-light", className)}
        />
      ))}
    </>
  );
}
