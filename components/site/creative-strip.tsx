"use client";

import { useState } from "react";

import { CoordinatedVideo } from "@/components/media/coordinated-video";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/site/section-header";
import type { MediaItem, WorkItem } from "@/content/types";

/**
 * Creative work as a compact strip rather than a chapter.
 *
 * It used to be a full gallery with the same weight as Selected Work and the
 * harness map: cursor-lean tiles, a page-wide blur on hover, a card-stack
 * fallback, and a 3.1MB clip that autoplayed as soon as it scrolled into view.
 * For a reader deciding in under a minute whether to reply, that's a lot of page
 * spent on work that supports the argument rather than making it. This keeps the
 * evidence — the eye, the range — at one row's worth of space.
 *
 * Film plays on tap, not on sight: nothing is fetched until someone asks.
 */
export function CreativeStrip({ items }: { items: WorkItem[] }) {
  return (
    <>
      <SectionHeader
        dividerCount={28}
        lead="Film and graphic design I make away from engineering."
        title="Creative work"
      />
      <Reveal className="mt-10">
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {items.map((item) => (
            <Entry item={item} key={item.slug} />
          ))}
        </div>
      </Reveal>
    </>
  );
}

function Entry({ item }: { item: WorkItem }) {
  const video = item.media?.kind === "video" ? item.media : null;
  const stills = item.gallery ?? [];

  return (
    <figure className="flex flex-col">
      {video ? <PosterVideo media={video} /> : <Stills stills={stills} />}
      <figcaption className="mt-4">
        <p className="text-[0.7rem] text-accent uppercase tracking-[0.22em]">
          {item.title}
        </p>
        <p className="mt-2 max-w-md text-muted-fg text-sm leading-relaxed">
          {item.summary}
        </p>
      </figcaption>
    </figure>
  );
}

/** The stills as one row, sized to the strip rather than to a hero. */
function Stills({ stills }: { stills: { src: string; alt: string }[] }) {
  return (
    <div className="flex gap-3">
      {stills.map((s) => (
        <img
          alt={s.alt}
          className="min-w-0 flex-1 border border-border object-cover"
          key={s.src}
          loading="lazy"
          src={s.src}
          style={{ aspectRatio: "4 / 5" }}
        />
      ))}
    </div>
  );
}

/**
 * A still that becomes a clip on tap. `play` is controlled, so CoordinatedVideo
 * fetches nothing until the visitor asks for it — the clip is 3.1MB, and it used
 * to arrive unrequested on a phone.
 */
function PosterVideo({
  media,
}: {
  media: Extract<MediaItem, { kind: "video" }>;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <button
      aria-label={playing ? `Pause: ${media.alt}` : `Play: ${media.alt}`}
      aria-pressed={playing}
      className="group relative block w-full overflow-hidden border border-border transition-transform active:scale-[0.99]"
      onClick={() => setPlaying((p) => !p)}
      style={{ aspectRatio: `${media.width} / ${media.height}` }}
      type="button"
    >
      <div className="absolute inset-0">
        <CoordinatedVideo
          alt={media.alt}
          play={playing}
          poster={media.poster}
          src={media.src}
        />
      </div>
      {playing ? null : (
        <span className="absolute bottom-3 left-3 flex items-center gap-2 bg-bg/85 px-2.5 py-1.5 text-[0.6rem] text-fg uppercase tracking-[0.2em] transition-colors group-hover:text-accent">
          <span aria-hidden="true" className="text-accent">
            ▶
          </span>
          Play
        </span>
      )}
    </button>
  );
}
