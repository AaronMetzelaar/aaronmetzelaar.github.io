"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { premiumTheme } from "@/lib/premium-theme";
import { type LoaderVariant, PortraitLoader } from "./_portrait-loader";

// Three takes on the same idea: the page loads with the portrait's own dots
// hovering, an in-theme percentage counts up, and when it hits 100 those exact
// dots assemble into the portrait. Switch + replay to compare; it auto-loops.
const VARIANTS: {
  id: LoaderVariant;
  name: string;
  blurb: string;
}[] = [
  {
    id: "field",
    name: "Field",
    blurb:
      "The dots drift in a loose cloud, then converge straight into the portrait.",
  },
  {
    id: "orbit",
    name: "Orbit",
    blurb:
      "The cloud slowly orbits; at 100% it untwists and tightens into the portrait.",
  },
  {
    id: "swarm",
    name: "Swarm",
    blurb:
      "The dots breathe and jitter in place, then spring into the portrait.",
  },
];

const LOAD_MS = 2600; // count 0→100
const ASSEMBLE_MS = 2500; // dots converge into the portrait
const HOLD_MS = 1500; // rest on the finished face
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

// The loading bar — set in the display serif (the brand's distinctive face) on
// a frosted plate so it stays crisp and legible over the full-screen dot field.
function LoadingBar({ p }: { p: number }) {
  const pct = String(Math.round(p)).padStart(2, "0");
  return (
    <div className="w-[min(84vw,460px)] border border-border bg-bg/55 px-8 py-7 backdrop-blur-md">
      <div className="flex items-end justify-between">
        <span className="font-display text-[0.7rem] text-muted-fg uppercase tracking-[0.4em]">
          Laden
        </span>
        <span className="font-display text-[clamp(2.75rem,8vw,4rem)] leading-none tracking-[-0.02em] tabular-nums">
          {pct}
          <span className="text-accent">%</span>
        </span>
      </div>
      <div className="mt-5 h-[3px] w-full bg-fg/15">
        <div
          className="h-full bg-accent"
          style={{ width: `${p}%`, transition: "width 140ms linear" }}
        />
      </div>
    </div>
  );
}

export default function HeadersGallery() {
  // default to Swarm — the chosen variant
  const [vi, setVi] = useState(2);
  const [playId, setPlayId] = useState(0);
  const [progress, setProgress] = useState(0);
  const [assembling, setAssembling] = useState(false);
  const v = VARIANTS[vi];

  // count up, assemble, hold, loop (remount the loader via playId)
  useEffect(() => {
    setProgress(0);
    setAssembling(false);
    let raf = 0;
    const start = performance.now();
    let phase: "load" | "assemble" = "load";
    const tick = (now: number) => {
      const t = now - start;
      if (phase === "load") {
        const p = Math.min(1, t / LOAD_MS);
        setProgress(easeOutCubic(p) * 100);
        if (p >= 1) {
          phase = "assemble";
          setAssembling(true);
        }
      } else if (t - LOAD_MS > ASSEMBLE_MS + HOLD_MS) {
        setPlayId((id) => id + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vi, playId]);

  return (
    <main
      className="relative h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      {/* the portrait's own dots — hovering, then assembling */}
      <div className="absolute inset-0">
        <PortraitLoader
          anchorX={0}
          assemble={assembling}
          className="h-full w-full"
          key={`${v.id}-${playId}`}
          variant={v.id}
        />
      </div>

      {/* the loading bar — fades out as the portrait resolves */}
      <div
        className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
        style={{
          opacity: assembling ? 0 : 1,
          transition: "opacity 600ms ease",
        }}
      >
        <LoadingBar p={progress} />
      </div>

      <div className="absolute top-8 left-8 z-10">
        <p className="text-accent text-xs uppercase tracking-[0.35em]">
          {v.name} loader
        </p>
        <p className="mt-2 max-w-[15rem] text-[0.7rem] text-muted-fg leading-relaxed tracking-[0.05em]">
          {v.blurb}
        </p>
      </div>

      {/* switcher + replay */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-7 sm:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
          {VARIANTS.map((variant, i) => (
            <button
              className={`px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                i === vi ? "text-accent" : "text-muted-fg hover:text-fg"
              }`}
              key={variant.id}
              onClick={() => setVi(i)}
              type="button"
            >
              <span className="tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {variant.name}
            </button>
          ))}
          <button
            className="ml-2 border border-border px-3 py-2 text-fg text-xs uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
            onClick={() => setPlayId((id) => id + 1)}
            type="button"
          >
            ↻ Replay
          </button>
        </div>
      </div>

      <Link
        className="absolute bottom-7 left-6 z-20 text-[0.7rem] text-muted-fg uppercase tracking-[0.3em] transition-colors hover:text-accent sm:left-10"
        href="/explore"
      >
        ← Explore
      </Link>
    </main>
  );
}
