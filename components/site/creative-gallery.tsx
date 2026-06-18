"use client";

import { useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { CoordinatedVideo } from "@/components/media/coordinated-video";
import { MediaFrame } from "@/components/media/media-frame";
import { ScrambleText } from "@/components/motion/scramble-text";
import type { WorkItem } from "@/content/types";
import { clearHoveredMedia, setHoveredMedia } from "@/lib/media-bus";
import { cn } from "@/lib/utils";

// Same interaction language as the Selected Work gallery — each tile leans
// toward the cursor, hovering one enlarges it and brings it forward while the
// rest blur, and the caption reveals + scramble-decodes on hover. The Creative
// twists: a promo clip plays only while hovered (never autoplays), and the
// social tile's secondary stills fly out into the section's free space as
// separate, cursor-leaning tiles — not peeking from behind the hero.
const PULL = 0.09;
const MAX = 22;
const EASE = 0.12;

// loose vertical stagger so three tiles read as a collage, not a grid row
const STAGGER = ["", "sm:mt-20", "sm:mt-8"];

// where the social secondaries come to rest — scattered across the open area to
// the left of the (right-most) social tile. left/top/width as % of the gallery;
// `from` is the resting → hidden offset so they emerge from the hero's side.
const DROPS = [
  { left: "0%", top: "1%", width: "25%", from: "translate(70px, -16px) scale(0.7)" },
  { left: "26%", top: "46%", width: "23%", from: "translate(90px, 24px) scale(0.7)" },
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

export function CreativeGallery({ items }: { items: WorkItem[] }) {
  const reduced = !!useReducedMotion();
  const fine = usePointerFine();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [plays, setPlays] = useState(() => items.map(() => 0));
  const baseId = useId();

  useEffect(() => setMounted(true), []);
  const interactive = mounted && fine && !reduced;

  const socialIndex = items.findIndex((it) => (it.gallery?.length ?? 0) > 1);
  const secondaries =
    socialIndex >= 0 ? (items[socialIndex].gallery ?? []).slice(1) : [];

  const containerRef = useRef<HTMLDivElement>(null);
  // lean targets: one per tile, then one per floating secondary
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const cur = useRef(
    Array.from({ length: items.length + secondaries.length }, () => ({
      x: 0,
      y: 0,
    }))
  );

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

  const enter = (i: number) => {
    setActive(i);
    setPlays((p) => p.map((v, idx) => (idx === i ? v + 1 : v)));
    setHoveredMedia(`${baseId}-${i}`);
  };
  const leave = (i: number) => {
    setActive(null);
    clearHoveredMedia(`${baseId}-${i}`);
  };

  const socialOn = interactive && active === socialIndex;

  return (
    <div
      className="relative grid gap-10 sm:grid-cols-3 sm:gap-8"
      onPointerLeave={interactive ? () => (pointer.current = null) : undefined}
      onPointerMove={interactive ? onMove : undefined}
      ref={containerRef}
    >
      {items.map((item, i) => {
        const dim = interactive && active !== null && active !== i;
        const on = interactive && active === i;
        const video = item.media?.kind === "video" ? item.media : null;
        const hero = item.gallery?.[0];
        return (
          <figure
            className={cn(
              "relative transition-[filter,opacity] duration-300",
              STAGGER[i % STAGGER.length],
              dim && "opacity-45 blur-[5px]"
            )}
            key={item.slug}
            style={{ zIndex: on ? 10 : 1 }}
          >
            <div ref={(el) => { cardRefs.current[i] = el; }}>
              <div
                className={cn(
                  "origin-center transition-transform duration-500 ease-out",
                  on && "scale-[1.04]"
                )}
                onPointerEnter={interactive ? () => enter(i) : undefined}
                onPointerLeave={interactive ? () => leave(i) : undefined}
              >
                <div className="relative aspect-[4/5] w-full">
                  {video ? (
                    <div className="absolute inset-0 overflow-hidden border border-border">
                      <CoordinatedVideo
                        alt={video.alt}
                        play={on}
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
              </div>

              <figcaption className="relative z-10 mt-4">
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

      {/* social secondaries — separate tiles that fly into the open area when
          the social tile is hovered; they lean toward the cursor like the rest */}
      {interactive
        ? secondaries.map((s, si) => {
            const drop = DROPS[si % DROPS.length];
            return (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute z-20 transition-[opacity,transform] duration-500 ease-out"
                key={s.src}
                style={{
                  left: drop.left,
                  top: drop.top,
                  width: drop.width,
                  opacity: socialOn ? 1 : 0,
                  transform: socialOn ? "none" : drop.from,
                }}
              >
                <div ref={(el) => { cardRefs.current[items.length + si] = el; }}>
                  <div
                    className="aspect-[4/5] w-full border border-border bg-bg bg-center bg-cover shadow-xl"
                    style={{ backgroundImage: `url(${s.src})` }}
                  />
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
}
