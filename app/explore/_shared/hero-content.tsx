import { site } from "@/content";
import { cn } from "@/lib/utils";
import { InteractiveName } from "./interactive-name";

/** Top line: just location + availability — no redundant name, no clock. */
export function StatusBar() {
  return (
    <div className="flex items-center justify-between border-border border-b py-5 text-[0.7rem] text-muted-fg uppercase tracking-[0.2em]">
      <span>{site.location}</span>
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
        />
        Available for work
      </span>
    </div>
  );
}

/** Hero text block — role, the cursor-reactive name, tagline, CTAs. */
export function HeroText({
  align = "left",
  className,
}: {
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "relative flex flex-col",
        centered ? "items-center text-center" : "items-start",
        className
      )}
    >
      <p className="text-accent text-xs uppercase tracking-[0.3em]">
        {site.role} — AI / Agentic
      </p>
      <h1 className="mt-6 font-bold text-[clamp(2.75rem,9.5vw,7rem)] leading-[0.95] tracking-[-0.045em]">
        <InteractiveName />
      </h1>
      <p className="mt-8 max-w-xl text-base text-fg/80 leading-relaxed sm:text-lg">
        {site.tagline}
      </p>
      <div
        className={cn(
          "mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm",
          centered && "justify-center"
        )}
      >
        <a className="group inline-flex items-center gap-2" href="#work">
          <span className="relative">
            Selected work
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
            />
          </span>
          <span
            aria-hidden="true"
            className="text-accent transition-transform group-hover:translate-y-0.5"
          >
            ↓
          </span>
        </a>
        <a
          className="text-muted-fg transition-colors hover:text-fg"
          href={`mailto:${site.email}`}
        >
          {site.email}
        </a>
      </div>
    </div>
  );
}
