"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

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

/**
 * A link that reads as a link before you touch it: a quiet hairline underline at
 * rest, which fills to accent on hover while the arrow glyph drifts toward the
 * cursor and snaps back — the "pull" of the page in one control. The underline
 * used to be `scale-x-0` until hover, which meant that on any touch device
 * (where hover never fires) the email address, the GitHub link, and the CV link
 * were plain text with a glyph beside them. Wraps an anchor; pass the props
 * you'd give an <a>. The drift is still under reduced motion / touch.
 */
export function PullLink({
  children,
  href,
  className,
  target,
  rel,
  arrow = "↓",
}: {
  children: ReactNode;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  arrow?: string;
}) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.35 });

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduced || !fine) {
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 5);
    y.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 5);
  };

  return (
    <a
      className={cn(
        // The visible link is ~20px tall, under the 24px WCAG 2.5.8 floor and
        // well under a 44px thumb. The ::before pad grows the hit area to 44px
        // without adding a pixel of layout, so the rhythm of the rows it sits in
        // is untouched.
        "group relative inline-flex items-center gap-2.5 text-sm tracking-tight transition-transform active:scale-[0.97]",
        "before:absolute before:inset-x-0 before:-inset-y-3 before:content-['']",
        className
      )}
      href={href}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onPointerMove={onMove}
      rel={rel}
      target={target}
    >
      <span className="relative">
        {children}
        {/* rest state: a hairline in ink, always there */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-full bg-fg/30"
        />
        {/* hover/focus: accent wipes across it left to right */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-focus-visible:scale-x-100 group-hover:scale-x-100"
        />
      </span>
      <motion.span
        aria-hidden="true"
        className="text-accent"
        style={{ x: sx, y: sy }}
      >
        {arrow}
      </motion.span>
    </a>
  );
}

/**
 * A horizontal rule of dots that lean toward the cursor like iron filings — a
 * divider that carries the page's cursor-reactive dot motif. Decorative; a
 * still hairline of dots under reduced motion / touch.
 */
export function FilingsRule({
  className,
  count = 48,
}: {
  className?: string;
  count?: number;
}) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-9999);
  const dots = Array.from({ length: count }, (_, i) => i);

  if (reduced || !fine) {
    return (
      <div
        aria-hidden="true"
        className={cn("flex items-center justify-between py-4", className)}
      >
        {dots.map((i) => (
          <span className="h-1 w-1 shrink-0 rounded-full bg-fg/20" key={i} />
        ))}
      </div>
    );
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    mx.set(e.clientX - el.getBoundingClientRect().left);
  };

  return (
    <div
      aria-hidden="true"
      // `relative` so each dot's offsetParent IS this row — its offsetLeft then
      // shares the same origin as `mx` (cursor x measured from this row's left),
      // so the lean tracks the cursor instead of an ancestor-offset position.
      // `py-4` gives the row a taller cursor target than the 1px dots alone.
      className={cn(
        "relative flex items-center justify-between py-4",
        className
      )}
      onPointerLeave={() => mx.set(-9999)}
      onPointerMove={onMove}
      ref={ref}
    >
      {dots.map((i) => (
        <FilingDot key={i} mx={mx} />
      ))}
    </div>
  );
}

function FilingDot({ mx }: { mx: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [cx, setCx] = useState(-9999);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) {
        setCx(el.offsetLeft + el.offsetWidth / 2);
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

  // Calmed: dividers are the quiet "punctuation" tier of the one dot language —
  // a gentle lean toward the cursor, not a leap. The hero portrait is the bold
  // cursor-reactive moment; these stay subtle so nothing competes with it.
  const RADIUS = 110;
  const prox = useTransform(mx, (x) => {
    const d = Math.abs(x - cx);
    return d > RADIUS ? 0 : 1 - d / RADIUS;
  });
  const y = useSpring(
    useTransform(prox, (p) => p * -6),
    { stiffness: 260, damping: 18, mass: 0.3 }
  );
  const scale = useSpring(
    useTransform(prox, (p) => 1 + p * 0.9),
    { stiffness: 260, damping: 18, mass: 0.3 }
  );
  const color = useTransform(
    prox,
    (p) =>
      `color-mix(in srgb, var(--accent) ${Math.round(p * 100)}%, color-mix(in srgb, var(--fg) 20%, transparent))`
  );

  return (
    <motion.span
      className="h-1 w-1 shrink-0 rounded-full"
      ref={ref}
      style={{ y, scale, backgroundColor: color }}
    />
  );
}
