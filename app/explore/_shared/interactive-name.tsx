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

const RADIUS = 104; // px of cursor influence
const LIFT = 16; // px a letter rises at the cursor's center

/** One character that lifts + tints toward the accent as the cursor nears it. */
function Letter({
  char,
  mx,
  my,
}: {
  char: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [center, setCenter] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) {
        return;
      }
      setCenter({
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop + el.offsetHeight / 2,
      });
    };
    measure();
    // Re-measure once fonts have settled, and on resize.
    const t = setTimeout(measure, 250);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const proximity = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - center.x, y - center.y);
    return d > RADIUS ? 0 : 1 - d / RADIUS;
  });
  const y = useSpring(
    useTransform(proximity, (p) => p * -LIFT),
    { stiffness: 280, damping: 18, mass: 0.3 }
  );
  const color = useTransform(
    proximity,
    (p) =>
      `color-mix(in srgb, var(--accent) ${Math.round(p * 100)}%, var(--fg))`
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

/** "Aaron Metzelaar" as a cursor-reactive wave — premium, not scramble. */
export function InteractiveName() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  if (reduced) {
    return (
      <span aria-label="Aaron Metzelaar">
        <span aria-hidden="true" className="block">
          Aaron
        </span>
        <span aria-hidden="true" className="block text-accent">
          Metzelaar
        </span>
      </span>
    );
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
      className="relative block"
      onPointerLeave={reset}
      onPointerMove={onMove}
      ref={ref}
    >
      <span aria-hidden="true" className="block">
        {"Aaron".split("").map((ch, i) => (
          <Letter char={ch} key={`a-${i}-${ch}`} mx={mx} my={my} />
        ))}
      </span>
      <span aria-hidden="true" className="block">
        {"Metzelaar".split("").map((ch, i) => (
          <Letter char={ch} key={`m-${i}-${ch}`} mx={mx} my={my} />
        ))}
      </span>
    </span>
  );
}
