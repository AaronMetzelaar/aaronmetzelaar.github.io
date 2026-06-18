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
// twist: a promo clip plays only while hovered (never autoplays in your face),
// and the social tile's secondary stills animate OUT of the hero to flank it,
// carried on the same cursor-lean. Touch / reduced motion = a static list.
const PULL = 0.09;
const MAX = 22;
const EASE = 0.12;

// loose vertical stagger so three tiles read as a collage, not a grid row
const STAGGER = ["", "sm:mt-20", "sm:mt-8"];

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

// where each secondary still lands as it emerges from behind the hero
const PEEK = [
  "-translate-x-[64%] -translate-y-[12%] -rotate-[7deg]",
  "translate-x-[64%] -translate-y-[4%] rotate-[7deg]",
];

export function CreativeGallery({ items }: { items: WorkItem[] }) {
  const reduced = !!useReducedMotion();
  const fine = usePointerFine();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [plays, setPlays] = useState(() => items.map(() => 0));
  const baseId = useId();

  useEffect(() => setMounted(true), []);
  const interactive = mounted && fine && !reduced;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const cur = useRef(items.map(() => ({ x: 0, y: 0 })));

  // rAF: ease each tile's translate toward the cursor (off offsetLeft/Top so the
  // lean never feeds back) — identical feel to the Selected Work gallery
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
    setHoveredMedia(`${baseId}-${i}`); // pause any other media while this is focused
  };
  const leave = (i: number) => {
    setActive(null);
    clearHoveredMedia(`${baseId}-${i}`);
  };

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
        const gallery = item.gallery ?? [];
        const [hero, ...secondaries] = gallery;
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
            {/* lean wrapper — rAF writes its transform */}
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
                  ) : gallery.length > 0 ? (
                    <>
                      {/* secondaries emerge from behind the hero to flank it */}
                      {secondaries.map((s, si) => (
                        <div
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 border border-border bg-bg bg-center bg-cover opacity-0 shadow-lg transition-all duration-500 ease-out",
                            on && `opacity-100 ${PEEK[si % PEEK.length]} scale-[0.82]`
                          )}
                          key={s.src}
                          style={{ backgroundImage: `url(${s.src})` }}
                        />
                      ))}
                      {hero ? (
                        <div
                          aria-label={hero.alt}
                          className="absolute inset-0 z-10 border border-border bg-bg bg-center bg-cover"
                          role="img"
                          style={{ backgroundImage: `url(${hero.src})` }}
                        />
                      ) : null}
                    </>
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

              {/* caption UNDER, in accent; summary scramble-decodes on hover */}
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
    </div>
  );
}
