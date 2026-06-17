"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function usePointerFine() {
  return typeof window !== "undefined";
}

/**
 * A small section eyebrow with a leading dot that drifts toward the cursor and
 * springs home — the page's magnetic-pull motif, scaled down to a label. Used
 * to mark each section. Decorative motion only; the label text stays readable
 * and a still dot shows under reduced motion / touch.
 */
export function DriftEyebrow({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [fine] = useState(usePointerFine);
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const sx = useSpring(dx, { stiffness: 200, damping: 14, mass: 0.3 });
  const sy = useSpring(dy, { stiffness: 200, damping: 14, mass: 0.3 });
  const lift = useTransform([sx, sy], ([x, y]: number[]) =>
    Math.min(1, Math.hypot(x, y) / 6)
  );
  const color = useTransform(
    lift,
    (p) =>
      `color-mix(in srgb, var(--accent) ${40 + Math.round(p * 60)}%, transparent)`
  );

  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced || !fine) {
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    dx.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 6);
    dy.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 6);
  };

  const reset = () => {
    dx.set(0);
    dy.set(0);
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.32em] text-muted-fg",
        className
      )}
      onPointerLeave={reset}
      onPointerMove={onMove}
    >
      <motion.span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x: sx, y: sy, backgroundColor: reduced ? undefined : color }}
      />
      <span className="text-accent">{index}</span>
      <span>{label}</span>
    </span>
  );
}
