"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { clearHoveredMedia, setHoveredMedia, useHoveredMedia } from "@/lib/media-bus";
import { cn } from "@/lib/utils";

/**
 * A muted, looping clip that fills its container and plays only when it earns
 * it: in the viewport AND not while some other media is hovered (the media bus).
 * Hovering it makes it the one playing piece and pauses the rest. Reduced motion
 * / no playback → the poster still. Wrap it in a box that sets the aspect.
 */
export function CoordinatedVideo({
  src,
  poster,
  alt,
  className,
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = !!useReducedMotion();
  const [inView, setInView] = useState(false);
  const hovered = useHoveredMedia();

  const shouldPlay =
    !reduced && inView && (hovered === null || hovered === id);

  // track in-view
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // play/pause to match the resolved state
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (shouldPlay) {
      el.play().catch(() => undefined); // autoplay may be blocked; ignore
    } else {
      el.pause();
    }
  }, [shouldPlay]);

  if (reduced) {
    return (
      // biome-ignore lint/performance/noImgElement: simple poster still, no layout system needed
      <img
        alt={alt}
        className={cn("h-full w-full object-cover", className)}
        src={poster}
      />
    );
  }

  return (
    <video
      aria-label={alt}
      className={cn("h-full w-full object-cover", className)}
      loop
      muted
      onPointerEnter={() => setHoveredMedia(id)}
      onPointerLeave={() => clearHoveredMedia(id)}
      playsInline
      poster={poster}
      preload="none"
      ref={ref}
    >
      <source src={src} />
    </video>
  );
}
