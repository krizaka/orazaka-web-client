"use client";

import * as React from "react";

/**
 * A prompt typed out when it comes into view (and again for each new image). The whole text is always in the DOM for
 * assistive technology; what is drawn types in. Under reduced motion — or without IntersectionObserver — the whole
 * prompt shows at once. The timer lives only while it types: no permanent loop.
 */
export function TypedPrompt({ text, restartKey }: Readonly<{ text: string; restartKey: string }>) {
  const [shown, setShown] = React.useState(text.length);
  const box = React.useRef<HTMLQuoteElement>(null);

  React.useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined" || !box.current) {
      setShown(text.length);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    setShown(0);
    const start = () => {
      let n = 0;
      setShown(0);
      timer = setInterval(() => {
        n = Math.min(text.length, n + 6);
        setShown(n);
        if (n >= text.length && timer) clearInterval(timer);
      }, 16);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(box.current);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [text, restartKey]);

  return (
    <blockquote ref={box} lang="en" className="relative text-sm leading-relaxed text-fg-secondary sm:text-[15px]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {shown < text.length && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-fg-accent" />}
      </span>
    </blockquote>
  );
}
