import { cn } from "@/lib/utils";

/**
 * A static dot grid layer — the hero's dot motif carried through the page.
 * Place inside a `relative` parent (it positions absolute inset-0). Faint and
 * neutral by default; `accent` makes the dots blue.
 */
export function DotGrid({
  className,
  accent,
  size = 24,
  opacity,
}: {
  className?: string;
  accent?: boolean;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        accent ? "text-accent" : "text-fg",
        className
      )}
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1.6px)",
        backgroundSize: `${size}px ${size}px`,
        opacity: opacity ?? (accent ? 0.12 : 0.06),
      }}
    />
  );
}
