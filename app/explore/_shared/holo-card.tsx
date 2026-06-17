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
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Fine sparkle grain (self-contained SVG turbulence) for the foil shimmer. */
const SPARKLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Iridescent sweep — blue-anchored, with cyan/violet/magenta so it reads holo. */
const FOIL =
  "linear-gradient(115deg, transparent 8%, rgba(0,224,255,0.55) 22%, rgba(27,52,255,0.6) 36%, rgba(140,90,255,0.5) 50%, rgba(255,92,196,0.45) 64%, rgba(0,224,255,0.5) 78%, transparent 92%)";

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

/**
 * A glossy "holographic foil" surface — like a trading card catching light.
 * As the cursor moves, a bright glare and an iridescent sheen track the
 * pointer and shift hue, the card lifts, and a whisper of tilt sells the
 * depth (no warping). Mouse-only; a plain hover-lift under touch / reduced
 * motion. Put card content in a `relative z-20` wrapper so it stays above the
 * effect layers.
 */
export function HoloCard({
  children,
  className,
  tone = "iridescent",
}: {
  children: ReactNode;
  className?: string;
  /** "iridescent" = full holo sweep; "blue" = restrained accent-only sheen. */
  tone?: "iridescent" | "blue";
}) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();

  // Pointer position (percent) → springs for buttery, lagging light.
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.4 });

  // Whisper of tilt — enough to catch light, not enough to warp.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22, mass: 0.5 });

  // 0 at rest → 1 while hovered; drives every light layer's opacity + lift.
  const glow = useMotionValue(0);
  const sglow = useSpring(glow, { stiffness: 260, damping: 30 });
  const lift = useSpring(useMotionValue(0), { stiffness: 260, damping: 26 });
  const scale = useSpring(useMotionValue(1), { stiffness: 260, damping: 26 });

  const sparkleOpacity = useTransform(sglow, (v) => v * 0.22);
  const poolOpacity = useTransform(sglow, (v) => v * 0.5);
  const foilOpacity = useTransform(sglow, (v) => (tone === "blue" ? 0 : v));

  const glare = useMotionTemplate`radial-gradient(circle at ${smx}% ${smy}%, rgba(255,255,255,0.9), rgba(255,255,255,0) 45%)`;
  const foilPos = useMotionTemplate`${smx}% ${smy}%`;
  const foilMask = useMotionTemplate`radial-gradient(220px circle at ${smx}% ${smy}%, #000 0%, rgba(0,0,0,0.35) 45%, transparent 72%)`;
  const pool = useMotionTemplate`radial-gradient(200px circle at ${smx}% ${smy}%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%)`;

  if (reduced || !fine) {
    return (
      <div
        className={cn(
          "relative overflow-hidden border border-border bg-white transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40",
          className
        )}
      >
        {children}
      </div>
    );
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * 8);
    rx.set((0.5 - py) * 8);
  };

  const enter = () => {
    glow.set(1);
    lift.set(-10);
    scale.set(1.025);
  };

  const reset = () => {
    glow.set(0);
    lift.set(0);
    scale.set(1);
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden border border-border bg-white [transform-style:preserve-3d]",
        className
      )}
      onPointerEnter={enter}
      onPointerLeave={reset}
      onPointerMove={onMove}
      style={{
        rotateX: srx,
        rotateY: sry,
        y: lift,
        scale,
        transformPerspective: 1200,
      }}
    >
      {/* Iridescent foil — a hue-shifting sheen pooled under the cursor. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
        style={{
          opacity: foilOpacity,
          backgroundImage: FOIL,
          backgroundSize: "260% 260%",
          backgroundPosition: foilPos,
          WebkitMaskImage: foilMask,
          maskImage: foilMask,
        }}
      />
      {/* Sparkle grain, localised to the cursor — the "foil" texture. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 mix-blend-color-dodge"
        style={{
          opacity: sparkleOpacity,
          backgroundImage: SPARKLE,
          WebkitMaskImage: foilMask,
          maskImage: foilMask,
        }}
      />
      {/* Accent pool — keeps the effect on-brand even in "blue" tone. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ opacity: poolOpacity, background: pool }}
      />
      {/* Wet-gloss glare — the bright highlight that tracks the pointer. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
        style={{ opacity: sglow, background: glare }}
      />
      {/* Edge ring that brightens on hover. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          opacity: sglow,
          boxShadow:
            "inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent)",
        }}
      />
      <div className="relative z-30 h-full">{children}</div>
    </motion.div>
  );
}
