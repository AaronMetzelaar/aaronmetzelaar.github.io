// The loading bar — set in the display serif (the brand's distinctive face) on
// a frosted plate so it stays crisp and legible over the full-screen dot field.
export function LoadingBar({ p }: { p: number }) {
  const pct = String(Math.round(p)).padStart(2, "0");
  return (
    <div className="w-[min(84vw,460px)] border border-border bg-bg/55 px-8 py-7 backdrop-blur-md">
      <div className="flex items-end justify-between">
        <span className="font-display text-[0.7rem] text-muted-fg uppercase tracking-[0.4em]">
          Laden
        </span>
        <span className="font-display text-[clamp(2.75rem,8vw,4rem)] leading-none tracking-[-0.02em] tabular-nums">
          {pct}
          <span className="text-accent">%</span>
        </span>
      </div>
      <div className="mt-5 h-[3px] w-full bg-fg/15">
        <div
          className="h-full bg-accent"
          style={{ width: `${p}%`, transition: "width 140ms linear" }}
        />
      </div>
    </div>
  );
}
