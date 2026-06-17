"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EYEBROW = "Frontend developer — AI / Agentic";
const TAGLINE = "Clean, fast interfaces — and the AI tooling that ships them.";
const FRAME =
  "relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center sm:px-12";
const NAME_CLS =
  "font-bold text-[clamp(2.75rem,9.5vw,7.5rem)] leading-[0.92] tracking-[-0.05em]";
const NAME = "Aaron Metzelaar";

function Eyebrow() {
  return (
    <p className="text-accent text-xs uppercase tracking-[0.3em]">{EYEBROW}</p>
  );
}

function Tag({ hint }: { hint?: string }) {
  return (
    <p className="mt-6 text-muted-fg text-sm">
      {hint ?? TAGLINE}
    </p>
  );
}

function StaticName() {
  return (
    <div className="mx-auto max-w-5xl">
      <Eyebrow />
      <h1 className={cn("mt-6", NAME_CLS)}>{NAME}</h1>
      <Tag />
    </div>
  );
}

/* ───────────────────────── 01 · Kinetic (velocity whip) ───────────────────────── */

export function HKinetic() {
  const reduced = useReducedMotion();
  const skew = useSpring(0, { stiffness: 140, damping: 11, mass: 0.6 });
  const stretch = useSpring(1, { stiffness: 140, damping: 13, mass: 0.6 });
  const lastX = useRef<number | null>(null);
  const idle = useRef(0);

  if (reduced) {
    return (
      <header className={FRAME}>
        <StaticName />
      </header>
    );
  }

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const x = e.clientX;
    if (lastX.current !== null) {
      const vx = x - lastX.current;
      skew.set(Math.max(-24, Math.min(24, vx * 0.8)));
      stretch.set(1 + Math.min(0.28, Math.abs(vx) * 0.004));
    }
    lastX.current = x;
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => {
      skew.set(0);
      stretch.set(1);
    }, 70);
  };
  const reset = () => {
    skew.set(0);
    stretch.set(1);
    lastX.current = null;
  };

  return (
    <header className={FRAME} onPointerLeave={reset} onPointerMove={onMove}>
      <div className="mx-auto max-w-5xl">
        <Eyebrow />
        <motion.h1
          className={cn("mt-6 origin-center", NAME_CLS)}
          style={{ skewX: skew, scaleX: stretch }}
        >
          {NAME}
        </motion.h1>
        <Tag hint="Move your cursor across — the type moves with you." />
      </div>
    </header>
  );
}

/* ───────────────────────── 02 · Elastic (grab & fling) ───────────────────────── */

export function HElastic() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const skew = useTransform(x, (v) => Math.max(-16, Math.min(16, v * 0.05)));
  const stretch = useTransform([x, y], ([vx, vy]: number[]) =>
    Math.min(1.32, 1 + Math.hypot(vx, vy) * 0.0016)
  );

  if (reduced) {
    return (
      <header className={FRAME}>
        <StaticName />
      </header>
    );
  }

  return (
    <header className={FRAME}>
      <div className="mx-auto max-w-5xl">
        <Eyebrow />
        <motion.h1
          className={cn("mt-6 origin-center cursor-grab touch-none select-none active:cursor-grabbing", NAME_CLS)}
          drag
          dragConstraints={{ left: -240, right: 240, top: -140, bottom: 140 }}
          dragElastic={0.4}
          dragSnapToOrigin
          dragTransition={{ bounceStiffness: 220, bounceDamping: 12 }}
          style={{ x, y, skewX: skew, scaleX: stretch }}
        >
          {NAME}
        </motion.h1>
        <Tag hint="Grab the name and throw it." />
      </div>
    </header>
  );
}

/* ───────────────────────── 03 · Liquid (SVG displacement) ───────────────────────── */

