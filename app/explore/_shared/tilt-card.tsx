"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A surface that tilts in 3D toward the cursor and carries a blue spotlight
 * that tracks the pointer — echoing the hero's dot field. Mouse-only; static
 * under touch / reduced motion.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 150, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18, mass: 0.4 });
  const spotlight = useMotionTemplate`radial-gradient(240px 240px at ${mx}% ${my}%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)`;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") {
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 10);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className={cn("relative [transform-style:preserve-3d]", className)}
      onPointerLeave={reset}
      onPointerMove={onMove}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: spotlight }}
      />
      {children}
    </motion.div>
  );
}
