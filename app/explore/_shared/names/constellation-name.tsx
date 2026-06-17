"use client";

import { useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const COLS = 10;
const ROWS = 5;
const THRESHOLD = 34; // viewBox units of cursor influence

/** A lattice of dots draws lines toward the cursor — a constellation behind the name. */
export function ConstellationName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [cur, setCur] = useState<{ x: number; y: number } | null>(null);
  const raf = useRef(0);

  const dots = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        out.push({ x: ((c + 0.5) / COLS) * 100, y: ((r + 0.5) / ROWS) * 100 });
      }
    }
    return out;
  }, []);

  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * 100;
    const y = ((e.clientY - b.top) / b.height) * 100;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setCur({ x, y }));
  };
  const reset = () => {
    cancelAnimationFrame(raf.current);
    setCur(null);
  };

  return (
    <span
      aria-label="Aaron Metzelaar"
      className={cn("relative block", className)}
      onPointerLeave={reduced ? undefined : reset}
      onPointerMove={reduced ? undefined : onMove}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <title>constellation</title>
        {cur
          ? dots.map((d, i) => {
              const dist = Math.hypot(d.x - cur.x, d.y - cur.y);
              if (dist > THRESHOLD) {
                return null;
              }
              return (
                <line
                  key={`l-${i}`}
                  opacity={(1 - dist / THRESHOLD) * 0.5}
                  stroke="var(--accent)"
                  strokeWidth={0.25}
                  x1={d.x}
                  x2={cur.x}
                  y1={d.y}
                  y2={cur.y}
                />
              );
            })
          : null}
        {dots.map((d, i) => {
          const near = cur && Math.hypot(d.x - cur.x, d.y - cur.y) < THRESHOLD;
          return (
            <circle
              cx={d.x}
              cy={d.y}
              fill="var(--accent)"
              key={`d-${i}`}
              opacity={near ? 0.85 : 0.22}
              r={0.7}
            />
          );
        })}
      </svg>
      <span aria-hidden="true" className="relative block">
        <span className="block">Aaron</span>
        <span className="block">Metzelaar</span>
      </span>
    </span>
  );
}
