"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WATER_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A section eyebrow whose leading dot sends out a concentric ripple on hover —
 * the page's water motif, scaled down to a label. The ring expands and fades
 * once per hover, like a drop hitting the surface. Decorative; a still dot
 * under reduced motion.
 */
export function RippleEyebrow({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [pinged, setPinged] = useState(0);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[0.7rem] text-muted-fg uppercase tracking-[0.32em]",
        className
      )}
      onPointerEnter={() => {
        if (!reduced) {
          setPinged((p) => p + 1);
        }
      }}
    >
      <span className="relative inline-flex h-1.5 w-1.5 items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {reduced ? null : (
          <motion.span
            animate={{ scale: [1, 3.6], opacity: [0.6, 0] }}
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-accent"
            initial={{ scale: 1, opacity: 0 }}
            key={pinged}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        )}
      </span>
      <span className="text-accent">{index}</span>
      <span>{label}</span>
    </span>
  );
}

/**
 * Gentle drift-up reveal with a soft, watery ease — the calm sibling of a hard
 * mask wipe. Use for staggered, breathing content entries. Static under
 * reduced motion.
 */
export function FloatIn({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      transition={{ duration: 0.9, delay, ease: WATER_EASE }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A hairline divider shaped as a sine wave that breathes — it slowly slides its
 * crest left to right, so the rule feels like a still surface catching a swell.
 * Draws once into view. A flat hairline under reduced motion.
 */
export function WaveRule({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <span
        aria-hidden="true"
        className={cn("block h-px w-full bg-border", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn("block w-full overflow-hidden", className)}
    >
      <motion.svg
        className="block h-4 w-full text-accent/35"
        fill="none"
        initial={{ opacity: 0 }}
        preserveAspectRatio="none"
        transition={{ duration: 1.2, ease: WATER_EASE }}
        viewBox="0 0 1200 16"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        whileInView={{ opacity: 1 }}
      >
        <motion.path
          animate={{
            d: [
              "M0 8 Q 150 1 300 8 T 600 8 T 900 8 T 1200 8",
              "M0 8 Q 150 15 300 8 T 600 8 T 900 8 T 1200 8",
              "M0 8 Q 150 1 300 8 T 600 8 T 900 8 T 1200 8",
            ],
          }}
          stroke="currentColor"
          strokeWidth={1}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </motion.svg>
    </span>
  );
}

/**
 * A single tag chip in the ripple style — a translucent hairline pill that
 * keeps the dot field visible behind it.
 */
export function Ripples({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((t) => (
        <li
          className="rounded-full border border-border/80 px-3 py-1 text-[0.65rem] text-muted-fg uppercase tracking-[0.18em]"
          key={t}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * Idle, slow vertical bob for decorative elements — a buoy on calm water.
 * Honors reduced motion by staying still.
 */
export function Bob({
  children,
  className,
  amount = 8,
  duration = 6,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{ y: [0, -amount, 0] }}
      className={className}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      {children}
    </motion.div>
  );
}
