import { cn } from "@/lib/utils";

/** Terminal-style blinking caret. Holds steady under reduced-motion. */
export function Cursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "cursor-blink ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.12em] bg-current align-baseline",
        className
      )}
    />
  );
}
