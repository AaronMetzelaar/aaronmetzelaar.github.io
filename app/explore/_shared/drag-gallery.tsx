"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/** Physics: a draggable track with inertia/momentum and elastic edges. */
export function DragGallery({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const t = trackRef.current;
      if (c && t) {
        setConstraint(Math.max(0, t.scrollWidth - c.offsetWidth));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (reduced) {
    return (
      <div className="overflow-x-auto" ref={containerRef}>
        <div className="flex gap-6 pb-4">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="cursor-grab overflow-hidden active:cursor-grabbing"
      ref={containerRef}
    >
      <motion.div
        className="flex gap-6"
        drag="x"
        dragConstraints={{ left: -constraint, right: 0 }}
        dragElastic={0.12}
        ref={trackRef}
      >
        {children}
      </motion.div>
    </div>
  );
}
