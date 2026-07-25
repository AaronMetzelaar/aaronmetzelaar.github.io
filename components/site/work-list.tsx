"use client";

import { useState } from "react";

import { MediaFrame } from "@/components/media/media-frame";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Touch / reduced-motion presentation for a set of work items: a stack of
 * tappable cards. Each one reads at a glance — number, title, one-line tagline —
 * and expands on tap to show what was built. Clear affordance so it's obviously
 * interactive. Shared by Selected Work and Creative work so both sections behave
 * the same on mobile.
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
              className="group block w-full text-left transition-[transform] duration-200 active:scale-[0.995]"
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
                  />
                ) : (
                  <div
                    aria-label={hero.alt}
                    className="mx-auto aspect-[4/5] w-full max-w-sm bg-bg bg-center bg-cover"
                    role="img"
                    style={{ backgroundImage: `url(${hero.src})` }}
                  />
                )}
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
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
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
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
