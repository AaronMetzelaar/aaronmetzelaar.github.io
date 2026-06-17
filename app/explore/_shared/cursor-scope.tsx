"use client";

import { useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Tracks the pointer and publishes its position as `--mx` / `--my` (percent)
 * on this element, inherited by any descendant backdrop layer. Pointer-events
 * stay on the content, so a pointer-events-none backdrop child can read the
 * vars without intercepting clicks. No-op under reduced motion.
 */
export function CursorScope({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: ReactPointerEvent) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div
      className={cn("relative", className)}
      onPointerMove={reduced ? undefined : onMove}
      ref={ref}
    >
      {children}
    </div>
  );
}
