"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Types a line of text out once when it scrolls into view, leaving a steady
 * blinking caret at the end. For a hero description / tagline — NOT the name.
 * Full text shown instantly (with a static caret) under reduced motion.
 */
export function TypedTagline({
  text,
  className,
  speed = 26,
  startDelay = 250,
}: {
  text: string;
  className?: string;
  /** ms per character */
  speed?: number;
  /** ms before typing begins */
  startDelay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setN(text.length);
      setDone(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    let interval = 0;
    let startTimer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          io.disconnect();
          startTimer = window.setTimeout(() => {
            let i = 0;
            interval = window.setInterval(() => {
              i += 1;
              setN(i);
              if (i >= text.length) {
                window.clearInterval(interval);
                setDone(true);
              }
            }, speed);
          }, startDelay);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, [reduced, text, speed, startDelay]);

  return (
    <p className={cn("relative", className)} ref={ref}>
      <span aria-hidden={!done}>{text.slice(0, n)}</span>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={cn(
          "ml-0.5 inline-block w-[0.55ch] translate-y-[0.08em] bg-accent align-baseline",
          done ? "cursor-blink" : ""
        )}
        style={{ height: "1.05em" }}
      />
    </p>
  );
}
