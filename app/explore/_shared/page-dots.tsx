"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const DOT = "radial-gradient(currentColor 1px, transparent 1.7px)";
const POOL =
  "radial-gradient(220px 220px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,0,0,0.4) 45%, transparent 72%)";

/**
 * A page-wide, cursor-reactive blue dot field — the hero's interaction carried
 * through the whole page, faded. A faint ambient grid is always present for
 * texture; a brighter pool of dots follows the cursor anywhere on the page.
 *
 * Render ONCE near the top of a page's <main> (it's `fixed inset-0 z-0`); keep
 * page content in a `relative z-10` wrapper and avoid opaque section
 * backgrounds so the field shows through. Tracks the viewport pointer, so it
 * works across scroll. Ambient-only under reduced motion.
 */
export function PageDots({
  className,
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${(e.clientX / window.innerWidth) * 100}%`);
      el.style.setProperty(
        "--my",
        `${(e.clientY / window.innerHeight) * 100}%`
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const cell = `${size}px ${size}px`;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0 text-accent", className)}
      ref={ref}
    >
      {/* Ambient texture — always faintly present everywhere. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: DOT, backgroundSize: cell, opacity: 0.05 }}
      />
      {/* Cursor pool — brighter dots revealed in a disc that follows the pointer. */}
      {reduced ? null : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: DOT,
            backgroundSize: cell,
            opacity: 0.45,
            WebkitMaskImage: POOL,
            maskImage: POOL,
          }}
        />
      )}
    </div>
  );
}
