"use client";

import { useState } from "react";

import { MediaFrame } from "@/components/media/media-frame";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Touch / reduced-motion presentation for a set of work items: a stack of
 * tappable cards. Each one reads at a glance — title, one-line tagline, the tag
 * row — and expands on tap for what was built. This is the touch interface, not
 * a fallback: everything the desktop collage reveals on hover is reachable here
 * by tap, which is why the tags sit outside the expanded block and the card
 * carries a visible pressed state.
 *
 * Video is opt-in. A collapsed card shows its poster with a PLAY affordance and
 * fetches nothing; opening the card starts the clip and collapsing it stops.
 * Autoplaying every tile in view cost a phone visitor ~10MB of video across a
 * single scroll of the page.
 *
 * Shared by Selected Work and Creative so both behave the same on touch.
 */
export function WorkList({ items }: { items: WorkItem[] }) {
  // start collapsed: each card reads at a glance (image + title + one line),
  // and the "More" toggle invites the tap that reveals what was built.
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        // portrait clips (the vertical promo film) would otherwise become an
        // absurdly tall card on a wide touch screen — cap their width
        const portrait = !!item.media && item.media.width < item.media.height;
        const hero = item.gallery?.[0];
        const extras = item.gallery?.slice(1) ?? [];
        return (
          <li
            className={cn(
              "overflow-hidden border bg-bg transition-colors duration-300",
              isOpen ? "border-accent/60" : "border-border"
            )}
            key={item.slug}
          >
            <button
              aria-expanded={isOpen}
              className="group block w-full text-left transition-[transform,opacity] duration-200 active:scale-[0.99] active:opacity-90"
              onClick={() => setOpen((c) => (c === i ? null : i))}
              type="button"
            >
              <div className={cn("relative", portrait && "mx-auto max-w-sm")}>
                {item.media || !hero ? (
                  <MediaFrame
                    aspect={2 / 1}
                    className="w-full"
                    label={item.slug}
                    media={item.media}
                    minimal
                    play={isOpen}
                  />
                ) : (
                  <div
                    aria-label={hero.alt}
                    className="mx-auto aspect-[4/5] w-full max-w-sm bg-bg bg-center bg-cover"
                    role="img"
                    style={{ backgroundImage: `url(${hero.src})` }}
                  />
                )}
                {/* says what the tap gets you: a still that becomes a clip.
                    Hidden once it's playing — the motion is its own signal. */}
                {item.media?.kind === "video" && !isOpen ? (
                  <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 bg-bg/85 px-2.5 py-1.5 font-terminal text-[0.6rem] text-fg uppercase tracking-[0.2em]">
                    <span aria-hidden="true" className="text-accent">
                      ▶
                    </span>
                    Play
                  </span>
                ) : null}
                {/* the extra stills exist; say how many so the tap has a promise */}
                {extras.length > 0 && !isOpen ? (
                  <span className="pointer-events-none absolute bottom-3 left-3 bg-bg/85 px-2.5 py-1.5 font-terminal text-[0.6rem] text-fg uppercase tracking-[0.2em]">
                    <span aria-hidden="true" className="text-accent">
                      +{extras.length}{" "}
                    </span>
                    more
                  </span>
                ) : null}
              </div>

              <div className="flex items-start justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                  <p className="font-terminal text-[0.82rem] text-accent uppercase tracking-[0.22em]">
                    {item.title.toUpperCase()}
                  </p>
                  {item.tagline ? (
                    <p className="mt-1.5 text-pretty text-muted-fg text-sm leading-relaxed">
                      {item.tagline}
                    </p>
                  ) : null}
                  {/* the tag row reads before the tap, not after it: on the
                      desktop collage these are hover-revealed, and a phone has
                      no hover to reveal them with */}
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {item.tags.map((t) => (
                      <li
                        className="font-terminal text-[0.6rem] text-muted-fg uppercase tracking-[0.2em]"
                        key={t}
                      >
                        <span aria-hidden="true" className="text-accent/55">
                          →{" "}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* affordance: a labelled toggle so it's clearly tappable */}
                <span className="mt-0.5 flex shrink-0 items-center gap-1.5 font-terminal text-[0.6rem] text-muted-fg uppercase tracking-[0.16em]">
                  {isOpen ? "Less" : "More"}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-accent transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  >
                    ⌄
                  </span>
                </span>
              </div>
            </button>

            {isOpen ? (
              <div className="px-4 pb-5">
                <p className="text-muted-fg text-sm leading-relaxed">
                  {item.summary}
                </p>
                {item.highlights && item.highlights.length > 0 ? (
                  <ul className="mt-4 space-y-2.5 border-border border-t pt-4">
                    {item.highlights.map((h) => (
                      <li className="text-fg/80 text-sm leading-snug" key={h}>
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {extras.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {extras.map((g) => (
                      <div
                        aria-label={g.alt}
                        className="aspect-[4/5] border border-border bg-bg bg-center bg-cover"
                        key={g.src}
                        role="img"
                        style={{ backgroundImage: `url(${g.src})` }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
