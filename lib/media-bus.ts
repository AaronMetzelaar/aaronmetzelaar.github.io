"use client";

import { useSyncExternalStore } from "react";

// A tiny global "which media is hovered" bus so the page only ever animates one
// piece of media at a time: a video plays when it's in view AND nothing else is
// hovered (or it itself is). Hovering any other media — another video, the
// social stills — pauses it. Keeps simultaneous decode/playback down.
let hoveredId: string | null = null;
const subscribers = new Set<() => void>();

export function setHoveredMedia(id: string | null) {
  if (hoveredId === id) {
    return;
  }
  hoveredId = id;
  for (const cb of subscribers) {
    cb();
  }
}

// Clear only if we still own the hover (avoids a leaving element clobbering the
// element the pointer just entered).
export function clearHoveredMedia(id: string) {
  if (hoveredId === id) {
    setHoveredMedia(null);
  }
}

function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export function useHoveredMedia(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => hoveredId,
    () => null
  );
}
