"use client";

import { useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

const PULL = 0.09; // how strongly each image leans toward the cursor
const MAX = 24; // px cap on that lean
const EASE = 0.12; // per-frame follow

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
 * Selected Work as an image gallery. On a fine pointer each project image leans
 * gently toward the cursor (a per-card magnetic pull, eased on rAF), and
 * hovering one enlarges it and brings it forward while the rest blur and dim;
 * the title + tags fade in over it. On touch / reduced motion it's a static
 * grid with the info always shown. The configurator card plays its clip.
 */
export function WorkGallery({ items }: { items: WorkItem[] }) {
  const reduced = !!useReducedMotion();
  const fine = usePointerFine();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  const interactive = mounted && fine && !reduced;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const cur = useRef(items.map(() => ({ x: 0, y: 0 })));

  // rAF: ease each card's translate toward the cursor (measured off offsetLeft/
  // Top so the transform never feeds back into the target).
  useEffect(() => {
    if (!interactive) {
      return;
    }
    let raf = 0;
    const tick = () => {
      for (let i = 0; i < cardRefs.current.length; i++) {
        const card = cardRefs.current[i];
        const o = cur.current[i];
        if (!(card && o)) {
          continue;
        }
        let tx = 0;
        let ty = 0;
        if (pointer.current) {
          const cx = card.offsetLeft + card.offsetWidth / 2;
          const cy = card.offsetTop + card.offsetHeight / 2;
          tx = Math.max(-MAX, Math.min(MAX, (pointer.current.x - cx) * PULL));
          ty = Math.max(-MAX, Math.min(MAX, (pointer.current.y - cy) * PULL));
        }
        o.x += (tx - o.x) * EASE;
        o.y += (ty - o.y) * EASE;
        card.style.transform = `translate(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [interactive]);

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const c = containerRef.current;
    if (!c) {
      return;
    }
    const r = c.getBoundingClientRect();
    pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onLeave = () => {
    pointer.current = null;
    setActive(null);
  };

  return (
    <div
      className="relative flex flex-col gap-[clamp(4rem,9vw,8.5rem)]"
      onPointerLeave={interactive ? onLeave : undefined}
      onPointerMove={interactive ? onMove : undefined}
      ref={containerRef}
    >
      {items.map((item, i) => {
        const dim = interactive && active !== null && active !== i;
        const on = interactive && active === i;
        // open, asymmetric placement — alternating sides + varied widths so it
        // breathes instead of sitting in a tight grid
        const right = i % 2 === 1;
        const width = ["sm:w-[58%]", "sm:w-[50%]", "sm:w-[54%]", "sm:w-[62%]"][
          i % 4
        ];
        return (
          <div
            className={cn(
              "group relative w-full transition-[filter,opacity] duration-300",
              width,
              right && "sm:self-end",
              dim && "blur-[5px] opacity-50"
            )}
            key={item.slug}
            onPointerEnter={interactive ? () => setActive(i) : undefined}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ willChange: "transform", zIndex: on ? 10 : 1 }}
          >
            <div
              className={cn(
                "relative origin-center transition-transform duration-500 ease-out",
                on && "scale-[1.05]"
              )}
            >
              <MediaFrame
                aspect={16 / 9}
                className="w-full"
                label={item.slug}
                media={item.media}
                minimal
              />
              <span className="absolute top-3 left-3 text-[0.7rem] text-accent tabular-nums tracking-[0.3em]">
                {pad(i + 1)}
              </span>
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-bg via-bg/85 to-transparent p-5 transition-opacity duration-300",
                  interactive ? (on ? "opacity-100" : "opacity-0") : "opacity-100"
                )}
              >
                <h3 className="font-medium text-xl tracking-[-0.02em]">
                  {item.title}
                </h3>
                {item.tagline ? (
                  <p className="max-w-md text-muted-fg text-xs leading-relaxed">
                    {item.tagline}
                  </p>
                ) : null}
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {item.tags.map((t) => (
                    <li
                      className="text-[0.6rem] text-muted-fg uppercase tracking-[0.2em]"
                      key={t}
                    >
                      <span aria-hidden="true" className="text-accent/60">
                        →{" "}
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
