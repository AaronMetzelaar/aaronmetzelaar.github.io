import { FilingsRule } from "@/components/site/pull-link";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Meta = { k: string; v: string };

/**
 * A numbered section header in the "dossier" language. One component, three
 * densities so the page reads as one running document whose entries differ in
 * KIND rather than as six different layouts:
 *  - "default"   — a big editorial noun title (Work, Creative)
 *  - "statement" — a lead sentence as the header + a baseline axis rule (About, AI)
 *  - "record"    — a small record label + a mono label/value spec table (Thesis)
 * The eyebrow (index + kicker + note) and the cursor-reactive dot divider stay
 * identical across all three so they cohere; `dividerCount` varies the divider
 * length as a rhythm signal (short before quiet sections, full before heavy).
 */
export function SectionHeader({
  index,
  kicker,
  title,
  note,
  className,
  density = "default",
  dividerCount = 56,
  divider = true,
  meta,
  lead,
  hint,
}: {
  index: string;
  kicker: string;
  title: string;
  note?: string;
  className?: string;
  density?: "default" | "statement" | "record";
  dividerCount?: number;
  /** Show the dot rule above the header. Off where a section edge already divides (the dark chapter). */
  divider?: boolean;
  meta?: Meta[];
  /** A short line under the title saying what the section is. */
  lead?: string;
  /** A small accent cue telling the reader how to interact with the section. */
  hint?: string;
}) {
  return (
    <div className={cn("font-terminal", className)}>
      {divider ? <FilingsRule className="mb-8" count={dividerCount} /> : null}
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

        {density === "record" ? (
          <div className="mt-5">
            <h2 className="max-w-2xl text-pretty text-[clamp(1.2rem,2.4vw,1.65rem)] leading-[1.2] tracking-[-0.01em]">
              {title}
            </h2>
            {meta && meta.length > 0 ? (
              <dl className="mt-6 grid gap-x-12 border-border border-t sm:grid-cols-2">
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
        ) : density === "statement" ? (
          <h2 className="mt-5 max-w-3xl text-pretty text-[clamp(1.6rem,3.8vw,2.7rem)] leading-[1.12] tracking-[-0.02em]">
            {title}
          </h2>
        ) : (
          <h2 className="mt-5 text-[clamp(2rem,5.5vw,3.5rem)] leading-[0.98] tracking-[-0.03em]">
            {title}
          </h2>
        )}

        {lead ? (
          <p className="mt-5 max-w-2xl text-muted-fg leading-relaxed">{lead}</p>
        ) : null}
        {hint ? (
          <p className="mt-5 flex items-center gap-2 text-[0.7rem] text-accent uppercase tracking-[0.25em]">
            <span aria-hidden="true">↳</span>
            {hint}
          </p>
        ) : null}
      </Reveal>
    </div>
  );
}
