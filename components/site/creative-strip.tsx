"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

import { CoordinatedVideo } from "@/components/media/coordinated-video";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/site/section-header";
import type { MediaItem, WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Creative work as one band: film first, then the poster series.
 *
 * The motion happens INSIDE each frame: the frame is a fixed window and scroll
 * drives the image within it, rather than sliding the tile around the page. Tiles
 * that drift as a whole only shift the layout, and they threaten to collide with
 * their neighbours on a narrow screen. The frames stay put; the pictures move.
 *
 * Sizing is set by the source material. The stills are 1440x1800 and can carry
 * width; the film is 540x960, so anything wider than ~270 CSS px upscales it on a
 * retina screen — which is how it first shipped at half the container and looked
 * soft. It's the small element, on the left.
 */

// The motion is a scroll-linked scale anchored to the TOP of each frame, not a
// vertical pan. Panning is geometrically incompatible with keeping the emblem:
// to pan, the image must be taller than its frame, so the frame's top edge always
// sits below the image's top edge, and the only offset that shows the emblem is
// zero — i.e. no movement. (Panning sideways doesn't save it either: widening a
// 4:5 image inside a 4:5 frame via object-cover crops it vertically again.)
//
// Scaling from `top center` pins the top edge. The crest and the "is een Ridder"
// line stay put at every scroll position; the crop happens at the bottom, plus a
// symmetric sliver off each side. Scale never goes below 1, so no frame can ever
// show an empty edge — the failure mode a pan had to be measured against.
const ZOOM = [1.06, 1.1, 1.08, 1.06];

// Width and vertical offset per frame at lg+. Below that the band is a plain
// two-column grid — a collage needs room a phone hasn't got.
const LAYER = [
  "lg:w-[22%] lg:mt-0", // the film
  "lg:w-[30%] lg:mt-14",
  "lg:w-[24%] lg:mt-4",
  "lg:w-[18%] lg:mt-20",
];

export function CreativeStrip({ items }: { items: WorkItem[] }) {
  const band = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  // 0 as the band's top meets the viewport bottom, 1 as its bottom leaves the top
  // Driven straight off scroll position, no spring in between. A spring here
  // decouples the pan from the input — it lags while you scroll and keeps moving
  // after you stop, which feels mushy rather than smooth. Smooth-scroll libraries
  // (Lenis) get their feel by smoothing the scroll position everything reads,
  // not by damping one effect downstream of it.
  const { scrollYProgress: progress } = useScroll({
    target: band,
    offset: ["start end", "end start"],
  });

  const film = items.find((i) => i.media?.kind === "video");
  const video = film?.media?.kind === "video" ? film.media : null;
  const stills = items.flatMap((i) => i.gallery ?? []);

  // frame 0 is the film; the stills follow it, so their LAYER/ZOOM index is i + 1
  const at = (i: number) => ({
    className: cn("min-w-0", LAYER[i % LAYER.length]),
    zoom: reduced ? 1 : ZOOM[i % ZOOM.length],
  });

  return (
    <>
      <SectionHeader
        dividerCount={28}
        lead="Film and graphic design I make away from engineering."
        title="Creative work"
      />

      <Reveal className="mt-12">
        <div
          className="grid grid-cols-2 gap-4 lg:flex lg:items-start lg:gap-5"
          ref={band}
        >
          {video ? (
            <div className={at(0).className}>
              <Film progress={progress} video={video} zoom={at(0).zoom} />
            </div>
          ) : null}
          {stills.map((still, i) => (
            <div className={at(i + 1).className} key={still.src}>
              <Still progress={progress} still={still} zoom={at(i + 1).zoom} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* the two crafts, named once each, under the composition they describe */}
      <Reveal className="mt-10">
        <dl className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.slug}>
              <dt className="text-[0.7rem] text-accent uppercase tracking-[0.22em]">
                {item.title}
              </dt>
              <dd className="mt-2 max-w-md text-muted-fg text-sm leading-relaxed">
                {item.summary}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </>
  );
}

/** 1 at the start of the band's pass, `zoom` at the end. Never below 1. */
function useZoom(progress: MotionValue<number>, zoom: number) {
  return useTransform(progress, [0, 1], [1, zoom]);
}

// Anchored to the top edge, so the image grows downward and the emblem never moves.
const ANCHOR_TOP = { transformOrigin: "top center" };

function Still({
  still,
  zoom,
  progress,
}: {
  still: { src: string; alt: string };
  zoom: number;
  progress: MotionValue<number>;
}) {
  const scale = useZoom(progress, zoom);
  return (
    <div
      className="relative overflow-hidden border border-border"
      style={{ aspectRatio: "4 / 5" }}
    >
      <motion.img
        alt={still.alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        src={still.src}
        style={{ scale, ...ANCHOR_TOP }}
      />
    </div>
  );
}

/**
 * The film: a still until it's asked for. Hover or focus starts the fetch so the
 * click plays immediately; the label says "Loading" while the bytes are in
 * flight, because a poster sitting still after a tap reads as broken. The badge
 * sits outside the scaling layer, so it stays put while the picture grows.
 */
function Film({
  video,
  zoom,
  progress,
}: {
  video: Extract<MediaItem, { kind: "video" }>;
  zoom: number;
  progress: MotionValue<number>;
}) {
  const scale = useZoom(progress, zoom);
  const [playing, setPlaying] = useState(false);
  const [wanted, setWanted] = useState(false);
  const [started, setStarted] = useState(false);

  return (
    <button
      aria-label={playing ? `Pause: ${video.alt}` : `Play: ${video.alt}`}
      aria-pressed={playing}
      className="group relative block w-full overflow-hidden border border-border transition-transform active:scale-[0.99]"
      onClick={() => setPlaying((p) => !p)}
      onFocus={() => setWanted(true)}
      onPointerEnter={() => setWanted(true)}
      style={{ aspectRatio: `${video.width} / ${video.height}` }}
      type="button"
    >
      <motion.div className="absolute inset-0" style={{ scale, ...ANCHOR_TOP }}>
        <CoordinatedVideo
          alt={video.alt}
          onStarted={() => setStarted(true)}
          play={playing}
          poster={video.poster}
          preload={wanted}
          src={video.src}
        />
      </motion.div>
      {playing && started ? null : (
        <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-bg/85 px-2 py-1.5 text-[0.55rem] text-fg uppercase tracking-[0.18em] transition-colors group-hover:text-accent">
          <span aria-hidden="true" className="text-accent">
            ▶
          </span>
          {playing ? "Loading" : "Play"}
        </span>
      )}
    </button>
  );
}
