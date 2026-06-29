"use client";

import { useEffect, useState } from "react";

import { VoxelPortrait } from "./voxel-portrait";

// Full-bleed dot portrait behind the hero. It just rests here — the preloader
// owns the entrance (its dots assemble into the portrait at this exact framing,
// then the overlay dissolves onto this resting head). Interactive on both
// pointer types: drag to turn the head; on touch a horizontal drag turns it, a
// vertical swipe still scrolls.
export function HeroPortrait() {
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="absolute inset-0">
      <VoxelPortrait
        anchorX={desktop ? 1.05 : 0}
        camZ={desktop ? 4.8 : 4.0}
        className="h-full w-full"
      />
    </div>
  );
}
