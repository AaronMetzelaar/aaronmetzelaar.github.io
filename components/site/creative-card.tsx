"use client";

import { useId } from "react";

import { CoordinatedVideo } from "@/components/media/coordinated-video";
import { Reveal } from "@/components/motion/reveal";
import type { WorkItem } from "@/content/types";
import { clearHoveredMedia, setHoveredMedia } from "@/lib/media-bus";

/**
 * A media-forward Creative card. Shows the work itself, then the caption:
 *  - a looping muted video (promo films), playing only in view and pausing when
 *    any other media is hovered (CoordinatedVideo), or
 *  - a fan of stills where the first is the face and the rest peek out on hover
 *    (social posts); hovering it also pauses the videos via the media bus.
 * Stills are background images so a not-yet-added file degrades to an empty
 * plate rather than a broken-image glyph.
 */
export function CreativeCard({
  item,
  index,
  delay = 0,
}: {
  item: WorkItem;
  index: string;
  delay?: number;
}) {
  const id = useId();
  const gallery = item.gallery ?? [];
  const [hero, ...rest] = gallery;
  const peeks = [
    {
      src: rest[1]?.src,
      cls: "-rotate-[5deg] group-hover:-translate-x-[26%] group-hover:-translate-y-[7%] group-hover:-rotate-[11deg]",
    },
    {
      src: rest[0]?.src,
      cls: "rotate-[5deg] group-hover:translate-x-[26%] group-hover:-translate-y-[7%] group-hover:rotate-[11deg]",
    },
  ];
  const video = item.media?.kind === "video" ? item.media : null;
  // a still-fan counts as hovered media → pause the videos while it's hovered
  const hoverProps = video
    ? {}
    : {
        onPointerEnter: () => setHoveredMedia(id),
        onPointerLeave: () => clearHoveredMedia(id),
      };

  return (
    <Reveal className="h-full" delay={delay}>
      <article className="group flex h-full flex-col" {...hoverProps}>
        <div className="relative aspect-[4/5] w-full">
          {video ? (
            <div className="absolute inset-0 overflow-hidden border border-border">
              <CoordinatedVideo
                alt={video.alt}
                poster={video.poster}
                src={video.src}
              />
            </div>
          ) : (
            <>
              {peeks.map((peek, i) =>
                peek.src ? (
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 border border-border bg-bg bg-center bg-cover opacity-0 shadow-lg transition-all duration-500 ease-out group-hover:opacity-100 ${peek.cls}`}
                    key={i}
                    style={{ backgroundImage: `url(${peek.src})` }}
                  />
                ) : null
              )}
              {hero ? (
                <div
                  aria-label={hero.alt}
                  className="absolute inset-0 z-10 border border-border bg-bg bg-center bg-cover shadow-sm transition-transform duration-500 ease-out group-hover:-translate-y-[2%]"
                  role="img"
                  style={{ backgroundImage: `url(${hero.src})` }}
                />
              ) : null}
            </>
          )}
        </div>

        <div className="relative z-10 mt-5">
          <span className="text-accent text-xs tabular-nums tracking-[0.3em]">
            {index}
          </span>
          <h3 className="mt-3 text-xl leading-tight tracking-[-0.01em]">
            {item.title}
          </h3>
          <p className="mt-2 text-muted-fg text-sm leading-relaxed">
            {item.summary}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
            {item.tags.map((t) => (
              <li
                className="text-[0.68rem] text-muted-fg uppercase tracking-[0.18em]"
                key={t}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}
