"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["Aaron", "Metzelaar"] as const;

const SPOT =
  "radial-gradient(170px 170px at var(--mx, -200px) var(--my, -200px), #000 0%, rgba(0,0,0,0.6) 38%, transparent 72%)";
const DOTS = "radial-gradient(currentColor 1.1px, transparent 1.6px)";

function NameLines() {
  return (
    <>
      <span className="block">{WORDS[0]}</span>
      <span className="block">{WORDS[1]}</span>
    </>
  );
}

function StaticName({ className }: { className?: string }) {
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

/** Tracks the pointer and publishes `--mx`/`--my` (px) for descendant masks. */
function PointerBox({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };
  return (
    <span
      aria-label="Aaron Metzelaar"
      className={cn("relative block", className)}
      onPointerLeave={reset}
      onPointerMove={onMove}
      ref={ref}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────── Spotlight ─────────────────────────── */

/** Ghost-grey name; a blue spotlight follows the cursor and lights the letters. */
export function SpotlightName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <StaticName className={className} />;
  }
  return (
    <PointerBox className={className}>
      <span aria-hidden="true" className="block text-fg/20">
        <NameLines />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block text-accent"
        style={{ WebkitMaskImage: SPOT, maskImage: SPOT }}
      >
        <NameLines />
      </span>
    </PointerBox>
  );
}

/* ─────────────────────────── Dotted reveal ─────────────────────────── */

/** Letters are rendered from dots; the cursor fills them solid blue. */
export function DottedRevealName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <StaticName className={className} />;
  }
  return (
    <PointerBox className={className}>
      <span
        aria-hidden="true"
        className="block text-accent/70"
        style={{
          backgroundImage: DOTS,
          backgroundSize: "7px 7px",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        <NameLines />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block text-accent"
        style={{ WebkitMaskImage: SPOT, maskImage: SPOT }}
      >
        <NameLines />
      </span>
    </PointerBox>
  );
}

/* ─────────────────────────── Depth ─────────────────────────── */

const SHADOW = 9;

/** An embossed extrude whose direction follows the cursor like a moving light. */
export function DepthName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const sx = useSpring(ox, { stiffness: 200, damping: 22, mass: 0.5 });
  const sy = useSpring(oy, { stiffness: 200, damping: 22, mass: 0.5 });
  const sx2 = useTransform(sx, (v) => v * 2);
  const sy2 = useTransform(sy, (v) => v * 2);
  const shadow = useMotionTemplate`${sx}px ${sy}px 0 color-mix(in srgb, var(--accent) 60%, transparent), ${sx2}px ${sy2}px 0 color-mix(in srgb, var(--accent) 28%, transparent)`;

  if (reduced) {
    return <StaticName className={className} />;
  }

  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    // Shadow falls away from the cursor (opposite the "light").
    ox.set(-px * SHADOW);
    oy.set(-py * SHADOW);
  };
  const reset = () => {
    ox.set(0);
    oy.set(0);
  };

  return (
    <motion.span
      aria-label="Aaron Metzelaar"
      className={cn("block", className)}
      onPointerLeave={reset}
      onPointerMove={onMove}
      ref={ref}
      style={{ textShadow: shadow }}
    >
      <span aria-hidden="true" className="block">
        Aaron
      </span>
      <span aria-hidden="true" className="block">
        Metzelaar
      </span>
    </motion.span>
  );
}
