"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FULL = "Aaron Metzelaar";

/**
 * Types the name out once, then leaves a steady blinking block caret — the
 * terminal-intro feel. Full name shown instantly under reduced motion.
 */
export function TypeName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) {
      setN(FULL.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= FULL.length) {
        clearInterval(id);
      }
    }, 95);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <span aria-label={FULL} className={cn("block", className)}>
      <span aria-hidden="true">{FULL.slice(0, n)}</span>
      <span
        aria-hidden="true"
        className="cursor-blink ml-1 inline-block bg-accent align-middle"
        style={{ width: "0.5em", height: "0.82em" }}
      />
    </span>
  );
}
