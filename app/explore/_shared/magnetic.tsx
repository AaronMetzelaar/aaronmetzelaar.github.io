"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function usePointerFine() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/** Drifts toward the cursor within a capped radius, then springs home. */
export function Magnetic({
  children,
  className,
  strength = 14,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (reduced || !fine) {
    return <div className={cn("inline-block", className)}>{children}</div>;
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
    y.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
  };

  return (
    <motion.div
      className={cn("inline-block", className)}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onPointerMove={onMove}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.div>
  );
}
