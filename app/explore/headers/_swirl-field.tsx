"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

// A background-filling halftone: a fixed, axis-aligned grid of flat dots whose
// SIZE tracks the tone of the animated swirl gif. The dots never move — only
// their radius pulses as the swirl plays, so the motion reads as the pattern
// breathing, not particles drifting. Drawn on a plain 2D canvas (flat circles,
// no lighting) so it stays crisp and on-brand.
//
// The gif's 181 frames are pre-extracted into one vertical sprite sheet
// (`/swirl-frames.png`, SW×SH per frame); we read them into one pixel buffer
// once and index the live frame off a clock.
const SW = 200; // per-frame sample size in the sprite sheet
const SH = 60;
const FRAME_MS = 67; // gif runs ~15fps (frames alternate 60/70ms)

// dot radius is in absolute px (decoupled from the grid pitch) so dots stay
// fine like the site's background field — tone only swings the size a little
const DOT_MIN_R = 0.4; // lightest areas → barely-there dots
const DOT_MAX_R = 3; // darkest areas → small solid dots

const ACCENT: [number, number, number] = [27, 52, 255]; // #1b34ff

type Sheet = { data: Uint8ClampedArray; count: number; total: number };

async function loadSheet(src: string): Promise<Sheet | null> {
  const im = new Image();
  im.crossOrigin = "anonymous";
  im.src = src;
  await im.decode().catch(() => {
    // dimensions check below handles failure
  });
  if (!im.naturalWidth || !im.naturalHeight) {
    return null;
  }
  const count = Math.round(im.naturalHeight / SH);
  const cnv = document.createElement("canvas");
  cnv.width = SW;
  cnv.height = SH * count;
  const cx = cnv.getContext("2d", { willReadFrequently: true });
  if (!cx) {
    return null;
  }
  cx.drawImage(im, 0, 0, SW, SH * count);
  const data = cx.getImageData(0, 0, SW, SH * count).data;
  return { data, count, total: count * FRAME_MS };
}

/**
 * Halftone dot field driven by the swirl gif. `gap` is the dot pitch in px
 * (smaller = denser). `mono` draws every dot in the brand blue (size carries
 * everything); otherwise dots take the gif's own colour, nudged toward blue.
 */
export function SwirlField({
  className,
  gap = 30,
  mono = true,
  dotMax = DOT_MAX_R,
}: {
  className?: string;
  gap?: number;
  mono?: boolean;
  dotMax?: number;
}) {
  const reduced = !!useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheet = useRef<Sheet | null>(null);

  useEffect(() => {
    let alive = true;
    loadSheet("/swirl-frames.png")
      .then((s) => {
        if (alive) {
          sheet.current = s;
        }
      })
      .catch(() => {
        // ignore
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let raf = 0;
    let start = performance.now();
    let lastFrame = -1;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      lastFrame = -1; // force a redraw at the new size
    };

    // map a canvas point (0..1) to gif uv with "cover" (fill, crop overflow)
    const gifAspect = SW / SH;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const s = sheet.current;
      if (!s) {
        return;
      }
      const frameIdx = reduced
        ? 0
        : Math.min(s.count - 1, (((now - start) % s.total) / FRAME_MS) | 0);
      // redraw only when the gif frame advances (≈15fps), not every rAF
      if (frameIdx === lastFrame) {
        return;
      }
      lastFrame = frameIdx;
      const rowBase = frameIdx * SH;
      const data = s.data;
      const canvasAspect = w / h;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (mono) {
        ctx.fillStyle = `rgb(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]})`;
      }

      for (let y = gap / 2; y < h; y += gap) {
        const ny = y / h;
        for (let x = gap / 2; x < w; x += gap) {
          const nx = x / w;
          // cover mapping
          let u: number;
          let v: number;
          if (canvasAspect > gifAspect) {
            u = nx;
            v = (ny - 0.5) * (gifAspect / canvasAspect) + 0.5;
          } else {
            v = ny;
            u = (nx - 0.5) * (canvasAspect / gifAspect) + 0.5;
          }
          const sx = Math.min(SW - 1, Math.max(0, (u * SW) | 0));
          const sy = Math.min(SH - 1, Math.max(0, (v * SH) | 0));
          const idx = ((rowBase + sy) * SW + sx) * 4;
          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          // the gif's tone only spans ~0.04..0.38, so stretch that range across
          // the full dot-size swing → the swirl reads even with tiny dots
          const dark = Math.max(0, Math.min(1, (0.4 - lum) / 0.36));
          const radius = DOT_MIN_R + (dotMax - DOT_MIN_R) * dark;
          if (radius < 0.25) {
            continue;
          }
          if (!mono) {
            const cr = Math.round((r * 0.7 + (ACCENT[0] / 255) * 0.3) * 255);
            const cg = Math.round((g * 0.7 + (ACCENT[1] / 255) * 0.3) * 255);
            const cb = Math.round((b * 0.7 + (ACCENT[2] / 255) * 0.3) * 255);
            ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
          }
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    start = performance.now();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [gap, mono, reduced]);

  return (
    <canvas
      aria-hidden="true"
      className={cn("block h-full w-full", className)}
      ref={canvasRef}
    />
  );
}

// the gif's native aspect (400×119) — the loader banner matches it so the
// whole swirl plays undistorted, nothing cropped
const GIF_ASPECT = `${SW} / ${SH}`;

/**
 * Loading state built on the swirl: the whole gif played as a wide dot banner
 * (bigger, denser dots so the spiral reads boldly) over a pulsing mono label.
 * The gif loops on its own, so it reads as a continuous loading animation.
 * `width` is the banner width in px; height follows the gif aspect.
 */
export function SwirlLoader({
  className,
  label = "Loading",
  width = 560,
}: {
  className?: string;
  label?: string;
  width?: number;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-7", className)}>
      <div
        className="relative"
        style={{ aspectRatio: GIF_ASPECT, width: `min(88vw, ${width}px)` }}
      >
        {/* the full swirl, in bigger/denser dots */}
        <SwirlField dotMax={6} gap={12} mono />
      </div>
      {label ? (
        <p className="swirl-loader-label font-terminal text-[0.7rem] text-muted-fg uppercase tracking-[0.4em]">
          {label}
        </p>
      ) : null}
      <style>{`
        .swirl-loader-label { animation: swirlPulse 1.8s ease-in-out infinite; }
        @keyframes swirlPulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .swirl-loader-label { animation: none }
        }
      `}</style>
    </div>
  );
}
