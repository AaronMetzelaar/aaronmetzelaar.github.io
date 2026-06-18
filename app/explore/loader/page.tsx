"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { premiumTheme } from "@/lib/premium-theme";
import { type Motion, VoxelPortrait } from "../headers/_voxel-portrait";

// Five loading states, all built on the hero's halftone dot portrait: the same
// dots you see in the page header, caught mid-flight *before* they settle into
// the face. Each reuses one of the portrait's one-shot entrance motions and
// dresses it as a finished loader (a status verb, a 0→100 readout, and one
// signature progress mark). The page loops + lets you replay and compare.
type Variant = {
  slug: string;
  name: string;
  motion: Motion;
  verb: string;
  blurb: string;
  spread: number;
};

const VARIANTS: Variant[] = [
  {
    slug: "converge",
    name: "Converge",
    motion: "assemble",
    verb: "Assembling",
    blurb:
      "Dots scattered across the whole screen rush inward and lock into the portrait.",
    spread: 3.6,
  },
  {
    slug: "develop",
    name: "Develop",
    motion: "scan",
    verb: "Developing",
    blurb:
      "A scan line sweeps top to bottom; the face develops in its wake, like a darkroom print.",
    spread: 2.6,
  },
  {
    slug: "focus",
    name: "Focus",
    motion: "depth",
    verb: "Focusing",
    blurb: "Dots rush forward out of depth and snap into focus toward you.",
    spread: 2.6,
  },
  {
    slug: "settle",
    name: "Settle",
    motion: "rise",
    verb: "Rendering",
    blurb: "Dots rise from the baseline and settle into place, bottom-up.",
    spread: 2.6,
  },
  {
    slug: "print",
    name: "Print",
    motion: "develop",
    verb: "Printing",
    blurb:
      "Every dot inks in where it stands, in a fine random stagger — halftone printing.",
    spread: 2.6,
  },
];

const ENTRANCE_MS = 3200; // ~the portrait's entrance length (DUR + STAG + tail)
const HOLD_MS = 1200; // rest on the finished face before looping
const LOOP_MS = ENTRANCE_MS + HOLD_MS;
const CAM_Z = 4.6;
const PRINT_DOTS = 28;

// one signature progress mark per variant — kept light; the dots are the show
function Chrome({ slug, p }: { slug: string; p: number }) {
  if (slug === "develop") {
    // a scan line riding down the frame with progress
    return (
      <div
        className="absolute inset-x-0 h-px bg-accent/70"
        style={{ top: `${10 + (p / 100) * 74}%` }}
      >
        <div className="-top-12 absolute inset-x-0 h-12 bg-gradient-to-b from-transparent to-accent/10" />
      </div>
    );
  }
  if (slug === "focus") {
    // a four-corner reticle that tightens as it resolves
    const inset = 16 - (p / 100) * 6;
    const corners = [
      "top-0 left-0 border-t-2 border-l-2",
      "top-0 right-0 border-t-2 border-r-2",
      "bottom-0 left-0 border-b-2 border-l-2",
      "bottom-0 right-0 border-b-2 border-r-2",
    ];
    return (
      <div className="absolute" style={{ inset: `${inset + 8}% ${inset}%` }}>
        {corners.map((c) => (
          <span className={`absolute h-7 w-7 border-accent ${c}`} key={c} />
        ))}
      </div>
    );
  }
  if (slug === "settle") {
    // a left rail that fills bottom→top
    return (
      <div className="absolute top-28 bottom-40 left-8 w-px bg-border">
        <div
          className="absolute inset-x-0 bottom-0 bg-accent"
          style={{ height: `${p}%` }}
        />
      </div>
    );
  }
  if (slug === "print") {
    // a dot-matrix bar that inks in left→right
    const lit = Math.round((p / 100) * PRINT_DOTS);
    return (
      <div className="absolute inset-x-0 bottom-40 flex justify-center gap-1.5">
        {Array.from({ length: PRINT_DOTS }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static bar
            className={`h-1.5 w-1.5 rounded-full ${i < lit ? "bg-accent" : "bg-border"}`}
            key={i}
          />
        ))}
      </div>
    );
  }
  // converge (default) — a baseline hairline filling left→right
  return (
    <div className="absolute inset-x-8 bottom-40 h-px bg-border">
      <div className="h-full bg-accent" style={{ width: `${p}%` }} />
    </div>
  );
}

export default function LoaderExplorer() {
  const [vi, setVi] = useState(0);
  const [playId, setPlayId] = useState(0);
  const [progress, setProgress] = useState(0);
  const v = VARIANTS[vi];

  // drive a decorative 0→100 readout synced to the entrance, then loop by
  // remounting the portrait (playId → new key) so its one-shot entrance replays
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      setProgress(Math.min(100, (t / ENTRANCE_MS) * 100));
      if (t >= LOOP_MS) {
        setPlayId((id) => id + 1); // re-runs this effect → fresh loop
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vi, playId]);

  const pct = String(Math.round(progress)).padStart(3, "0");

  return (
    <main
      className="relative h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      {/* the dot portrait, full-bleed — the loader's whole subject */}
      <div className="absolute inset-0">
        <VoxelPortrait
          anchorX={0}
          camZ={CAM_Z}
          className="h-full w-full"
          key={`${v.slug}-${playId}`}
          motion={v.motion}
          spread={v.spread}
        />
      </div>

      {/* status chrome — decorative, lets the dots stay the subject */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-8 left-8">
          <p className="text-accent text-xs uppercase tracking-[0.35em]">
            {v.verb}
          </p>
          <p className="mt-2 text-[0.7rem] text-muted-fg uppercase tracking-[0.3em]">
            {v.name} loader
          </p>
        </div>
        <p className="absolute top-7 right-8 text-4xl tabular-nums tracking-tight">
          {pct}
          <span className="text-accent">%</span>
        </p>
        <Chrome p={progress} slug={v.slug} />
      </div>

      {/* switcher + replay + blurb */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-7 sm:px-10">
        <p className="mx-auto mb-4 max-w-2xl text-balance text-center text-muted-fg text-sm leading-relaxed">
          {v.blurb}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
          {VARIANTS.map((variant, i) => (
            <button
              className={`px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                i === vi ? "text-accent" : "text-muted-fg hover:text-fg"
              }`}
              key={variant.slug}
              onClick={() => {
                setVi(i);
                setProgress(0);
              }}
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
