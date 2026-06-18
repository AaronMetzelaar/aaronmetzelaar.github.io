"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const FADE_CHARS = 8; // chars over which a glyph fades in ahead of the front

type Char = { ch: string; op: number };
type Frame = string | Char[];

type ScrambleTextProps = {
  text: string;
  className?: string;
  durationMs?: number;
  startDelayMs?: number;
  /**
   * Fade each character in (opacity ramps just ahead of the decode front) so
   * the text appears into being rather than showing its full length from the
   * first frame. Off by default — the plain in-place decode.
   */
  fade?: boolean;
};

/** Decrypt/scramble text into place. Renders final text when reduced-motion. */
export function ScrambleText({
  text,
  className,
  durationMs = 900,
  startDelayMs = 0,
  fade = false,
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState<Frame>(text);

  useEffect(() => {
    if (reduced) {
      setFrame(text);
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
      const lead = progress * total;

      if (fade) {
        setFrame(
          text.split("").map((char, i): Char => {
            if (char === " ") {
              return { ch: " ", op: 1 };
            }
            if (i < lead) {
              return { ch: char, op: 1 };
            }
            // ahead of the front: a glyph that fades in as the front nears
            const op = Math.max(0, Math.min(1, 1 - (i - lead) / FADE_CHARS));
            return { ch: randomGlyph(), op };
          })
        );
      } else {
        const revealed = Math.floor(lead);
        setFrame(
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
      }

      if (progress < 1) {
        raf = requestAnimationFrame(run);
      } else {
        setFrame(text);
      }
    };

    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs, startDelayMs, reduced, fade]);

  return (
    <span aria-label={text} className={className}>
      <span aria-hidden="true">
        {typeof frame === "string"
          ? frame
          : frame.map((c, i) => (
              <span key={i} style={{ opacity: c.op }}>
                {c.ch}
              </span>
            ))}
      </span>
    </span>
  );
}
