"use client";

import { useEffect, useRef, useState } from "react";

import { SECTION_RAMP } from "@/components/site/section-dot-edges";
import { TopBlur } from "@/components/site/top-blur";
import { site } from "@/content/site";
import { darkSection } from "@/lib/premium-theme";
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
  const [overDark, setOverDark] = useState(false);
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
    // Observe the hero (#top) too, so at the very top the bar reports a neutral
    // state instead of clinging to whichever section was last active.
    for (const id of ["top", ...SECTIONS.map((s) => s.id)]) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, []);

  // The Harness section is a full-bleed dark band; invert the bar while it sits
  // behind it so the links never go dark-on-dark.
  useEffect(() => {
    const dark = document.getElementById("ai");
    if (!dark) {
      return;
    }
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = dark.getBoundingClientRect();
      // flip only while the SOLID body is behind the bar's baseline (~32px) —
      // not the dotted ramp zones at each edge, which are mostly white page
      setOverDark(r.top + SECTION_RAMP <= 32 && r.bottom - SECTION_RAMP >= 32);
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
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
  const activeLabel = SECTIONS.find((s) => s.id === active)?.label ?? "Menu";
  const triggerAria = open
    ? "Close sections menu"
    : active
      ? `Sections menu, current: ${activeLabel}`
      : "Sections menu";

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 font-terminal"
      ref={headerRef}
      style={overDark ? darkSection : undefined}
    >
      <TopBlur />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <a
          className="pointer-events-auto text-fg text-sm tracking-[0.2em] transition-colors hover:text-accent"
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
          <li>
            {/* CV is the primary CTA — an outlined accent button that fills on
                hover, so it reads as a button and stands clear of the muted
                text links */}
            <a
              className="-my-2 inline-flex items-center gap-1.5 border border-accent px-3 py-1.5 text-accent transition-colors hover:bg-accent hover:text-bg"
              href="/cv"
            >
              CV
              <span aria-hidden="true">↗</span>
            </a>
          </li>
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
              "transition-transform duration-300 text-accent",
              open && "rotate-180"
            )}
          >
            ⌄
          </span>
        </button>
      </nav>

      {/* mobile menu panel */}
      {open ? (
        <div
          className="relative z-10 pointer-events-auto border-border border-b bg-bg lg:hidden"
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
            <li className="mt-2 mb-2">
              {/* primary CTA: a filled accent button, clearly set apart from
                  the section links above it */}
              <a
                className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent text-sm uppercase tracking-[0.2em] text-accent-fg"
                href="/cv"
                onClick={() => setOpen(false)}
              >
                Read the CV
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
