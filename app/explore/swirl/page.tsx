"use client";

import { useState } from "react";

import { premiumTheme } from "@/lib/premium-theme";

import { SwirlField } from "../headers/_swirl-field";

const GAPS = [
  { label: "Dense", value: 22 },
  { label: "Medium", value: 30 },
  { label: "Sparse", value: 42 },
];

export default function SwirlExplorer() {
  const [gap, setGap] = useState(30);
  const [mono, setMono] = useState(true);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      {/* full-bleed dot background */}
      <div className="absolute inset-0">
        <SwirlField gap={gap} mono={mono} />
      </div>

      {/* overlay: title + controls */}
      <div className="pointer-events-none relative z-10 flex min-h-screen flex-col justify-between p-6 sm:p-10">
        <div>
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            Background — dot swirl
          </p>
          <h1 className="mt-4 max-w-xl font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em]">
            The gif, in dots
          </h1>
          <p className="mt-4 max-w-md text-muted-fg text-sm leading-relaxed">
            A fixed grid of dots filling the background; each dot's size follows
            the swirl's tone as it plays. The dots never move.
          </p>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-end gap-6">
          <div>
            <p className="mb-2 text-[0.7rem] text-muted-fg uppercase tracking-[0.2em]">
              Density
            </p>
            <div className="flex gap-2">
              {GAPS.map((gpt) => (
                <button
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    gap === gpt.value
                      ? "border-accent text-accent"
                      : "border-border text-muted-fg hover:border-fg/30"
                  }`}
                  key={gpt.label}
                  onClick={() => setGap(gpt.value)}
                  type="button"
                >
                  {gpt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[0.7rem] text-muted-fg uppercase tracking-[0.2em]">
              Colour
            </p>
            <div className="flex gap-2">
              <button
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  mono
                    ? "border-accent text-accent"
                    : "border-border text-muted-fg hover:border-fg/30"
                }`}
                onClick={() => setMono(true)}
                type="button"
              >
                Mono blue
              </button>
              <button
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  mono
                    ? "border-border text-muted-fg hover:border-fg/30"
                    : "border-accent text-accent"
                }`}
                onClick={() => setMono(false)}
                type="button"
              >
                Gif colour
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
