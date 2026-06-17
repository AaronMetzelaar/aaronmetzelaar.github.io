"use client";

import { useState } from "react";

import { premiumTheme } from "@/lib/premium-theme";

import { type Ambient, VoxelPortrait } from "../headers/_voxel-portrait";

const MODES: { id: Ambient; name: string; blurb: string; kind: string }[] = [
  {
    id: "shed",
    name: "Shed",
    kind: "Sides",
    blurb: "Dots peel off the left and right edges and float away.",
  },
  {
    id: "fall",
    name: "Fall",
    kind: "Below",
    blurb: "Dots detach and fall, fading out toward the bottom.",
  },
  {
    id: "rise",
    name: "Rise",
    kind: "Up",
    blurb: "Light dots lift off and fade, like drifting embers.",
  },
  {
    id: "evaporate",
    name: "Evaporate",
    kind: "Rim",
    blurb: "Dots on the outline dissolve straight outward from centre.",
  },
  {
    id: "drift",
    name: "Drift",
    kind: "Sides",
    blurb: "Light dots wander off in their own direction and fade.",
  },
  {
    id: "stream",
    name: "Stream",
    kind: "Below",
    blurb: "A steady trickle keeps shedding from the lower edge.",
  },
  {
    id: "breeze",
    name: "Breeze",
    kind: "Sides",
    blurb: "The head leans on a breeze; trailing-edge dots peel off.",
  },
  {
    id: "lift",
    name: "Lift",
    kind: "Up",
    blurb: "Dots near the base rise up off the shoulders and fade.",
  },
  {
    id: "sparkle",
    name: "Sparkle",
    kind: "In place",
    blurb: "Scattered dots wink out where they sit, then return.",
  },
  {
    id: "sway",
    name: "Sway",
    kind: "Depth",
    blurb: "No shedding — just the gentle left↔right turn that shows depth.",
  },
];

export default function PortraitMotion() {
  const [ambient, setAmbient] = useState<Ambient>("fall");
  const [replay, setReplay] = useState(0);

  const pick = (m: Ambient) => {
    setAmbient(m);
    setReplay((r) => r + 1);
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            Portrait — continuous motion
          </p>
          <h1 className="mt-4 font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em]">
            Always
            <br />
            alive
          </h1>
          <p className="mt-4 max-w-sm text-muted-fg text-sm leading-relaxed">
            A sparse few dots peel away and fade into the page, then quietly
            respawn — so the portrait always stays clear. Throughout, the head
            turns a little left and right to show its depth.
          </p>

          <ul className="mt-8 grid gap-1">
            {MODES.map((m, i) => {
              const activeMode = m.id === ambient;
              return (
                <li key={m.id}>
                  <button
                    className={`group flex w-full items-baseline gap-4 border-border border-b py-3 text-left transition-colors ${
                      activeMode ? "border-accent" : "hover:border-fg/30"
                    }`}
                    onClick={() => pick(m.id)}
                    type="button"
                  >
                    <span
                      className={`text-xs tabular-nums ${activeMode ? "text-accent" : "text-muted-fg"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`text-base tracking-tight ${activeMode ? "text-accent" : "text-fg"}`}
                      >
                        {m.name}
                      </span>
                      <span className="ml-3 text-[0.7rem] text-muted-fg uppercase tracking-[0.2em]">
                        {m.kind}
                      </span>
                      <span className="mt-0.5 block text-muted-fg text-sm">
                        {m.blurb}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            className="group mt-6 inline-flex items-center gap-2 text-[0.7rem] text-accent uppercase tracking-[0.3em]"
            onClick={() => setReplay((r) => r + 1)}
            type="button"
          >
            <span aria-hidden="true">↻</span> Restart
          </button>
        </div>

        <div className="order-1 lg:order-2">
          <VoxelPortrait
            ambient={ambient}
            className="mx-auto h-[52vh] w-full max-w-[440px] lg:h-[68vh]"
            key={`${ambient}-${replay}`}
            motion="none"
          />
        </div>
      </div>
    </main>
  );
}
