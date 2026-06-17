"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Cursor } from "./cursor";

type TypewriterProps = {
  text: string;
  className?: string;
  speedMs?: number;
  startDelayMs?: number;
  cursor?: boolean;
};

/** Types text out character by character. Shows full text when reduced-motion. */
export function Typewriter({
  text,
  className,
  speedMs = 38,
  startDelayMs = 0,
  cursor = true,
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }

    setCount(0);
    let i = 0;
    let tick: ReturnType<typeof setTimeout>;

    const advance = () => {
      i += 1;
      setCount(i);
      if (i < text.length) {
        tick = setTimeout(advance, speedMs);
      }
    };

    const starter = setTimeout(advance, startDelayMs);

    return () => {
      clearTimeout(starter);
      clearTimeout(tick);
    };
  }, [text, speedMs, startDelayMs, reduced]);

  return (
    <span aria-label={text} className={className}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {cursor ? <Cursor /> : null}
    </span>
  );
}