export function HLiquid() {
  const reduced = useReducedMotion();
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const idle = useRef(0);

  const onMove = () => {
    const el = dispRef.current;
    if (!el) {
      return;
    }
    el.setAttribute("scale", "34");
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => el.setAttribute("scale", "12"), 130);
  };

  return (
    <header
      className={FRAME}
      onPointerMove={reduced ? undefined : onMove}
    >
      <svg
        aria-hidden="true"
        className="absolute"
        height="0"
        role="presentation"
        width="0"
      >
        <title>liquid filter</title>
        <defs>
          <filter id="liquidWarp">
            <feTurbulence
              baseFrequency="0.011 0.015"
              numOctaves="2"
              result="noise"
              seed="7"
              type="fractalNoise"
            >
              {reduced ? null : (
                <animate
                  attributeName="baseFrequency"
                  dur="16s"
                  repeatCount="indefinite"
                  values="0.011 0.015;0.016 0.011;0.011 0.015"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              ref={dispRef}
              scale={reduced ? 0 : 12}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="mx-auto max-w-5xl">
        <Eyebrow />
        <h1
          className={cn("mt-6", NAME_CLS)}
          style={reduced ? undefined : { filter: "url(#liquidWarp)" }}
        >
          {NAME}
        </h1>
        <Tag hint="The letters flow like water as you move." />
      </div>
    </header>
  );
}

/* ───────────────────────── 04 · Flip (3D letter flip) ───────────────────────── */

const FLIP_R = 95;

function useCenter() {
  const ref = useRef<HTMLSpanElement>(null);
  const [c, setC] = useState({ x: -9999, y: 0 });
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) {
        setC({
          x: el.offsetLeft + el.offsetWidth / 2,
          y: el.offsetTop + el.offsetHeight / 2,
        });
      }
    };
    measure();
    const t = setTimeout(measure, 250);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);
  return { ref, c };
}

function FlipLetter({
  char,
  mx,
  my,
}: {
  char: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const { ref, c } = useCenter();
  const prox = useTransform([mx, my], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.x, y - c.y);
    return d > FLIP_R ? 0 : 1 - d / FLIP_R;
  });
  const rot = useSpring(
    useTransform(prox, (p) => p * 180),
    { stiffness: 180, damping: 14, mass: 0.4 }
  );
  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }
  return (
    <span
      className="relative inline-block [perspective:600px]"
      ref={ref}
    >
      <motion.span
        className="inline-block [transform-style:preserve-3d]"
        style={{ rotateX: rot }}
      >
        <span className="block [backface-visibility:hidden]">{char}</span>
        <span
          className="absolute inset-0 block text-accent [backface-visibility:hidden]"
          style={{ transform: "rotateX(180deg)" }}
        >
          {char}
        </span>
      </motion.span>
    </span>
  );
}

export function HFlip() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  if (reduced) {
    return (
      <header className={FRAME}>
        <StaticName />
      </header>
    );
  }

  const onMove = (e: ReactPointerEvent<HTMLHeadingElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const reset = () => {
    mx.set(-9999);
    my.set(-9999);
  };

  return (
    <header className={FRAME}>
      <div className="mx-auto max-w-5xl">
        <Eyebrow />
        <h1
          aria-label={NAME}
          className={cn("mt-6", NAME_CLS)}
          onPointerLeave={reset}
          onPointerMove={onMove}
          ref={ref}
        >
          {NAME.split("").map((ch, i) => (
            <FlipLetter char={ch} key={`${i}-${ch}`} mx={mx} my={my} />
          ))}
        </h1>
        <Tag hint="Sweep across — the letters turn over." />
      </div>
    </header>
  );
}

/* ───────────────────────── 05 · Gravity (orbiting particles) ───────────────────────── */

function GravityField() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!(wrap && canvas)) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    let raf = 0;
    let ready = false;
    let parts: { x: number; y: number; hx: number; hy: number; vx: number; vy: number }[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const accent =
      getComputedStyle(wrap).getPropertyValue("--accent").trim() || "#1b34ff";

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const step = 34;
      parts = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          parts.push({ x, y, hx: x, hy: y, vx: 0, vy: 0 });
        }
      }
      ready = true;
    };

    const frame = () => {
      if (!ready) {
        build();
      }
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const R = 240;
      ctx.fillStyle = accent;
      for (const p of parts) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < R) {
            const pull = (1 - dist / R) * 0.6;
            // attraction toward cursor + tangential swirl
            p.vx += (dx / dist) * pull + (-dy / dist) * pull * 0.8;
            p.vy += (dy / dist) * pull + (dx / dist) * pull * 0.8;
          }
        }
        // ease home
        p.vx += (p.hx - p.x) * 0.012;
        p.vy += (p.hy - p.y) * 0.012;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        const speed = Math.hypot(p.vx, p.vy);
        ctx.globalAlpha = Math.min(0.85, 0.2 + speed * 0.12);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    frame();
    window.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => {
      ready = false;
    });
    ro.observe(wrap);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
    };
  }, [reduced]);

  if (reduced) {
    return null;
  }
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      ref={wrapRef}
    >
      <canvas className="block h-full w-full" ref={canvasRef} />
    </div>
  );
}

export function HGravity() {
  return (
    <header className={FRAME}>
      <GravityField />
      <div className="relative mx-auto max-w-5xl">
        <Eyebrow />
        <h1 className={cn("mt-6", NAME_CLS)}>{NAME}</h1>
        <Tag hint="Hold your cursor still — the field gathers and orbits." />
      </div>
    </header>
  );
}
