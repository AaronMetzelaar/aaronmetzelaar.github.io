import { FilingsRule } from "@/app/explore/_shared/pull-link";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * A numbered section header in the "dossier" language: a cursor-reactive dot
 * rule (the page's blue-dot motif as a divider), a tracked-out index + kicker,
 * then the title at editorial scale. The eyebrow row carries an optional note.
 */
export function SectionHeader({
  index,
  kicker,
  title,
  note,
  className,
}: {
  index: string;
  kicker: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("font-terminal", className)}>
      <FilingsRule className="mb-8" count={56} />
      <Reveal>
        <div className="flex items-baseline justify-between gap-6">
          <p className="text-[0.7rem] uppercase tracking-[0.3em]">
            <span className="text-accent tabular-nums">{index}</span>
            <span className="ml-3 text-muted-fg">{kicker}</span>
          </p>
          {note ? (
            <p className="hidden max-w-[18rem] text-right text-[0.7rem] text-muted-fg uppercase leading-relaxed tracking-[0.18em] sm:block">
              {note}
            </p>
          ) : null}
        </div>
        <h2 className="mt-5 text-[clamp(2rem,5.5vw,3.5rem)] leading-[0.98] tracking-[-0.03em]">
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
