"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { isRevealed, triggerReveal } from "@/lib/page-reveal";

// The homepage preloader. While the page's assets load, a field of fine blue
// dots rushes inward from across the whole screen (the hero's dot language,
// caught before it resolves). When loading is done the dots scatter outward and
// the overlay dissolves — handing off to the hero, whose portrait assembles
// from the same kind of spread. So the dots scatter and end up in the portrait.
//
// Drawn on a plain 2D canvas so it paints on the first frame, before the
// WebGL portrait + its image/depth maps are ready.
const ACCENT: [number, number, number] = [27, 52, 255]; // #1b34ff
const NAVY: [number, number, number] = [10, 18, 66]; // deep ink end of the ramp
const MIN_MS = 1500; // premium minimum dwell, even on a warm cache
const SCATTER_MS = 800; // burst + dissolve length
const CAP_MS = 6500; // safety: reveal even if an asset hangs
const PORTRAIT_SRCS = ["/portrait-cut.png", "/portrait-depth.jpg"];

type Dot = {
  x: number;
  y: number;
  r: number;
  shade: number; // 0 navy .. 1 accent
  life: number; // 0..1 fade-in
  swirl: number; // tangential bias for organic inward flow
  vx: number;
  vy: number;
};

function preloadImg(src: string) {
  return new Promise<void>((resolve) => {
    const im = new Image();
    im.onload = () => resolve();
    im.onerror = () => resolve();
    im.src = src;
  });
}

export function Preloader() {
  const reduced = useReducedMotion();
  // skip entirely if we've already revealed once this session (client nav back)
  const [visible, setVisible] = useState(() => !isRevealed());
  const [fading, setFading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phase = useRef<"loading" | "scatter">("loading");
  const scatterInit = useRef(false);
  const prog = useRef(0);

  const beginScatter = useCallback(() => {
    if (phase.current === "scatter") {
      return;
    }
    prog.current = 1;
    phase.current = "scatter";
    triggerReveal(); // the hero starts assembling as the loader scatters
    setFading(true);
    window.setTimeout(() => setVisible(false), SCATTER_MS + 80);
  }, []);

  // lock scroll while the overlay is up
  useEffect(() => {
    if (!visible) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // readiness watch — reveal once fonts + the portrait maps are in (and a
  // premium minimum has elapsed), or after a hard cap if something hangs
  useEffect(() => {
    if (reduced) {
      triggerReveal();
      setVisible(false);
      return;
    }
    let alive = true;
    const assets = Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      ...PORTRAIT_SRCS.map(preloadImg),
    ]).catch(() => undefined);
    const minWait = new Promise<void>((r) => window.setTimeout(r, MIN_MS));
    Promise.all([assets, minWait]).then(() => {
      if (alive) {
        beginScatter();
      }
    });
    const cap = window.setTimeout(() => {
      if (alive) {
        beginScatter();
      }
    }, CAP_MS);
    return () => {
      alive = false;
      window.clearTimeout(cap);
    };
  }, [reduced, beginScatter]);

  // the dot animation
  useEffect(() => {
    if (reduced) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!(canvas && ctx)) {
      return;
    }

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let maxRad = 1;
    let dots: Dot[] = [];
    let last = performance.now();
    const t0 = last;

    const respawnRing = (d: Dot) => {
      const a = Math.random() * Math.PI * 2;
      const rad = maxRad * (0.85 + Math.random() * 0.4);
      d.x = cx + Math.cos(a) * rad;
      d.y = cy + Math.sin(a) * rad;
      d.r = 0.8 + Math.random() * 1.9;
      d.shade = Math.random();
      d.life = 0;
      d.swirl = (Math.random() - 0.5) * 0.7;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      cx = w / 2;
      cy = h / 2;
      maxRad = Math.hypot(w, h) / 2;
      const count = Math.min(240, Math.max(90, Math.round((w * h) / 7000)));
      dots = Array.from({ length: count }, () => ({
        // initial: spread across the whole screen, drifting inward
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.9,
        shade: Math.random(),
        life: Math.random(),
        swirl: (Math.random() - 0.5) * 0.7,
        vx: 0,
        vy: 0,
      }));
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const scattering = phase.current === "scatter";
      if (scattering && !scatterInit.current) {
        scatterInit.current = true;
        for (const d of dots) {
          const dx = d.x - cx;
          const dy = d.y - cy;
          const dist = Math.hypot(dx, dy) + 1e-3;
          const sp = 380 + Math.random() * 780;
          d.vx = (dx / dist) * sp + (Math.random() - 0.5) * 220;
          d.vy = (dy / dist) * sp + (Math.random() - 0.5) * 220;
        }
      }

      for (const d of dots) {
        if (scattering) {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
        } else {
          const dx = cx - d.x;
          const dy = cy - d.y;
          const dist = Math.hypot(dx, dy) + 1e-3;
          const ux = dx / dist;
          const uy = dy / dist;
          const speed = 300 * (0.34 + dist / maxRad); // farther = faster rush
          d.x += (ux * speed - uy * speed * 0.18 * d.swirl) * dt;
          d.y += (uy * speed + ux * speed * 0.18 * d.swirl) * dt;
          d.life = Math.min(1, d.life + dt * 1.4);
          if (dist < 16) {
            respawnRing(d);
          }
        }

        const r = Math.round(NAVY[0] + (ACCENT[0] - NAVY[0]) * d.shade);
        const g = Math.round(NAVY[1] + (ACCENT[1] - NAVY[1]) * d.shade);
        const b = Math.round(NAVY[2] + (ACCENT[2] - NAVY[2]) * d.shade);
        let alpha = 1;
        if (!scattering) {
          const dist = Math.hypot(cx - d.x, cy - d.y);
          const fadeOut = Math.min(1, dist / (maxRad * 0.16)); // dim near centre
          alpha = d.life * (0.25 + 0.75 * fadeOut);
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // a single fine progress hairline — the only chrome
      if (!scattering) {
        const barW = 150;
        const bx = cx - barW / 2;
        const by = h - 64;
        ctx.fillStyle = "rgba(10,18,66,0.14)";
        ctx.fillRect(bx, by, barW, 1);
        ctx.fillStyle = `rgb(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]})`;
        ctx.fillRect(bx, by, barW * prog.current, 1);
        if (prog.current < 0.9) {
          prog.current = Math.min(0.9, ((now - t0) / MIN_MS) * 0.9);
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-bg"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${SCATTER_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <canvas className="block h-full w-full" ref={canvasRef} />
    </div>
  );
}
