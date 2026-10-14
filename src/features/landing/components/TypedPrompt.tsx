"use client";

import { useTypedText } from "@krizaka/ui/showcase";

/**
 * A prompt typed out when its slide comes into view (the slideshow's active slide). The whole text is always in the DOM
 * for assistive technology; what is drawn types in (`useTypedText`: the whole text at once under reduced motion, and a
 * slide out of view shows it whole). The timer lives only while it types: no permanent loop.
 */
export function TypedPrompt({ text, active }: Readonly<{ text: string; active: boolean }>) {
  const typed = useTypedText(text, { active, speed: 60 });
  return (
    <blockquote lang="en" className="relative min-h-28 text-sm leading-relaxed text-fg-secondary sm:text-[15px]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {typed.text}
        {!typed.done && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-fg-accent" />}
      </span>
    </blockquote>
  );
}
