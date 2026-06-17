import { MediaFrame } from "@/components/media/media-frame";
import { Reveal } from "@/components/motion/reveal";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * A full work entry: index + title and metadata on the left, summary +
 * highlights below, and a media slot opposite. Alternating `reversed` puts the
 * media on the left for an asymmetric, editorial rhythm down the page.
 */
export function WorkEntry({
  item,
  index,
  reversed,
}: {
  item: WorkItem;
  index: string;
  reversed?: boolean;
}) {
  return (
    <Reveal>
      <article className="grid gap-8 border-border border-t pt-10 lg:grid-cols-2 lg:gap-14">
        <div className={cn("flex flex-col", reversed && "lg:order-2")}>
          <div className="flex items-baseline gap-4">
            <span className="text-accent text-xs tabular-nums tracking-[0.3em]">
              {index}
            </span>
            {item.period ? (
              <span className="text-[0.7rem] text-muted-fg uppercase tracking-[0.2em]">
                {item.period}
              </span>
            ) : null}
          </div>

          <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.02] tracking-[-0.02em]">
            {item.title}
          </h3>

          <p className="mt-5 max-w-md text-muted-fg text-sm leading-relaxed">
            {item.summary}
          </p>

          {item.highlights ? (
            <ul className="mt-6 space-y-2.5">
              {item.highlights.map((h) => (
                <li className="flex gap-3 text-sm leading-snug" key={h}>
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-3 shrink-0 bg-accent"
                  />
                  <span className="text-fg/80">{h}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-8">
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

        <div className={cn(reversed && "lg:order-1")}>
          <MediaFrame
            aspect={4 / 3}
            className="w-full"
            label={item.slug}
            media={item.media}
            minimal
          />
        </div>
      </article>
    </Reveal>
  );
}
