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
const REACH = 280;
const AMP = 22;
const WAVELEN = 36;

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

function RippleLetter({
  char,
  mx,
  my,
}: {
  char: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [c, setC] = useState({ x: -9999, y: 0 });

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) {
        setC({
          x: el.offsetLeft + el.offsetWidth / 2,
          y: el.offsetTop + el.offsetHeight / 2,
        });
      }
    };
    measure();
    const t = setTimeout(measure, 250);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const prox = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    return d > REACH ? 0 : 1 - d / REACH;
  });
  const wave = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    const p = d > REACH ? 0 : 1 - d / REACH;
    return Math.sin((c.x - x) / WAVELEN) * AMP * p;
  });
  const y = useSpring(wave, { stiffness: 240, damping: 15, mass: 0.3 });
  const color = useTransform(
    prox,
    (p) => `color-mix(in srgb, var(--accent) ${Math.round(p * 100)}%, var(--fg))`
  );

  return (
    <motion.span
      className="inline-block will-change-transform"
      ref={ref}
      style={{ y, color }}
    >
      {char}
    </motion.span>
  );
}

/** A wave ripples through the letters, emanating from the cursor. */
export function RippleName({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  if (reduced) {
    return <StaticName className={className} />;
  }

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
      {WORDS.map((w) => (
        <span aria-hidden="true" className="block" key={w}>
          {w.split("").map((ch, i) => (
            <RippleLetter char={ch} key={`${w}-${i}-${ch}`} mx={mx} my={my} />
          ))}
        </span>
      ))}
    </span>
  );
}
