"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  type LoaderVariant,
  PortraitLoader,
} from "@/components/site/portrait-loader";
import { isRevealed, triggerReveal } from "@/lib/page-reveal";

// The homepage preloader IS the hero's portrait, mid-boot. The portrait's own
// dots ride a spinning, growing formation around the % as assets load; when the
// page is ready those same dots fly inward and assemble into the face at the
// hero's exact framing, then the overlay dissolves onto the identical resting
// hero. One dot language, one continuous motion — no second system.
// Formation chosen from the explored takes — see portrait-loader's CFG.
const LOADER_VARIANT: LoaderVariant = "comet";
const MIN_MS = 1600; // dwell: the ring fills as assets load
const ASSEMBLE_MS = 1700; // ring -> portrait convergence shown on the overlay
const REVEAL_MS = 650; // final dissolve onto the resting hero
const CAP_MS = 7000; // safety: reveal even if an asset hangs
const PORTRAIT_SRCS = ["/portrait/cut.png", "/portrait/depth.jpg"];

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
  const [visible, setVisible] = useState(() => !isRevealed());
  const [desktop, setDesktop] = useState(true);
  const [assembling, setAssembling] = useState(false);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const revealing = useRef(false);

  // match the hero's framing so the assembled ring lands exactly on the resting
  // portrait and the dissolve is invisible
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const beginReveal = useCallback(() => {
    if (revealing.current) {
      return;
    }
    revealing.current = true;
    setProgress(100);
    triggerReveal(); // mark revealed (so a client-nav back skips the boot)
    setAssembling(true); // the ring's dots fly in and assemble into the face
    window.setTimeout(() => setFading(true), ASSEMBLE_MS);
    window.setTimeout(() => setVisible(false), ASSEMBLE_MS + REVEAL_MS + 60);
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

  // fill the ring up to ~99% over the dwell; beginReveal snaps it to 100
  useEffect(() => {
    if (reduced) {
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (revealing.current) {
        return;
      }
      setProgress(Math.min(99, ((now - start) / MIN_MS) * 99));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

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
        beginReveal();
      }
    });
    const cap = window.setTimeout(() => {
      if (alive) {
        beginReveal();
      }
    }, CAP_MS);
    return () => {
      alive = false;
      window.clearTimeout(cap);
    };
  }, [reduced, beginReveal]);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-bg"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${REVEAL_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* the portrait's own dots: a spinning, growing formation around the %,
          then converging into the face at the hero's framing. The box matches
          the hero portrait's exactly — full-bleed on desktop, a sized top band
          on mobile (same clamp) — so the assembled head is pixel-identical to
          the resting hero when the overlay dissolves (no shrink-on-reveal). */}
      <div className="absolute inset-x-0 top-0 h-[clamp(18rem,80vw,26rem)] lg:h-full">
        <PortraitLoader
          assemble={assembling}
          assembleAnchorX={desktop ? 1.05 : 0}
          assembleCamZ={desktop ? 4.8 : 4.0}
          className="h-full w-full"
          progress={progress / 100}
          variant={LOADER_VARIANT}
        />
      </div>
      {/* the percentage, centred in that same box; fades as the face forms */}
      <div
        className="absolute inset-x-0 top-0 grid h-[clamp(18rem,80vw,26rem)] place-items-center lg:h-full"
        style={{
          opacity: assembling ? 0 : 1,
          transition: "opacity 450ms ease-out",
        }}
      >
        <div className="text-center font-terminal">
          <p className="text-[0.62rem] text-muted-fg uppercase tracking-[0.4em]">
            Laden
          </p>
          <p className="mt-2 font-bold text-[clamp(2.2rem,7vw,3.2rem)] text-accent leading-none tabular-nums">
            {Math.round(progress)}
            <span className="text-[0.5em] text-fg">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
