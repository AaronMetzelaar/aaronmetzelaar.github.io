"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Fade/slide a block into view on scroll. Static when reduced-motion is on. */
export function Reveal({ children, delay = 0, y = 14, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
