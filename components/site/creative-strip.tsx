"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
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
 * The parallax happens INSIDE each frame. Every tile is a fixed window with the
 * image oversized within it, and scroll pans the image behind the window rather
 * than sliding the tile around the page. Tiles that drift as a whole only shift
 * the layout; a frame that holds still while its image moves reads as depth, and
 * it can't collide with its neighbours. The frames stay put, the pictures move.
 *
 * Sizing is set by the source material. The stills are 1440x1800 and can carry
 * width; the film is 540x960, so anything wider than ~270 CSS px upscales it on a
 * retina screen — which is how it first shipped at half the container and looked
 * soft. It's the small element, on the left.
 */

// Image height inside each frame, and the slack that leaves above and below.
// PAN below is a percentage of the IMAGE's height, so the travel in frame terms
// is pan * 1.28 — keep it clear of SLACK or an empty edge shows at the extremes.
// At 128% the sides crop by 14%, and the "is een Ridder" line spans roughly 28%
// to 72% of the poster, so the type survives the crop.
// (The reference for this, bymonolog.com, does the same thing with a scale(1.15)
// image inside an overflow:clip parent.)
const OVERSIZE = "h-[128%]";
const SLACK = "-top-[14%]";

// Per-frame travel, in percent of image height, signed. Different rates and
// mixed directions: the same rate everywhere reads as one sheet sliding. Max
// here is 9, so 9 * 1.28 = 11.5% of the frame against 14% of slack — a couple of
// percent of headroom at every frame size rather than the 1px I first left.
const PAN = [-7, 9, -8, 9];

// Raw scroll position drives the pan one wheel-notch at a time, which reads as
// steppy. A spring on the progress value smooths it into a drift that lags the
// scroll slightly — the part of a Lenis-style page that actually sells the depth,
// without taking over the page's scrolling to get it.
const SMOOTH = { stiffness: 90, damping: 28, mass: 0.35, restDelta: 0.0005 };

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
  const { scrollYProgress } = useScroll({
    target: band,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, SMOOTH);

  const film = items.find((i) => i.media?.kind === "video");
  const video = film?.media?.kind === "video" ? film.media : null;
  const stills = items.flatMap((i) => i.gallery ?? []);

  // frame 0 is the film; the stills follow it, so their LAYER/PAN index is i + 1
  const at = (i: number) => ({
    className: cn("min-w-0", LAYER[i % LAYER.length]),
    pan: reduced ? 0 : PAN[i % PAN.length],
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
              <Film pan={at(0).pan} progress={progress} video={video} />
            </div>
          ) : null}
          {stills.map((still, i) => (
            <div className={at(i + 1).className} key={still.src}>
              <Still pan={at(i + 1).pan} progress={progress} still={still} />
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

/** Travel for one frame's image, as a percentage of that image's own height. */
function usePan(progress: MotionValue<number>, pan: number) {
  return useTransform(progress, [0, 1], [`${-pan}%`, `${pan}%`]);
}

function Still({
  still,
  pan,
  progress,
}: {
  still: { src: string; alt: string };
  pan: number;
  progress: MotionValue<number>;
}) {
  const y = usePan(progress, pan);
  return (
    <div
      className="relative overflow-hidden border border-border"
      style={{ aspectRatio: "4 / 5" }}
    >
      <motion.img
        alt={still.alt}
        className={cn(
          "absolute inset-x-0 w-full object-cover",
          OVERSIZE,
          SLACK
        )}
        loading="lazy"
        src={still.src}
        style={{ y }}
      />
    </div>
  );
}

/**
 * The film: a still until it's asked for. Hover or focus starts the fetch so the
 * click plays immediately; the label says "Loading" while the bytes are in
 * flight, because a poster sitting still after a tap reads as broken. The badge
 * is pinned to the frame, not to the panning image.
 */
function Film({
  video,
  pan,
  progress,
}: {
  video: Extract<MediaItem, { kind: "video" }>;
  pan: number;
  progress: MotionValue<number>;
}) {
  const y = usePan(progress, pan);
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
      <motion.div
        className={cn("absolute inset-x-0", OVERSIZE, SLACK)}
        style={{ y }}
      >
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
