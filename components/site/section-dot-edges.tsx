"use client";

import { useEffect, useRef } from "react";

// The dark Harness section's edges, drawn as the page's own dot grid inking up:
// black/accent dots on the 30px grid grow + pack tighter toward the section,
// merging into solid; mirrored at the bottom so it fades back out to the page.
// Tinted from the page's blue dots into ink. Two fixed-height edge canvases
// (cheap; no thousands of DOM dots); the solid middle is plain CSS.

export const SECTION_RAMP = 600; // px height of each edge transition

const G = 30; // page dot grid
const S_MIN = 3;
const S_EXPO = 1.8;
const TOP_THIRD = 0.34;
const GROW = 6.5;
const FILL_EASE = 1.7;

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d_2b_79_f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

// blue page-dot -> ink
function tint(t: number) {
  const a = [0x1b, 0x34, 0xff];
  const b = [0x0a, 0x0a, 0x0b];
  const k = Math.min(1, t);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/**
 * Draw one edge ramp into a band canvas of height bandH. solidAtTop=true puts
 * the solid (section) end at y=0 (the bottom edge: solid above, page below);
 * false puts it at y=bandH (the top edge: page above, solid below).
 */
function drawRamp(
  ctx: CanvasRenderingContext2D,
  w: number,
  bandH: number,
  solidAtTop: boolean,
  seed: number
) {
  const rnd = makeRng(seed);
  let yy = 0;
  let guard = 0;
  let solidFrom = bandH;
  while (yy < bandH && guard < 1200) {
    guard += 1;
    const d = yy / bandH; // 0 = sparse (page) .. 1 = solid (section)
    const s =
      d <= TOP_THIRD
        ? G
        : G * (S_MIN / G) ** (((d - TOP_THIRD) / (1 - TOP_THIRD)) ** S_EXPO);
    if (s < 5) {
      solidFrom = yy;
      break;
    }
    const rad = Math.min(1.4 + d ** 1.2 * GROW, s * 0.78);
    const p = Math.min(1, (d / 0.9) ** FILL_EASE);
    ctx.fillStyle = tint(d * 1.15);
    const cyWithin = yy + s / 2;
    const cy = solidAtTop ? bandH - cyWithin : cyWithin;
    const cols = Math.ceil(w / s);
    for (let i = 0; i < cols; i++) {
      if (d > 0.84 || rnd() < p) {
        ctx.beginPath();
        ctx.arc((i + 0.5) * s, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    yy += s;
  }
  // solid remainder, joining the section body
  ctx.fillStyle = "#0a0a0b";
  if (solidAtTop) {
    ctx.fillRect(0, 0, w, bandH - solidFrom);
  } else {
    ctx.fillRect(0, solidFrom, w, bandH - solidFrom);
  }
}

export function SectionDotEdges() {
  const topRef = useRef<HTMLCanvasElement>(null);
  const botRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const edges: [HTMLCanvasElement | null, boolean, number][] = [
      [topRef.current, false, 7],
      [botRef.current, true, 99],
    ];
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const [canvas, solidAtTop, seed] of edges) {
        const w = canvas?.parentElement?.clientWidth ?? 0;
        if (!(canvas && w)) {
          continue;
        }
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(SECTION_RAMP * dpr);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          continue;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawRamp(ctx, w, SECTION_RAMP, solidAtTop, seed);
      }
    };
    let raf = 0;
    const schedule = () => {
      raf ||= requestAnimationFrame(() => {
        raf = 0;
        draw();
      });
    };
    draw();
    const ro = new ResizeObserver(schedule);
    const host = topRef.current?.parentElement;
    if (host) {
      ro.observe(host);
    }
    return () => {
      ro.disconnect();
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  return (
    <>
      <canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] w-full"
        ref={topRef}
      />
      <canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[600px] w-full"
        ref={botRef}
      />
    </>
  );
}
