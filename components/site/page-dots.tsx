import { cn } from "@/lib/utils";

const DOT = "radial-gradient(currentColor 1px, transparent 1.7px)";

/**
 * The page's fine-dot texture — a faint, static blue grid behind everything.
 *
 * The cursor-following "pool" that used to track the pointer site-wide was
 * removed on purpose: in the one dot language, dots are texture by default and
 * the single cursor-reactive dot moment is the hero portrait. This is now pure,
 * pointer-free CSS. Render once near the top of a page's <main> (it's
 * `fixed inset-0 z-0`); keep content in a `relative z-10` wrapper and avoid
 * opaque section backgrounds so the texture shows through.
 */
export function PageDots({
  className,
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 text-accent",
        className
      )}
      style={{
        backgroundImage: DOT,
        backgroundSize: `${size}px ${size}px`,
        opacity: 0.05,
      }}
    />
  );
}
