import { Reveal } from "@/components/motion/reveal";
import type { WorkItem } from "@/content/types";

/**
 * A compact, media-less card for the more conceptual sections (AI, Creative):
 * index + title, a short summary, and tags. Reads as a tight typographic block.
 */
export function MiniCard({
  item,
  index,
  delay = 0,
}: {
  item: WorkItem;
  index: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="flex h-full flex-col border-border border-t pt-6">
        <span className="text-accent text-xs tabular-nums tracking-[0.3em]">
          {index}
        </span>
        <h3 className="mt-4 text-xl leading-tight tracking-[-0.01em]">
          {item.title}
        </h3>
        <p className="mt-3 text-muted-fg text-sm leading-relaxed">
          {item.summary}
        </p>
        <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-6">
          {item.tags.map((t) => (
            <li
              className="text-[0.68rem] text-muted-fg uppercase tracking-[0.18em]"
              key={t}
            >
              {t}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}
