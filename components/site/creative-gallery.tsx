"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { CoordinatedVideo } from "@/components/media/coordinated-video";
import { MediaFrame } from "@/components/media/media-frame";
import { ScrambleText } from "@/components/motion/scramble-text";
import { WorkList } from "@/components/site/work-list";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

// Same interaction language as the Selected Work gallery — each tile leans
// toward the cursor, hovering one enlarges it and brings it forward while the
// rest blur, and the caption reveals + scramble-decodes on hover. That lean +
// page-blur focus is a wide-desktop, fine-pointer affordance; touch / narrow /
// reduced-motion falls back to the same tappable card stack Selected Work uses.
// A gallery tile (the posters/social one) shows its extra stills as a tidy grid
// beneath the hero, never over it, so the primary image is never covered.
const PULL = 0.09;
const MAX = 22;
const EASE = 0.12;

// loose vertical stagger so the tiles read as a collage, not a grid row
const STAGGER = ["", "sm:mt-24", "sm:mt-10"];

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

// the lean + page-blur focus needs room and a real pointer; gate it to wide
// desktop so it never fires (and mispositions) on phones / narrow windows
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setWide(mq.matches);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return wide;
}

export function CreativeGallery({
  items,
  onActiveChange,
}: {
  items: WorkItem[];
  onActiveChange?: (active: boolean) => void;
}) {
  const reduced = !!useReducedMotion();
  const fine = usePointerFine();
  const wide = useWide();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [plays, setPlays] = useState(() => items.map(() => 0));

  useEffect(() => setMounted(true), []);
  const interactive = mounted && fine && wide && !reduced;

  // tell the section whether a tile is focused (so it can blur its header)
  useEffect(() => {
    onActiveChange?.(active !== null);
  }, [active, onActiveChange]);

  // lean targets: one per tile
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const cur = useRef(
    Array.from({ length: items.length }, () => ({ x: 0, y: 0 }))
  );

  // Track the cursor across the WHOLE window (viewport coords) so the tiles
  // lean toward it wherever it is — including the page margins — and never snap
  // back from leaving a tight box. rAF reads all rects, then writes all
  // transforms (no read/write thrash); base centre = rect centre minus the lean
  // we already applied, so the measurement never feeds back on itself.
  useEffect(() => {
    if (!interactive) {
      return;
    }
    const onPointer = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    let raf = 0;
    const targets: { x: number; y: number }[] = [];
    const tick = () => {
      const p = pointer.current;
      for (let i = 0; i < cardRefs.current.length; i++) {
        const lean = cardRefs.current[i];
        const o = cur.current[i];
        const t = (targets[i] ??= { x: 0, y: 0 });
        if (!(lean && o && p)) {
          t.x = 0;
          t.y = 0;
          continue;
        }
        const r = lean.getBoundingClientRect();
        const cx = r.left + r.width / 2 - o.x;
        const cy = r.top + r.height / 2 - o.y;
        t.x = Math.max(-MAX, Math.min(MAX, (p.x - cx) * PULL));
        t.y = Math.max(-MAX, Math.min(MAX, (p.y - cy) * PULL));
      }
      for (let i = 0; i < cardRefs.current.length; i++) {
        const lean = cardRefs.current[i];
        const o = cur.current[i];
        const t = targets[i];
        if (!(lean && o && t)) {
          continue;
        }
        o.x += (t.x - o.x) * EASE;
        o.y += (t.y - o.y) * EASE;
        lean.style.transform = `translate(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [interactive]);

  const enter = (i: number) => {
    setActive(i);
    setPlays((p) => p.map((v, idx) => (idx === i ? v + 1 : v)));
    // Scrolling away from a hovered tile fires no pointerleave, so the focus
    // used to latch: the page-wide blur overlay and the blurred section header
    // (which holds this section's dot divider) stayed for the rest of the visit.
    window.addEventListener("scroll", () => setActive(null), {
      once: true,
      passive: true,
    });
  };

  if (!interactive) {
    return <WorkList items={items} />;
  }

  return (
    // the lean stage is wider (to the section edges) + taller than the tiles, so
    // the cursor keeps the tiles leaning across a generous area instead of
    // snapping back the moment it leaves a tight box
    <div className="relative -mx-6 px-6 py-14 sm:-mx-10 sm:px-10 sm:py-20">
      {/* same hover-to-focus hint as Selected Work */}
      <p className="pointer-events-none absolute top-8 right-6 flex items-center gap-2 text-[0.62rem] text-accent uppercase tracking-[0.25em] sm:right-10">
        <span aria-hidden="true" className="nudge-x">
          ↔
        </span>
        Hover a tile to focus
      </p>
      {/* focus: blur the whole page behind the hovered tile (header, other
          tiles, everything) so only the focused work stays sharp */}
      {active !== null ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 bg-bg/10 backdrop-blur-[3px]"
        />
      ) : null}
      <div
        className={cn(
          "grid gap-10 sm:gap-8",
          // two tiles read as a balanced, centered pair; three fill the row
          items.length <= 2
            ? "sm:mx-auto sm:max-w-3xl sm:grid-cols-2"
            : "sm:grid-cols-3"
        )}
      >
        {items.map((item, i) => {
          const dim = active !== null && active !== i;
          const on = active === i;
          const video = item.media?.kind === "video" ? item.media : null;
          const hero = item.gallery?.[0];
          const extras = item.gallery?.slice(1) ?? [];
          return (
            <figure
              className={cn(
                "relative transition-[filter,opacity] duration-300",
                STAGGER[i % STAGGER.length],
                dim && "opacity-40 blur-[5px]"
              )}
              key={item.slug}
              style={{ zIndex: on ? 50 : 1 }}
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <div
                  className={cn(
                    "origin-center transition-transform duration-500 ease-out",
                    on && "scale-[1.04]"
                  )}
                  onPointerEnter={() => enter(i)}
                  onPointerLeave={() => setActive(null)}
                >
                  <div className="relative aspect-[4/5] w-full">
                    {video ? (
                      <div className="absolute inset-0 overflow-hidden border border-border">
                        {/* autonomous, like the Selected Work clips: plays
                            whenever it's in view, hover doesn't gate it */}
                        <CoordinatedVideo
                          alt={video.alt}
                          poster={video.poster}
                          src={video.src}
                        />
                      </div>
                    ) : hero ? (
                      <div
                        aria-label={hero.alt}
                        className="absolute inset-0 border border-border bg-bg bg-center bg-cover"
                        role="img"
                        style={{ backgroundImage: `url(${hero.src})` }}
                      />
                    ) : (
                      <MediaFrame
                        aspect={4 / 5}
                        className="absolute inset-0 h-full w-full"
                        label={item.slug}
                        minimal
                      />
                    )}
                  </div>

                  {/* the other stills: always beneath the hero, never over it,
                      revealed on hover (grid-rows 0fr -> 1fr, the standard CSS
                      trick for animating to auto height) */}
                  {extras.length > 0 ? (
                    <div
                      className={cn(
                        "grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out",
                        on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="grid grid-cols-2 gap-3 overflow-hidden pt-3">
                        {extras.map((g) => (
                          <div
                            aria-label={g.alt}
                            className="aspect-[4/5] border border-border bg-bg bg-center bg-cover"
                            key={g.src}
                            role="img"
                            style={{ backgroundImage: `url(${g.src})` }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <figcaption className="relative z-10 mt-4">
                  <p className="text-[0.82rem] text-accent uppercase tracking-[0.22em]">
                    {item.title.toUpperCase()}
                  </p>
                  <div
                    className={cn(
                      "absolute inset-x-0 top-full flex flex-col gap-2 pt-3 opacity-0 transition-opacity duration-300",
                      on && "opacity-100"
                    )}
                  >
                    <p className="max-w-md text-muted-fg text-sm leading-relaxed">
                      <ScrambleText
                        durationMs={650}
                        fade
                        key={plays[i]}
                        text={item.summary}
                      />
                    </p>
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
    </div>
  );
}
