"use client";

import { premiumTheme } from "@/lib/premium-theme";

import { SwirlLoader } from "../headers/_swirl-field";

export default function LoaderExplorer() {
  return (
    <main
      className="relative grid min-h-screen place-items-center overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <p className="absolute top-8 left-8 text-accent text-xs uppercase tracking-[0.3em]">
        Loading state — dot swirl
      </p>
      <SwirlLoader label="Loading" width={560} />
    </main>
  );
}
