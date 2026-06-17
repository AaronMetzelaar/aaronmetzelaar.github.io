import { HoloCard } from "@/app/explore/_shared/holo-card";
import { Reveal } from "@/components/motion/reveal";
import type { WorkItem } from "@/content/types";

/**
 * A compact card for the Creative section: index + title, a short summary, and
 * tags. Wrapped in a restrained "blue" HoloCard so the card catches a soft
 * accent sheen and lifts under the cursor — the one signature flourish of the
 * "beyond code" section. On touch / reduced motion it's a clean bordered block
 * with a gentle hover-lift (HoloCard's built-in fallback).
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
    <Reveal className="h-full" delay={delay}>
      <HoloCard className="h-full" tone="blue">
        <article className="flex h-full flex-col p-6">
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
      </HoloCard>
    </Reveal>
  );
}
