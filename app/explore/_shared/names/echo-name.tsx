"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function Lines() {
  return (
    <>
      <span className="block">Aaron</span>
      <span className="block">Metzelaar</span>
    </>
  );
}

/**
 * The name casts two blue echoes that sit hidden behind it at rest and spread
 * apart as the cursor moves — a dimensional, parallax-like echo (no warping).
 */
export function EchoName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const sx = useSpring(ox, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(oy, { stiffness: 180, damping: 18, mass: 0.4 });
  const e1x = useTransform(sx, (v) => v * 7);
  const e1y = useTransform(sy, (v) => v * 7);
  const e2x = useTransform(sx, (v) => v * 15);
  const e2y = useTransform(sy, (v) => v * 15);

  if (reduced) {
    return (
      <span aria-label="Aaron Metzelaar" className={cn("block", className)}>
        <span aria-hidden="true" className="block">
          Aaron
        </span>
        <span aria-hidden="true" className="block text-accent">
          Metzelaar
        </span>
      </span>
    );
  }

  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const r = el.getBoundingClientRect();
    ox.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    oy.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  };
  const reset = () => {
    ox.set(0);
    oy.set(0);
  };

  return (
    <span
      aria-label="Aaron Metzelaar"
      className={cn("relative block", className)}
      onPointerLeave={reset}
      onPointerMove={onMove}
      ref={ref}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block text-accent"
        style={{ x: e2x, y: e2y, opacity: 0.16 }}
      >
        <Lines />
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block text-accent"
        style={{ x: e1x, y: e1y, opacity: 0.38 }}
      >
        <Lines />
      </motion.span>
      <span aria-hidden="true" className="relative block">
        <Lines />
      </span>
    </span>
  );
}
