"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");
const SECTIONS = site.nav.map((n) => ({ ...n, id: n.href.replace("#", "") }));

/**
 * The single navigation: a thin fixed top bar in the mono language. The initials
 * mark sits left; section links sit right with a scroll-spy active state (the job
 * the old right-edge dot-rail used to do). Below lg the links collapse into a
 * tap-to-open menu whose trigger shows the current section — "you are here".
 * The lg breakpoint matches the hero + AI map so the whole chrome flips as one.
 */
export function SiteNav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // One IntersectionObserver feeds both the desktop link state and the mobile
  // trigger label — the wayfinding the deleted progress-rail used to provide.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on a tap outside the header.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Neutral until scroll-spy reports a real section (the hero is #top, not a
  // nav section), so the trigger doesn't falsely claim "About" on load.
  const activeLabel =
    SECTIONS.find((s) => s.id === active)?.label ?? "Menu";
  const triggerAria = open
    ? "Close sections menu"
    : active
      ? `Sections menu, current: ${activeLabel}`
      : "Sections menu";

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 font-terminal"
      ref={headerRef}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <a
          className="pointer-events-auto text-sm tracking-[0.2em] transition-colors hover:text-accent"
          href="#top"
        >
          {site.initials}
        </a>

        {/* desktop links — active section in accent */}
        <ul className="pointer-events-auto hidden items-center gap-7 text-[0.7rem] uppercase tracking-[0.2em] lg:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                className={cn(
                  "transition-colors",
                  active === s.id
                    ? "text-accent"
                    : "text-muted-fg hover:text-fg"
                )}
                href={s.href}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile trigger — doubles as a "you are here" indicator */}
        <button
          aria-controls="section-menu"
          aria-expanded={open}
          aria-label={triggerAria}
          className="pointer-events-auto flex min-h-11 items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-muted-fg lg:hidden"
          onClick={() => setOpen((o) => !o)}
          type="button"
        >
          <span>{open ? "Close" : activeLabel}</span>
          <span
            aria-hidden="true"
            className={cn(
              "transition-transform duration-300",
              open ? "rotate-180 text-accent" : "text-accent"
            )}
          >
            ⌄
          </span>
        </button>
      </nav>

      {/* mobile menu panel */}
      {open ? (
        <div
          className="pointer-events-auto border-border border-b bg-bg lg:hidden"
          id="section-menu"
        >
          <ul className="mx-auto max-w-6xl px-6 py-1.5">
            {SECTIONS.map((s, i) => {
              const on = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    className="flex min-h-12 items-center gap-3 text-sm uppercase tracking-[0.2em]"
                    href={s.href}
                    onClick={() => setOpen(false)}
                  >
                    <span
                      className={cn(
                        "text-[0.7rem] tabular-nums",
                        on ? "text-accent" : "text-muted-fg"
                      )}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className={on ? "text-accent" : "text-fg"}>
                      {s.label}
                    </span>
                    {on ? (
                      <span
                        aria-hidden="true"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
