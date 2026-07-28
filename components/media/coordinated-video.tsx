"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import {
  clearHoveredMedia,
  setHoveredMedia,
  useHoveredMedia,
} from "@/lib/media-bus";
import { cn } from "@/lib/utils";

/**
 * A muted, looping clip that fills its container and plays only when it earns
 * it: in the viewport AND not while some other media is hovered (the media bus).
 * Hovering it makes it the one playing piece and pauses the rest. Reduced motion
 * / no playback → the poster still. Wrap it in a box that sets the aspect.
 *
 * A poster overlay is held on top of the video until it has actually rendered a
 * frame (the `playing` event), then cross-fades out. Without it, the native
 * poster is dropped the instant `play()` is called — before the first frame is
 * decoded — flashing an empty frame as the clip scrolls into view. The clip is
 * also warm-loaded just ahead of the viewport so that handoff is quick.
 */
export function CoordinatedVideo({
  src,
  poster,
  alt,
  className,
  play,
  preload: preloadNow,
  onStarted,
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  /**
   * Controlled mode: when provided, the clip plays iff `play` (and in view), and
   * the parent owns hover (e.g. a gallery tile). Omit it for autonomous mode —
   * plays in view unless another media is hovered, broadcasting its own hover.
   */
  play?: boolean;
  /**
   * Start fetching without playing. A controlled clip otherwise waits for `play`
   * before it touches the network, so the first tap paid for the whole download
   * and felt broken. Set this on hover or focus — intent, not sight — and the
   * bytes are there by the time someone clicks.
   */
  preload?: boolean;
  /** Fires when the first frame is painted, so a parent can drop its own affordance. */
  onStarted?: () => void;
}) {
  const id = useId();
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = !!useReducedMotion();
  const [inView, setInView] = useState(false);
  // Begin buffering once near the viewport (drives the `preload` attribute via
  // state so it matches the server render at hydration, then upgrades cleanly).
  const [warm, setWarm] = useState(false);
  // Whether the video has painted a frame yet. Until then the poster overlay
  // stays opaque so the poster→video handoff never flashes an empty frame.
  const [started, setStarted] = useState(false);
  const hovered = useHoveredMedia();
  const autonomous = play === undefined;

  const shouldPlay =
    !reduced &&
    inView &&
    (autonomous ? hovered === null || hovered === id : play);

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

  // Warm-load just before the clip enters view (`preload="none"` keeps offscreen
  // clips from fetching). By the time it's asked to play, frames are buffered,
  // so the poster overlay lifts almost immediately instead of stalling on a
  // network fetch.
  //
  // Controlled clips warm only once asked (`play`) or once the parent signals
  // intent (`preload`, e.g. hover). Warming every controlled clip on sight is
  // what used to pull ~10MB of video across a phone scroll for tiles nobody
  // opened; waiting for the click alone is what made the first play feel broken.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      return;
    }
    // Asked for, by intent or by playing: fetch now. Whoever asked is looking at
    // it, so there's nothing to wait for.
    if (preloadNow || play) {
      setWarm(true);
      return;
    }
    // Controlled and not asked: stay cold.
    if (!autonomous) {
      return;
    }
    // Autonomous: fetch just before it arrives, so playback starts on sight.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWarm(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, autonomous, play, preloadNow]);

  // Kick off the actual fetch once warmed. `load()` is a method call, not a
  // React-tracked attribute, so it's safe to run imperatively post-hydration.
  useEffect(() => {
    if (warm) {
      ref.current?.load();
    }
  }, [warm]);

  // Drop the hover claim if this clip goes away while holding it — a gallery
  // swapping layouts (collage <-> card stack) used to leave the bus pointing at
  // an id that no longer exists, which pauses every remaining clip forever.
  useEffect(
    () => () => {
      clearHoveredMedia(id);
    },
    [id]
  );

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
    <div className="relative h-full w-full">
      <video
        aria-label={alt}
        className={cn("h-full w-full object-cover", className)}
        loop
        muted
        onPlaying={() => {
          setStarted(true);
          onStarted?.();
        }}
        onPointerEnter={autonomous ? () => setHoveredMedia(id) : undefined}
        onPointerLeave={autonomous ? () => clearHoveredMedia(id) : undefined}
        playsInline
        poster={poster}
        preload={warm ? "auto" : "none"}
        ref={ref}
      >
        <source src={src} />
      </video>
      {/* biome-ignore lint/performance/noImgElement: poster overlay, matches the video box exactly */}
      <img
        alt=""
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          started ? "opacity-0" : "opacity-100"
        )}
        src={poster}
      />
    </div>
  );
}
