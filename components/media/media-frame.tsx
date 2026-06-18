"use client";

import Image from "next/image";

import { CoordinatedVideo } from "@/components/media/coordinated-video";
import type { MediaItem } from "@/content/types";
import { cn } from "@/lib/utils";

type MediaFrameProps = {
  /** When omitted, a labelled placeholder slot renders (video-ready later). */
  media?: MediaItem;
  /** Label shown on the placeholder slot. */
  label?: string;
  /** width / height ratio for the placeholder + video box. */
  aspect?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Clean, ornament-free placeholder for refined/premium layouts. */
  minimal?: boolean;
};

const DEFAULT_SIZES = "(max-width: 768px) 100vw, 640px";

/**
 * Renders a screenshot today, a muted autoplay-loop video later — same box,
 * no layout shift. Swap by changing the `media` data only (kind: image|video).
 */
export function MediaFrame({
  media,
  label,
  aspect = 16 / 9,
  className,
  priority,
  sizes = DEFAULT_SIZES,
  minimal,
}: MediaFrameProps) {
  if (!media) {
    return (
      <MediaPlaceholder
        aspect={aspect}
        className={className}
        label={label}
        minimal={minimal}
      />
    );
  }

  const ratio = media.width / media.height;

  if (media.kind === "image") {
    return (
      <div
        className={cn("relative overflow-hidden", className)}
        style={{ aspectRatio: String(ratio) }}
      >
        <Image
          alt={media.alt}
          className="object-cover"
          fill
          priority={priority}
          sizes={sizes}
          src={media.src}
        />
      </div>
    );
  }

  return <LazyVideo className={className} media={media} ratio={ratio} />;
}

function MediaPlaceholder({
  aspect,
  label,
  className,
  minimal,
}: {
  aspect: number;
  label?: string;
  className?: string;
  minimal?: boolean;
}) {
  if (minimal) {
    return (
      <div
        className={cn(
          "group relative flex items-center justify-center overflow-hidden border border-border bg-bg transition-colors duration-300 hover:border-accent/40",
          className
        )}
        style={{ aspectRatio: String(aspect) }}
      >
        {/* fine dot grid — the site's texture, brightening on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 text-accent opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.13]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1.6px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* blueprint crop marks */}
        {[
          "top-2 left-2 border-t border-l",
          "top-2 right-2 border-t border-r",
          "bottom-2 left-2 border-b border-l",
          "right-2 bottom-2 border-r border-b",
        ].map((c) => (
          <span
            aria-hidden="true"
            className={cn(
              "absolute h-3 w-3 border-border transition-colors duration-300 group-hover:border-accent/50",
              c
            )}
            key={c}
          />
        ))}
        <span className="relative font-terminal text-[0.6rem] text-muted-fg uppercase tracking-[0.3em] transition-colors duration-300 group-hover:text-accent">
          {label ?? "image"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-border bg-muted text-muted-fg",
        className
      )}
      style={{ aspectRatio: String(aspect) }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 7px, currentColor 7px, currentColor 8px)",
        }}
      />
      <span className="relative z-10 font-mono text-[0.65rem] uppercase tracking-[0.2em]">
        {label ?? "media"}
      </span>
    </div>
  );
}

function LazyVideo({
  media,
  ratio,
  className,
}: {
  media: Extract<MediaItem, { kind: "video" }>;
  ratio: number;
  className?: string;
}) {
  // playback (in-view + hover coordination + reduced-motion poster) lives in
  // CoordinatedVideo; this just sets the box.
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: String(ratio) }}
    >
      <CoordinatedVideo alt={media.alt} poster={media.poster} src={media.src} />
    </div>
  );
}
