"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

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
 * Selected Work as an interactive index. On a fine pointer, hovering a project
 * pulls focus — the others blur and recede — while its visual reveals and
 * tracks the cursor with a lagging parallax. On touch / reduced motion it falls
 * back to a clean stacked list with each visual inline. The list text is always
 * present, so nothing is gated behind hover.
 */
export function WorkIndex({ items }: { items: WorkItem[] }) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  const interactive = mounted && fine && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 120, damping: 18, mass: 0.5 });

  const onMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <div className="relative">
      <ul
        className="border-border border-t"
        onPointerLeave={interactive ? () => setActive(null) : undefined}
        onPointerMove={interactive ? onMove : undefined}
      >
        {items.map((item, i) => {
          const dim = interactive && active !== null && active !== i;
          const on = interactive && active === i;
          return (
            <li
              className="border-border border-b transition-[filter,opacity] duration-300"
              key={item.slug}
              onPointerEnter={interactive ? () => setActive(i) : undefined}
              style={
                interactive
                  ? { filter: dim ? "blur(4px)" : "none", opacity: dim ? 0.4 : 1 }
                  : undefined
              }
            >
              <div className="flex flex-col gap-4 py-9 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10 lg:py-11">
                <div className="flex items-baseline gap-5 sm:gap-7">
                  <span
                    className={cn(
                      "text-xs tabular-nums tracking-[0.3em] transition-colors",
                      on ? "text-accent" : "text-muted-fg"
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  <div>
                    <h3
                      className={cn(
                        "font-medium text-[clamp(1.85rem,4.6vw,3.1rem)] leading-[0.98] tracking-[-0.03em] transition-colors",
                        on ? "text-accent" : "text-fg"
                      )}
                    >
                      {item.title}
                    </h3>
                    {item.tagline ? (
                      <p className="mt-2.5 max-w-md text-muted-fg text-sm leading-relaxed">
                        {item.tagline}
                      </p>
                    ) : null}
                  </div>
                </div>
                <ul className="flex shrink-0 flex-wrap gap-x-3 gap-y-1 sm:justify-end">
                  {item.tags.map((t) => (
                    <li
                      className="text-[0.6rem] text-muted-fg uppercase tracking-[0.2em]"
                      key={t}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* touch / reduced motion: the visual lives inline, no hover needed */}
              {mounted && !interactive ? (
                <div className="pb-9">
                  <MediaFrame
                    aspect={16 / 9}
                    className="w-full"
                    label={item.slug}
                    minimal
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* desktop: the cursor-tracked reveal (outer tracks cursor, middle offsets
          off the cursor, inner fades/scales — separate transforms, no conflict) */}
      {interactive ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-20"
          style={{ x, y }}
        >
          <div
            className="w-[clamp(240px,24vw,340px)]"
            style={{ transform: "translate(2rem, -50%)" }}
          >
            <motion.div
              animate={{
                opacity: active === null ? 0 : 1,
                scale: active === null ? 0.96 : 1,
              }}
              initial={false}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {active === null ? null : (
                <MediaFrame
                  aspect={4 / 3}
                  className="w-full"
                  key={items[active].slug}
                  label={items[active].slug}
                  minimal
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
