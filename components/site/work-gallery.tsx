"use client";

import { useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { ScrambleText } from "@/components/motion/scramble-text";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

const PULL = 0.09; // how strongly each image leans toward the cursor
const MAX = 24; // px cap on that lean
const EASE = 0.12; // per-frame follow

// Scattered placement — on desktop each image is absolutely placed in a square
// "canvas" at a hand-picked spot + size so they overlap vertically as a loose
// collage (not a grid); on mobile they stack full-width in order.
const LAYOUT = [
  "sm:absolute sm:left-0 sm:top-0 sm:w-[41%]",
  "mt-16 sm:mt-0 sm:absolute sm:left-[60%] sm:top-[11%] sm:w-[31%]",
  "mt-16 sm:mt-0 sm:absolute sm:left-[10%] sm:top-[47%] sm:w-[39%]",
  "mt-16 sm:mt-0 sm:absolute sm:left-[57%] sm:top-[62%] sm:w-[35%]",
];

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
 * Selected Work as a scattered image gallery. On a fine pointer each image
 * leans toward the cursor; hovering an *image* (not its row) enlarges it and
 * brings it forward while the rest blur. Titles sit under each image in accent,
 * and the project name scramble-decodes when its image is hovered. The tagline
 * + tags reveal under the title on hover. Touch / reduced motion = a static
 * stacked list with everything shown.
 */
export function WorkGallery({ items }: { items: WorkItem[] }) {
  const reduced = !!useReducedMotion();
  const fine = usePointerFine();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [plays, setPlays] = useState(() => items.map(() => 0));

  useEffect(() => setMounted(true), []);
  const interactive = mounted && fine && !reduced;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const cur = useRef(items.map(() => ({ x: 0, y: 0 })));

  // rAF: ease each image's translate toward the cursor (off offsetLeft/Top so
  // the lean never feeds back). The lean rides on an inner element so it doesn't
  // fight the card's layout transforms.
  useEffect(() => {
    if (!interactive) {
      return;
    }
    let raf = 0;
    const tick = () => {
      for (let i = 0; i < cardRefs.current.length; i++) {
        const lean = cardRefs.current[i];
        const o = cur.current[i];
        if (!(lean && o)) {
          continue;
        }
        let tx = 0;
        let ty = 0;
        if (pointer.current) {
          const host = lean.offsetParent as HTMLElement | null;
          const cx = (host?.offsetLeft ?? 0) + lean.offsetWidth / 2;
          const cy = (host?.offsetTop ?? 0) + lean.offsetHeight / 2;
          tx = Math.max(-MAX, Math.min(MAX, (pointer.current.x - cx) * PULL));
          ty = Math.max(-MAX, Math.min(MAX, (pointer.current.y - cy) * PULL));
        }
        o.x += (tx - o.x) * EASE;
        o.y += (ty - o.y) * EASE;
        lean.style.transform = `translate(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px)`;
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
  };

  const enter = (i: number) => {
    setActive(i);
    setPlays((p) => p.map((v, idx) => (idx === i ? v + 1 : v)));
  };

  return (
    <div
      className="relative flex flex-col gap-16 sm:block sm:aspect-[5/6] sm:gap-0"
      onPointerLeave={interactive ? onLeave : undefined}
      onPointerMove={interactive ? onMove : undefined}
      ref={containerRef}
    >
      {items.map((item, i) => {
        const dim = interactive && active !== null && active !== i;
        const on = interactive && active === i;
        return (
          <figure
            className={cn(
              "w-full transition-[filter,opacity] duration-300",
              LAYOUT[i % LAYOUT.length],
              dim && "blur-[5px] opacity-45"
            )}
            key={item.slug}
            style={{ zIndex: on ? 10 : 1 }}
          >
            {/* lean wrapper — rAF writes its transform */}
            <div ref={(el) => { cardRefs.current[i] = el; }}>
              {/* the image is the only hover target for the zoom/blur — the
                  title/tags live in the figcaption, so nothing is gated here */}
              <div
                className={cn(
                  "origin-center transition-transform duration-500 ease-out",
                  on && "scale-[1.05]"
                )}
                onPointerEnter={interactive ? () => enter(i) : undefined}
                onPointerLeave={interactive ? () => setActive(null) : undefined}
              >
                <MediaFrame
                  aspect={4 / 3}
                  className="w-full"
                  label={item.slug}
                  media={item.media}
                  minimal
                />
              </div>

              {/* title UNDER the image, in accent; name scramble-decodes on hover */}
              <figcaption className="relative mt-4">
                <p className="text-[0.82rem] text-accent uppercase tracking-[0.22em]">
                  <span className="text-accent/55">({i + 1}) </span>
                  {item.title.toUpperCase()}
                </p>
                <div
                  className={cn(
                    "flex flex-col gap-2 pt-3 transition-opacity duration-300",
                    interactive
                      ? "absolute inset-x-0 top-full opacity-0"
                      : "opacity-100",
                    on && "opacity-100"
                  )}
                >
                  {item.tagline ? (
                    <p className="max-w-md text-muted-fg text-sm leading-relaxed">
                      <ScrambleText
                        durationMs={650}
                        key={plays[i]}
                        text={item.tagline}
                      />
                    </p>
                  ) : null}
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {item.tags.map((t) => (
                      <li
                        className="text-[0.6rem] text-muted-fg uppercase tracking-[0.2em]"
                        key={t}
                      >
                        <span aria-hidden="true" className="text-accent/55">
                          →{" "}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </figcaption>
            </div>
          </figure>
        );
      })}
    </div>
  );
}
