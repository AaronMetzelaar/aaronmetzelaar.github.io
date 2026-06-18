"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { PortraitLoader } from "@/app/explore/headers/_portrait-loader";
import { LoadingBar } from "@/components/site/loading-bar";
import { isRevealed, triggerReveal } from "@/lib/page-reveal";

// The homepage preloader, built from the hero's OWN portrait dots: while assets
// load they hover in a loose, screen-filling swarm under a percentage bar; when
// the page is ready the overlay dissolves and the hand-off fires, so the hero's
// portrait assembles from the same dots. One dot language, no second system.
const MIN_MS = 1600; // premium minimum dwell, even on a warm cache
const REVEAL_MS = 700; // dissolve length
const CAP_MS = 6500; // safety: reveal even if an asset hangs
const PORTRAIT_SRCS = ["/portrait-cut.png", "/portrait-depth.jpg"];
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

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
  const [progress, setProgress] = useState(0);
  const revealing = useRef(false);

  const beginReveal = useCallback(() => {
    if (revealing.current) {
      return;
    }
    revealing.current = true;
    setProgress(100);
    triggerReveal(); // the hero assembles from the same dots as the overlay fades
    setFading(true);
    window.setTimeout(() => setVisible(false), REVEAL_MS + 80);
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

  // count the bar up to ~90% over the dwell; beginReveal snaps it to 100
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
      setProgress(easeOutCubic(Math.min(1, (now - start) / MIN_MS)) * 90);
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
      <PortraitLoader
        assemble={false}
        className="absolute inset-0 h-full w-full"
        variant="swarm"
      />
      <div className="absolute inset-0 grid place-items-center">
        <LoadingBar p={progress} />
      </div>
    </div>
  );
}
