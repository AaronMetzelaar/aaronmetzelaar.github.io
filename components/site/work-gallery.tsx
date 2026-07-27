"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { MediaFrame } from "@/components/media/media-frame";
import { ScrambleText } from "@/components/motion/scramble-text";
import { WorkList } from "@/components/site/work-list";
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

// The collage's scattered placement (and the z-index that lifts the hovered
// figure above the page-blur overlay) only exists from Tailwind's `sm`
// breakpoint up — below it the figures stack statically, z-index stops
// applying, and the blur overlay would cover the hovered image too. Gate the
// collage to the same 640px the sm: classes fire at.
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setWide(mq.matches);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return wide;
}

/**
 * Selected Work. Two presentations from one data set:
 *  - 640px and up: a scattered image collage. Each image leans toward the cursor
 *    (fine pointers only); focusing one — by hover, by tap, or by keyboard —
 *    enlarges it, blurs the rest, and reveals its tagline + tags beneath.
 *  - Phones / reduced motion: a stack of tappable cards (WorkList), which shows
 *    strictly more per item and needs no pointer at all.
 *
 * The collage used to require a fine pointer, so a tablet fell back to the card
 * stack, and its tiles were plain <figure>s with pointer handlers: no tab stop,
 * so a keyboard visitor got four titles and could never reach a tagline. The
 * tile is a real button now and every input can drive the same focus state.
 */
export function WorkGallery({ items }: { items: WorkItem[] }) {
  const reduced = !!useReducedMotion();
  const wide = useWide();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!(mounted && wide) || reduced) {
    return <WorkList items={items} />;
  }
  return <WorkCollage items={items} />;
}

// ── 640px and up: the scattered collage. Cursor-reactive on a fine pointer,
//    tap-to-focus on a coarse one, focusable either way ──
function WorkCollage({ items }: { items: WorkItem[] }) {
  const fine = usePointerFine();
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
    // No cursor, no lean — and no reason to hold a 60fps loop open for it.
    if (!fine) {
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
  }, [fine]);

  const enter = (i: number) => {
    setActive(i);
    setPlays((p) => p.map((v, idx) => (idx === i ? v + 1 : v)));
  };

  // A hovered tile stops being hovered when the page scrolls under a stationary
  // cursor, and the browser never says so (no pointerleave until the next
  // pointer move). Left alone, the page-wide blur overlay stays up for the rest
  // of the visit and everything behind it, dot dividers included, reads as
  // out of focus. Pointer-driven focus therefore expires on the next scroll;
  // keyboard focus does not, because tabbing scrolls the page itself.
  const expireOnScroll = () => {
    window.addEventListener("scroll", () => setActive(null), {
      once: true,
      passive: true,
    });
  };

  // Same focus state, three ways in. Hover belongs to fine pointers; tap belongs
  // to coarse ones (and toggles, so a second tap dismisses); keyboard focus
  // works on both, which is the part that didn't exist before.
  const focusProps = (i: number) =>
    fine
      ? {
          onPointerEnter: () => {
            enter(i);
            expireOnScroll();
          },
          onPointerLeave: () => setActive(null),
        }
      : {
          onClick: () => (active === i ? setActive(null) : enter(i)),
        };

  return (
    <div className="relative block aspect-[5/6]">
      {/* name the gesture that actually works on this device, in the page's
          micro-caps voice, so the interaction isn't a secret */}
      <p className="-top-6 pointer-events-none absolute right-0 flex items-center gap-2 text-[0.62rem] text-accent uppercase tracking-[0.25em]">
        <span aria-hidden="true" className="nudge-x">
          ↔
        </span>
        {fine ? "Hover an image to focus" : "Tap an image to focus"}
      </p>
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
              {/* the image is the focus target for the zoom/blur. A button, not
                  a div: it takes keyboard focus, announces its state, and gives
                  a coarse pointer something real to tap. */}
              <button
                aria-expanded={on}
                aria-label={item.title}
                className={cn(
                  "block w-full origin-center transition-transform duration-500 ease-out",
                  on && "scale-[1.05]"
                )}
                onBlur={() => setActive(null)}
                // Any focus, mouse or keyboard: a click can't latch the blur on,
                // because reaching the tile with a pointer already armed the
                // scroll expiry above.
                onFocus={() => enter(i)}
                type="button"
                {...focusProps(i)}
              >
                <MediaFrame
                  aspect={4 / 3}
                  className="w-full"
                  label={item.slug}
                  media={item.media}
                  minimal
                />
              </button>

              {/* title UNDER the image, in accent; name scramble-decodes on hover */}
              <figcaption className="relative mt-4">
                <p className="text-[0.82rem] text-accent uppercase tracking-[0.22em]">
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
