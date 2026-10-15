"use client";

import { useTypedText } from "@krizaka/ui/showcase";

/**
 * A prompt typed out when its slide comes into view (the slideshow's active slide). The whole text is always in the DOM
 * for assistive technology, and an invisible copy of it holds the final height of the block — what is typed is drawn
 * over that copy, so nothing below it ever moves while it types (CLS 0). `useTypedText` shows the whole text at once
 * under reduced motion and for a slide out of view; its timer lives only while it types.
 */
export function TypedPrompt({ text, active }: Readonly<{ text: string; active: boolean }>) {
  const typed = useTypedText(text, { active, speed: 60 });
  return (
    <blockquote lang="en" data-typed-prompt className="relative text-sm leading-relaxed text-fg-secondary sm:text-[15px]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-typed-reserve className="invisible block">{text}</span>
      <span aria-hidden="true" data-typed-visible className="absolute inset-0 block">
        {typed.text}
        {!typed.done && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-fg-accent" />}
      </span>
    </blockquote>
  );
}
