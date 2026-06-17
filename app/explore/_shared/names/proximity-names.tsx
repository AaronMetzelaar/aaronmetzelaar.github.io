"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["Aaron", "Metzelaar"] as const;
const RADIUS = 112;
const LIFT = 16;
const DRIFT = 0.34;
const STRETCH = 0.6;

/** Static, accessible fallback used under reduced motion. */
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

/** Measures an element's center relative to its positioned offsetParent. */
function useCenter() {
  const ref = useRef<HTMLSpanElement>(null);
  const [c, setC] = useState({ x: -9999, y: -9999 });
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) {
        return;
      }
      setC({
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop + el.offsetHeight / 2,
      });
    };
    measure();
    const t = setTimeout(measure, 250);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);
  return { ref, c };
}

function tint(p: MotionValue<number>) {
  return useTransform(
    p,
    (v) => `color-mix(in srgb, var(--accent) ${Math.round(v * 100)}%, var(--fg))`
  );
}

/** Shared container: tracks the pointer and renders letters via a builder. */
function NameStage({
  className,
  build,
}: {
  className?: string;
  build: (mx: MotionValue<number>, my: MotionValue<number>) => React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const reset = () => {
    mx.set(-9999);
    my.set(-9999);
  };
  return (
    <span
      aria-label="Aaron Metzelaar"
      className={cn("relative block", className)}
      onPointerLeave={reset}
      onPointerMove={onMove}
      ref={ref}
    >
      {build(mx, my)}
    </span>
  );
}

function Word({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className="block">
      {children}
    </span>
  );
}

/* ─────────────────────────── Lift ─────────────────────────── */

function LiftLetter({
  char,
  mx,
  my,
}: {
  char: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const { ref, c } = useCenter();
  const prox = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    return d > RADIUS ? 0 : 1 - d / RADIUS;
  });
  const y = useSpring(
    useTransform(prox, (p) => p * -LIFT),
    { stiffness: 280, damping: 18, mass: 0.3 }
  );
  return (
    <motion.span
      className="inline-block will-change-transform"
      ref={ref}
      style={{ y, color: tint(prox) }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

/** Letters lift and tint toward the accent as the cursor nears — the original. */
export function LiftName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <StaticName className={className} />;
  }
  return (
    <NameStage
      build={(mx, my) =>
        WORDS.map((w) => (
          <Word key={w}>
            {w.split("").map((ch, i) => (
              <LiftLetter char={ch} key={`${w}-${i}-${ch}`} mx={mx} my={my} />
            ))}
          </Word>
        ))
      }
      className={className}
    />
  );
}

/* ─────────────────────────── Magnetic ─────────────────────────── */

function MagneticLetter({
  char,
  mx,
  my,
}: {
  char: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const { ref, c } = useCenter();
  const R = RADIUS * 1.4;
  const prox = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    return d > R ? 0 : 1 - d / R;
  });
  const tx = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    const k = d > R ? 0 : 1 - d / R;
    return (x - c.x) * DRIFT * k;
  });
  const ty = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    const k = d > R ? 0 : 1 - d / R;
    return (y - c.y) * DRIFT * k;
  });
  const x = useSpring(tx, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(ty, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.span
      className="inline-block will-change-transform"
      ref={ref}
      style={{ x, y, color: tint(prox) }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

/** Letters lean toward the cursor like iron filings, then spring home. */
export function MagneticName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <StaticName className={className} />;
  }
  return (
    <NameStage
      build={(mx, my) =>
        WORDS.map((w) => (
          <Word key={w}>
            {w.split("").map((ch, i) => (
              <MagneticLetter char={ch} key={`${w}-${i}-${ch}`} mx={mx} my={my} />
            ))}
          </Word>
        ))
      }
      className={className}
    />
  );
}

/* ─────────────────────────── Stretch ─────────────────────────── */

function StretchLetter({
  char,
  mx,
  my,
}: {
  char: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const { ref, c } = useCenter();
  const prox = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    return d > RADIUS ? 0 : 1 - d / RADIUS;
  });
  const scaleX = useSpring(
    useTransform(prox, (p) => 1 + p * STRETCH),
    { stiffness: 260, damping: 20, mass: 0.3 }
  );
  return (
    <motion.span
      className="inline-block origin-center will-change-transform"
      ref={ref}
      style={{ scaleX, color: tint(prox) }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

/** Letters widen as the cursor passes — the name breathes horizontally. */
export function StretchName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <StaticName className={className} />;
  }
  return (
    <NameStage
      build={(mx, my) =>
        WORDS.map((w) => (
          <Word key={w}>
            {w.split("").map((ch, i) => (
              <StretchLetter char={ch} key={`${w}-${i}-${ch}`} mx={mx} my={my} />
            ))}
          </Word>
        ))
      }
      className={className}
    />
  );
}

/* ─────────────────────────── Trace ─────────────────────────── */

function TraceLetter({
  char,
  mx,
}: {
  char: string;
  mx: MotionValue<number>;
}) {
  const { ref, c } = useCenter();
  const prox = useTransform(mx, (x) => {
    const d = Math.abs(x - c.x);
    return d > RADIUS ? 0 : 1 - d / RADIUS;
  });
  return (
    <motion.span className="inline-block" ref={ref} style={{ color: tint(prox) }}>
      {char === " " ? " " : char}
    </motion.span>
  );
}

/** A blue trace rides the baseline under the cursor; letters tint as it passes. */
export function TraceName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(-9999);
  const show = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 350, damping: 30 });
  const sShow = useSpring(show, { stiffness: 300, damping: 30 });
  const ref = useRef<HTMLSpanElement>(null);

  if (reduced) {
    return <StaticName className={className} />;
  }

  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    mx.set(e.clientX - el.getBoundingClientRect().left);
    show.set(1);
  };
  const reset = () => {
    mx.set(-9999);
    show.set(0);
  };

  return (
    <span
      aria-label="Aaron Metzelaar"
      className={cn("relative block", className)}
      onPointerLeave={reset}
      onPointerMove={onMove}
      ref={ref}
    >
      {WORDS.map((w) => (
        <Word key={w}>
          {w.split("").map((ch, i) => (
            <TraceLetter char={ch} key={`${w}-${i}-${ch}`} mx={mx} />
          ))}
        </Word>
      ))}
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[3px] w-16 rounded-full bg-accent"
        style={{ x: useTransform(sx, (v) => v - 32), opacity: sShow }}
      />
    </span>
  );
}
