"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

type ScrambleTextProps = {
  text: string;
  className?: string;
  durationMs?: number;
  startDelayMs?: number;
};

/** Decrypt/scramble text into place. Renders final text when reduced-motion. */
export function ScrambleText({
  text,
  className,
  durationMs = 900,
  startDelayMs = 0,
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }

    let raf = 0;
    let start = 0;
    const total = text.length;

    const run = (now: number) => {
      if (start === 0) {
        start = now + startDelayMs;
      }
      const elapsed = now - start;
      const progress = elapsed <= 0 ? 0 : Math.min(elapsed / durationMs, 1);
      const revealed = Math.floor(progress * total);

      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") {
              return " ";
            }
            return i < revealed ? char : randomGlyph();
          })
          .join("")
      );

      if (progress < 1) {
        raf = requestAnimationFrame(run);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs, startDelayMs, reduced]);

  return (
    <span aria-label={text} className={className}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
