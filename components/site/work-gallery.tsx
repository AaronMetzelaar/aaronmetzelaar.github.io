"use client";

import { useReducedMotion } from "motion/react";
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
  "sm:absolute sm:left-0 sm:top-0 sm:w-[38%]",
  // configurator — the favourite, given more room
  "mt-16 sm:mt-0 sm:absolute sm:left-[52%] sm:top-[8%] sm:w-[44%]",
  "mt-16 sm:mt-0 sm:absolute sm:left-[8%] sm:top-[52%] sm:w-[36%]",
  "mt-16 sm:mt-0 sm:absolute sm:left-[58%] sm:top-[64%] sm:w-[34%]",
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
 * Selected Work. Two presentations from one data set:
 *  - Fine pointer (desktop): a scattered image collage. Each image leans toward
 *    the cursor; hovering one enlarges it and blurs the rest, and its tagline +
 *    tags reveal beneath.
 *  - Touch / reduced motion (mobile): a stack of tappable cards. Each one reads
 *    at a glance — number, title, one-line tagline — and expands on tap to show
 *    what was built. Clear affordance so it's obviously interactive.
 */
export function WorkGallery({ items }: { items: WorkItem[] }) {
  const reduced = !!useReducedMotion();
  const fine = usePointerFine();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const interactive = mounted && fine && !reduced;

  if (!interactive) {
    return <WorkList items={items} />;
  }
  return <WorkCollage items={items} />;
}

// ── Mobile / touch: tappable cards that expand to reveal what was built ──
function WorkList({ items }: { items: WorkItem[] }) {
  // start collapsed: each card reads at a glance (image + title + one line),
  // and the "More" toggle invites the tap that reveals what was built.
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li
            className={cn(
              "overflow-hidden border bg-bg transition-colors duration-300",
              isOpen ? "border-accent/60" : "border-border"
            )}
            key={item.slug}
          >
            <button
              aria-expanded={isOpen}
              className="group block w-full text-left transition-[transform] duration-200 active:scale-[0.995]"
              onClick={() => setOpen((c) => (c === i ? null : i))}
              type="button"
            >
              <div className="relative">
                <MediaFrame
                  aspect={2 / 1}
                  className="w-full"
                  label={item.slug}
                  media={item.media}
                  minimal
                />
                <span
                  className="absolute top-3 left-3 font-terminal text-[0.62rem] text-accent uppercase tracking-[0.25em] tabular-nums"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                  <p className="font-terminal text-[0.82rem] text-accent uppercase tracking-[0.22em]">
                    {item.title.toUpperCase()}
                  </p>
                  {item.tagline ? (
                    <p className="mt-1.5 text-pretty text-muted-fg text-sm leading-relaxed">
                      {item.tagline}
                    </p>
                  ) : null}
                </div>
                {/* affordance: a labelled toggle so it's clearly tappable */}
                <span className="mt-0.5 flex shrink-0 items-center gap-1.5 font-terminal text-[0.6rem] text-muted-fg uppercase tracking-[0.16em]">
                  {isOpen ? "Less" : "More"}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-accent transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  >
                    ⌄
                  </span>
                </span>
              </div>
            </button>

            {isOpen ? (
              <div className="px-4 pb-5">
                <p className="text-muted-fg text-sm leading-relaxed">
                  {item.summary}
                </p>
                {item.highlights && item.highlights.length > 0 ? (
                  <ul className="mt-4 space-y-2.5 border-border border-t pt-4">
                    {item.highlights.map((h, hi) => (
                      <li className="flex gap-3 text-sm leading-snug" key={h}>
                        <span
                          aria-hidden="true"
                          className="font-terminal text-[0.7rem] text-accent tabular-nums"
                        >
                          {String(hi + 1).padStart(2, "0")}
                        </span>
                        <span className="text-fg/80">{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                  {item.tags.map((t) => (
                    <li
                      className="font-terminal text-[0.6rem] text-muted-fg uppercase tracking-[0.2em]"
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
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// ── Desktop / fine pointer: the scattered, cursor-reactive collage ──
function WorkCollage({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [plays, setPlays] = useState(() => items.map(() => 0));

  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const cur = useRef(items.map(() => ({ x: 0, y: 0 })));

  // Track the cursor across the WHOLE window so the images lean toward it
  // wherever it is (page margins included) and never snap back from a tight
  // box. Read all rects, then write all transforms (no thrash); base centre =
  // rect centre minus the lean already applied, so it never feeds back.
  useEffect(() => {
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
  }, []);

  const enter = (i: number) => {
    setActive(i);
    setPlays((p) => p.map((v, idx) => (idx === i ? v + 1 : v)));
  };

  return (
    <div className="relative block aspect-[5/6]">
      {/* focus: blur the whole page behind the hovered image so only it stays sharp */}
      {active !== null ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 bg-bg/10 backdrop-blur-[3px]"
        />
      ) : null}
      {items.map((item, i) => {
        const dim = active !== null && active !== i;
        const on = active === i;
        return (
          <figure
            className={cn(
              "w-full transition-[filter,opacity] duration-300",
              LAYOUT[i % LAYOUT.length],
              dim && "blur-[5px] opacity-45"
            )}
            key={item.slug}
            style={{ zIndex: on ? 50 : 1 }}
          >
            {/* lean wrapper — rAF writes its transform */}
            <div
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              {/* the image is the only hover target for the zoom/blur — the
                  title/tags live in the figcaption, so nothing is gated here */}
              <div
                className={cn(
                  "origin-center transition-transform duration-500 ease-out",
                  on && "scale-[1.05]"
                )}
                onPointerEnter={() => enter(i)}
                onPointerLeave={() => setActive(null)}
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
                    "absolute inset-x-0 top-full flex flex-col gap-2 pt-3 opacity-0 transition-opacity duration-300",
                    on && "opacity-100"
                  )}
                >
                  {item.tagline ? (
                    <p className="max-w-md text-muted-fg text-sm leading-relaxed">
                      <ScrambleText
                        durationMs={650}
                        fade
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
