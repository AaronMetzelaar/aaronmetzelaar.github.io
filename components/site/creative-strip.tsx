"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

import { CoordinatedVideo } from "@/components/media/coordinated-video";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/site/section-header";
import type { MediaItem, WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Creative work as one parallax band: the poster series and the film in a single
 * composition that separates into layers as the page scrolls.
 *
 * Sizing is set by the source material, not by taste. The stills are 1440x1800,
 * so they can carry the width. The film is only 540x960, so anything wider than
 * ~270 CSS px upscales it on a retina screen — which is exactly how it got
 * shipped at half the container and looked soft. It's the small element here.
 *
 * It replaced a 330-line gallery with cursor-lean tiles, a page-wide hover blur,
 * a card-stack fallback and a 3.1MB autoplay. Parallax needs no pointer, so it's
 * the one effect on the page that works the same on a phone, and it's off under
 * prefers-reduced-motion.
 */

// How far each layer drifts across the band's pass through the viewport, in px.
// Mixed signs are the point: same-direction drift at different speeds reads as a
// wobble, opposite directions read as depth.
const DRIFT = [-54, 34, -30, 52];

// Widths and vertical offsets per layer at lg+. Below that the band becomes a
// plain two-column grid: overlap needs room, and a phone hasn't got it.
const LAYER = [
  "lg:w-[30%] lg:mt-0",
  "lg:w-[22%] lg:mt-16", // the film
  "lg:w-[25%] lg:mt-6",
  "lg:w-[18%] lg:mt-24",
];

export function CreativeStrip({ items }: { items: WorkItem[] }) {
  const band = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  // 0 as the band's top meets the viewport bottom, 1 as its bottom leaves the top
  const { scrollYProgress } = useScroll({
    target: band,
    offset: ["start end", "end start"],
  });

  const film = items.find((i) => i.media?.kind === "video");
  const video = film?.media?.kind === "video" ? film.media : null;
  const stills = items.flatMap((i) => i.gallery ?? []);

  // one flat list of layers: first still, the film, then the rest
  const layers: { key: string; node: ReactNode }[] = [];
  if (stills[0]) {
    layers.push({ key: stills[0].src, node: <Still still={stills[0]} /> });
  }
  if (video) {
    layers.push({ key: "film", node: <Film video={video} /> });
  }
  for (const s of stills.slice(1)) {
    layers.push({ key: s.src, node: <Still still={s} /> });
  }

  return (
    <>
      <SectionHeader
        dividerCount={28}
        lead="Film and graphic design I make away from engineering."
        title="Creative work"
      />

      <Reveal className="mt-12">
        <div
          className="grid grid-cols-2 gap-4 lg:flex lg:items-start lg:gap-6"
          ref={band}
        >
          {layers.map((layer, i) => (
            <ParallaxLayer
              className={LAYER[i % LAYER.length]}
              drift={reduced ? 0 : DRIFT[i % DRIFT.length]}
              key={layer.key}
              progress={scrollYProgress}
            >
              {layer.node}
            </ParallaxLayer>
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

/** One parallax layer. Transform only, so the drift stays off the main thread. */
function ParallaxLayer({
  children,
  className,
  drift,
  progress,
}: {
  children: ReactNode;
  className?: string;
  drift: number;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], [-drift, drift]);
  return (
    <motion.div className={cn("min-w-0", className)} style={{ y }}>
      {children}
    </motion.div>
  );
}

function Still({ still }: { still: { src: string; alt: string } }) {
  return (
    <img
      alt={still.alt}
      className="w-full border border-border object-cover"
      loading="lazy"
      src={still.src}
      style={{ aspectRatio: "4 / 5" }}
    />
  );
}

/**
 * The film: a still until it's asked for. Hover or focus starts the fetch so the
 * click plays immediately; the label says "Loading" while the bytes are in
 * flight, because a poster that sits there after a tap reads as broken.
 */
function Film({ video }: { video: Extract<MediaItem, { kind: "video" }> }) {
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
      <div className="absolute inset-0">
        <CoordinatedVideo
          alt={video.alt}
          onStarted={() => setStarted(true)}
          play={playing}
          poster={video.poster}
          preload={wanted}
          src={video.src}
        />
      </div>
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
