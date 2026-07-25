import { Reveal } from "@/components/motion/reveal";
import { FilingsRule } from "@/components/site/pull-link";
import { cn } from "@/lib/utils";

type Meta = { k: string; v: string };

/**
 * A section header in the "dossier" language. One component, two densities so
 * the page reads as one running document whose entries differ in KIND rather
 * than as six different layouts:
 *  - "default"   — a big editorial noun title (Work, Creative)
 *  - "record"    — a small record label + a mono label/value spec table (Thesis)
 * The cursor-reactive dot divider stays identical across both so they cohere;
 * `dividerCount` varies the divider length as a rhythm signal (short before
 * quiet sections, full before heavy).
 *
 * This used to carry an eyebrow: an ordinal, a kicker, and a right-aligned note,
 * on every section. Six sections' worth of `01 · PROFILE` made the label layer
 * as loud as the work, and the ordinals numbered a sequence nobody needs to
 * count. The title carries the section now; its position on the page carries the
 * order.
 */
export function SectionHeader({
  title,
  className,
  density = "default",
  dividerCount = 56,
  divider = true,
  meta,
  lead,
}: {
  title: string;
  className?: string;
  density?: "default" | "record";
  dividerCount?: number;
  /** Show the dot rule above the header. Off where a section edge already divides (the dark chapter). */
  divider?: boolean;
  meta?: Meta[];
  /** A short line under the title saying what the section is. */
  lead?: string;
}) {
  return (
    <div className={cn("font-terminal", className)}>
      {divider ? <FilingsRule className="mb-8" count={dividerCount} /> : null}
      <Reveal>
        {density === "record" ? (
          <div>
            <h2 className="max-w-2xl text-pretty text-[clamp(1.2rem,2.4vw,1.65rem)] leading-[1.2] tracking-[-0.01em]">
              {title}
            </h2>
            {meta && meta.length > 0 ? (
              // one rule between rows, not a rule above AND below every row
              <dl className="mt-6 grid gap-x-12 sm:grid-cols-2">
                {meta.map((m) => (
                  <div
                    className="flex items-baseline justify-between gap-6 border-border border-b py-2.5"
                    key={m.k}
                  >
                    <dt className="text-[0.6rem] text-muted-fg uppercase tracking-[0.2em]">
                      {m.k}
                    </dt>
                    <dd className="text-right text-sm tracking-tight">{m.v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : (
          <h2 className="text-[clamp(2rem,5.5vw,3.5rem)] leading-[0.98] tracking-[-0.03em]">
            {title}
          </h2>
        )}

        {lead ? (
          <p className="mt-5 max-w-2xl text-muted-fg leading-relaxed">{lead}</p>
        ) : null}
      </Reveal>
    </div>
  );
}
