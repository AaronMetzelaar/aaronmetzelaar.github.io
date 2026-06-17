"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A line that rises in from behind a mask on scroll. Use one per line. */
export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={cn("block", className)}>{children}</span>;
  }

  return (
    <span className={cn("block overflow-hidden pb-[0.1em]", className)}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        transition={{ duration: 0.7, delay, ease: EASE }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        whileInView={{ y: 0 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Counts up to a target when scrolled into view. */
export function CountUp({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    if (!inView) {
      return;
    }
    let raf = 0;
    let start = 0;
    const durationMs = 1100;
    const tick = (now: number) => {
      if (start === 0) {
        start = now;
      }
      const p = Math.min((now - start) / durationMs, 1);
      setVal(Math.round(p * to));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);

  return (
    <span className={className} ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/** A hairline that draws across on scroll. */
export function LineDraw({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={cn("block h-px w-full bg-border", className)} />;
  }

  return (
    <motion.span
      className={cn("block h-px w-full origin-left bg-accent", className)}
      initial={{ scaleX: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileInView={{ scaleX: 1 }}
    />
  );
}

/** Wipes a block in via clip-path (left → right) on scroll. */
export function ClipReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      transition={{ duration: 0.9, ease: EASE }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
    >
      {children}
    </motion.div>
  );
}
