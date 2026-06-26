"use client";

import { useEffect, useState } from "react";

import { VoxelPortrait } from "./voxel-portrait";

// Full-bleed dot portrait behind the hero. The entrance now lives in the
// preloader: its ring of dots assembles into the portrait at this exact framing
// (anchorX / camZ below), then the overlay dissolves onto this resting head — so
// here the portrait just rests. Interactive on both pointer types — drag to turn
// the head; on touch a horizontal drag turns it, a vertical swipe still scrolls.
// (gateReveal kept for API compatibility; the resting portrait needs no gate.)
export function HeroPortrait({ gateReveal = false }: { gateReveal?: boolean }) {
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  void gateReveal;

  return (
    <div className="absolute inset-0">
      <VoxelPortrait
        anchorX={desktop ? 1.05 : 0}
        camZ={desktop ? 4.8 : 4.0}
        className="h-full w-full"
        motion="none"
      />
    </div>
  );
}
