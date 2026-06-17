"use client";

import { useEffect, useState } from "react";
import { VoxelPortrait } from "./_voxel-portrait";

// Full-bleed dot portrait behind the hero: on load the dots fly in from across
// the whole page and assemble into the portrait on the right. On desktop it's
// interactive (scatter/tilt); on touch it's pass-through so the page scrolls.
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
    <div className={`absolute inset-0 ${desktop ? "" : "pointer-events-none"}`}>
      <VoxelPortrait
        anchorX={desktop ? 1.05 : 0}
        camZ={desktop ? 4.8 : 4.0}
        className="h-full w-full"
        motion="assemble"
        spread={desktop ? 3 : 2.2}
      />
    </div>
  );
}
