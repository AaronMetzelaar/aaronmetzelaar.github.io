"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** A thin accent progress bar pinned to the top, tracking page scroll. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
