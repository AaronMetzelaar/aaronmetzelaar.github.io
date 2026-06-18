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
  chrome: "number" | "ring" | "bar";
}[] = [
  {
    id: "field",
    name: "Field",
    blurb:
      "The dots drift in a loose cloud, then converge straight into the portrait.",
    chrome: "number",
  },
  {
    id: "orbit",
    name: "Orbit",
    blurb:
      "The cloud slowly orbits; at 100% it untwists and tightens into the portrait.",
    chrome: "ring",
  },
  {
    id: "swarm",
    name: "Swarm",
    blurb:
      "The dots breathe and jitter in place, then spring into the portrait.",
    chrome: "bar",
  },
];

const LOAD_MS = 2600; // count 0→100
const ASSEMBLE_MS = 2500; // dots converge into the portrait
const HOLD_MS = 1500; // rest on the finished face
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

function Counter({
  chrome,
  p,
}: {
  chrome: "number" | "ring" | "bar";
  p: number;
}) {
  const pct = String(Math.round(p)).padStart(3, "0");
  if (chrome === "ring") {
    const R = 30;
    const C = 2 * Math.PI * R;
    return (
      <div className="relative grid h-[88px] w-[88px] place-items-center">
        <svg className="-rotate-90 absolute inset-0" height="88" width="88">
          <circle
            cx="44"
            cy="44"
            fill="none"
            r={R}
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          <circle
            cx="44"
            cy="44"
            fill="none"
            r={R}
            stroke="var(--accent)"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - p / 100)}
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
        <span className="text-sm tabular-nums tracking-tight">
          {Math.round(p)}
        </span>
      </div>
    );
  }
  if (chrome === "bar") {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-2xl tabular-nums tracking-tight">
          {pct}
          <span className="text-accent">%</span>
        </span>
        <div className="h-px w-44 bg-border">
          <div
            className="h-full bg-accent"
            style={{ width: `${p}%` }}
          />
        </div>
      </div>
    );
  }
  return (
    <span className="text-5xl tabular-nums tracking-[-0.03em]">
      {pct}
      <span className="text-accent">%</span>
    </span>
  );
}

export default function HeadersGallery() {
  const [vi, setVi] = useState(0);
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

      {/* in-theme percentage loader — fades out as the portrait resolves */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[19vh] z-10 flex flex-col items-center gap-5"
        style={{
          opacity: assembling ? 0 : 1,
          transition: "opacity 600ms ease",
        }}
      >
        <Counter chrome={v.chrome} p={progress} />
        <p className="text-[0.7rem] text-muted-fg uppercase tracking-[0.35em]">
          Loading
        </p>
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
