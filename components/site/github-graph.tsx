"use client";

import { useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";

export type Day = { level: number; count: number; label: string; date: string };
export type Week = (Day | null)[];

// Level → fill. 0 is a soft ink wash — dark enough that the empty grid still
// reads as a calendar on the white canvas, not blank paper; 1–4 climb the
// accent from a pale tint to full blue, so the scale is the same one colour the
// whole site uses. Built with color-mix off the tokens, so it also flips
// correctly if the graph is ever dropped into the dark section.
const LEVEL_BG = [
  "color-mix(in srgb, var(--fg) 9%, var(--bg))",
  "color-mix(in srgb, var(--accent) 32%, var(--bg))",
  "color-mix(in srgb, var(--accent) 55%, var(--bg))",
  "color-mix(in srgb, var(--accent) 78%, var(--bg))",
  "var(--accent)",
];

function tipText(count: number, label: string) {
  const noun = count === 1 ? "contribution" : "contributions";
  return `${count === 0 ? "No" : count} ${noun} · ${label}`;
}

/**
 * The GitHub contribution calendar, re-themed to the page. Weeks run left→right
 * as columns of seven days. Two bits of the site's cursor language ride along:
 * each cell lifts on hover (CSS), and a soft halo follows the pointer to pale
 * the neighbourhood it passes over — the same "the page reacts to you" motif as
 * the filings and the hero, in grid form. A single styled tooltip (not one per
 * cell) tracks whichever day the pointer is over. Still under reduced motion:
 * the halo and lift drop out, the tooltip stays.
 */
export function GithubGraph({
  weeks,
  monthLabels,
}: {
  weeks: Week[];
  monthLabels: (string | null)[];
}) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null
  );

  // Whichever cell the pointer enters, anchor the tooltip above it. Coords are
  // measured against the wrapper (not the scroll box), so they stay right even
  // when the grid is scrolled sideways on a narrow screen.
  const onOver = (e: ReactMouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-c]");
    const wrap = wrapRef.current;
    if (!(cell && wrap)) {
      return;
    }
    const c = cell.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    setTip({
      x: c.left - w.left + c.width / 2,
      y: c.top - w.top,
      text: tipText(Number(cell.dataset.c), cell.dataset.l ?? ""),
    });
  };

  // Park the halo on the pointer via CSS vars, rAF-throttled so a fast sweep
  // is one write per frame rather than one per event.
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) {
      return;
    }
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }
    const w = wrap.getBoundingClientRect();
    const x = e.clientX - w.left;
    const y = e.clientY - w.top;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      wrap.style.setProperty("--gx", `${x}px`);
      wrap.style.setProperty("--gy", `${y}px`);
      wrap.style.setProperty("--on", "1");
    });
  };

  const leave = () => {
    setTip(null);
    cancelAnimationFrame(raf.current);
    wrapRef.current?.style.setProperty("--on", "0");
  };

  return (
    <div
      className="relative max-w-2xl pt-8"
      onMouseOver={onOver}
      onPointerLeave={leave}
      onPointerMove={onMove}
      ref={wrapRef}
    >
      <div className="overflow-x-auto px-0.5 pb-0.5">
        <div className="min-w-[560px]">
          {/* month strip — one slot per week, label only where a month begins */}
          <div className="mb-1.5 flex gap-[3px]">
            {monthLabels.map((m, i) => (
              <span
                className="min-w-0 flex-1 text-[0.6rem] text-muted-fg uppercase tracking-[0.15em]"
                // biome-ignore lint/suspicious/noArrayIndexKey: slots are positional, one per week
                key={i}
              >
                {m}
              </span>
            ))}
          </div>
          {/* the calendar itself: columns of weeks, seven days each */}
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div className="flex flex-1 flex-col gap-[3px]" key={wi}>
                {week.map((day, di) =>
                  day ? (
                    <div
                      className="relative aspect-square rounded-[2px] transition-transform duration-150 ease-out hover:z-10 hover:scale-[1.4] motion-reduce:transition-none motion-reduce:hover:scale-100"
                      data-c={day.count}
                      data-l={day.label}
                      key={day.date}
                      style={{ backgroundColor: LEVEL_BG[day.level] }}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="aspect-square"
                      key={`w${wi}-p${di}`}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* pointer halo — pales the cells it passes over, off until the pointer
          arrives and under reduced motion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[var(--on,0)] transition-opacity duration-300 motion-reduce:hidden"
        style={
          {
            background:
              "radial-gradient(110px circle at var(--gx,-999px) var(--gy,-999px), color-mix(in srgb, var(--bg) 60%, transparent), transparent 70%)",
          } as CSSProperties
        }
      />

      {tip ? (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-fg px-2 py-1 text-[0.7rem] text-bg tabular-nums shadow-sm"
          style={{ left: tip.x, top: tip.y - 6 }}
        >
          {tip.text}
        </div>
      ) : null}
    </div>
  );
}
